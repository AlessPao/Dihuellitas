import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { addDays } from 'date-fns';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to Database');
  });
});

// Helper function to check if user exists
async function userExists(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0;
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
};

// Routes
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, dni, email, password } = req.body;

  try {
    if (await userExists(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, dni, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [firstName, lastName, dni, email, hashedPassword]
    );

    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, isAdmin: user.is_admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/appointments', verifyToken, async (req, res) => {
  const { date, time } = req.body;

  try {
    await pool.query(
      'INSERT INTO appointments (user_id, appointment_date, appointment_time, attended) VALUES ($1, $2, $3, $4)',
      [req.userId, date, time, false]
    );

    await pool.query('UPDATE users SET points = points + 10 WHERE id = $1', [req.userId]);

    res.status(201).json({ message: 'Appointment scheduled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/points', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT points FROM users WHERE id = $1', [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ points: result.rows[0].points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/redeem', verifyToken, async (req, res) => {
  const { rewardCost } = req.body;

  try {
    const result = await pool.query('SELECT points FROM users WHERE id = $1', [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userPoints = result.rows[0].points;

    if (userPoints < rewardCost) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    await pool.query('UPDATE users SET points = points - $1 WHERE id = $2', [rewardCost, req.userId]);

    res.json({ message: 'Reward redeemed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT first_name, last_name, dni, email, points FROM users WHERE id = $1', [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      dni: result.rows[0].dni,
      email: result.rows[0].email,
      points: result.rows[0].points
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/pets', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets WHERE user_id = $1', [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/pets', verifyToken, async (req, res) => {
  const { name, type } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO pets (user_id, name, type) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, name, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
app.get('/api/admin/users', verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.userId]);
    if (!userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query('SELECT id, first_name, last_name, email FROM users WHERE is_admin = false');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/appointments', verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.userId]);
    if (!userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT a.id, a.appointment_date, a.appointment_time, a.attended, u.first_name, u.last_name
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.appointment_date, a.appointment_time
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/admin/appointments/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { attended } = req.body;

  try {
    const userResult = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.userId]);
    if (!userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(
      'UPDATE appointments SET attended = $1 WHERE id = $2 RETURNING *',
      [attended, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Coupon routes
app.post('/api/coupons', verifyToken, async (req, res) => {
  const { rewardName, rewardCost } = req.body;
  const userId = req.userId;

  try {
    const userResult = await pool.query('SELECT points FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userPoints = userResult.rows[0].points;

    if (userPoints < rewardCost) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    const couponCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expirationDate = addDays(new Date(), 30); // Coupon valid for 30 days

    const result = await pool.query(
      'INSERT INTO coupons (user_id, code, reward, expiration_date, used) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, couponCode, rewardName, expirationDate, false]
    );

    await pool.query('UPDATE users SET points = points - $1 WHERE id = $2', [rewardCost, userId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ message: 'Server error while creating coupon' });
  }
});

app.get('/api/coupons', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coupons WHERE user_id = $1', [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    res.status(500).json({ message: 'Server error while fetching coupons' });
  }
});

app.get('/api/admin/coupons', verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.userId]);
    
    if (userResult.rows.length === 0 || !userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT c.*, u.first_name, u.last_name, u.email
      FROM coupons c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.expiration_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all coupons:', error);
    res.status(500).json({ message: 'Server error while fetching coupons' });
  }
});

app.patch('/api/admin/coupons/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { used } = req.body;

  try {
    const userResult = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.userId]);
    if (!userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(
      'UPDATE coupons SET used = $1 WHERE id = $2 RETURNING *',
      [used, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ message: 'Server error while updating coupon' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});