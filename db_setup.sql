-- ... (previous table creations)

-- Add 'attended' column to appointments table
ALTER TABLE appointments ADD COLUMN attended BOOLEAN DEFAULT FALSE;

-- ... (rest of the SQL setup)