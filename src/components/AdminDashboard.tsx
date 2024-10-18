import React, { useState, useEffect } from 'react'
import { Users, Calendar, Check, Gift } from 'lucide-react'

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Appointment {
  id: number;
  first_name: string;
  last_name: string;
  appointment_date: string;
  appointment_time: string;
  attended: boolean;
}

// Nuevo: Interfaz para los cupones
interface Coupon {
  id: number;
  code: string;
  reward: string;
  expiration_date: string;
  used: boolean;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'appointments' | 'coupons'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([]) // Nuevo: Estado para los cupones
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'appointments') {
      fetchAppointments()
    } else if (activeTab === 'coupons') {
      fetchCoupons() // Nuevo: Función para obtener cupones
    }
  }, [activeTab])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setUsers(data)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while fetching users.')
    }
  }

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setAppointments(data)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while fetching appointments.')
    }
  }

  // Nuevo: Función para obtener cupones
  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/coupons', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setCoupons(data)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while fetching coupons.')
    }
  }

  const handleAttendedChange = async (appointmentId: number, attended: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ attended }),
      })

      if (response.ok) {
        setAppointments(appointments.map(app => 
          app.id === appointmentId ? { ...app, attended } : app
        ))
      } else {
        const data = await response.json()
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while updating the appointment.')
    }
  }

  // Nuevo: Función para manejar el cambio de estado de un cupón
  const handleCouponUsedChange = async (couponId: number, used: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ used }),
      })

      if (response.ok) {
        setCoupons(coupons.map(coupon => 
          coupon.id === couponId ? { ...coupon, used } : coupon
        ))
      } else {
        const data = await response.json()
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while updating the coupon.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Panel de Administración</h1>
      {message && <p className="mb-4 text-center text-red-600">{message}</p>}
      <div className="mb-6 flex justify-center space-x-4">
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} className="inline-block mr-2" />
          Usuarios
        </button>
        <button
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={18} className="inline-block mr-2" />
          Citas
        </button>
        {/* Nuevo: Botón para la pestaña de cupones */}
        <button
          className={`btn ${activeTab === 'coupons' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('coupons')}
        >
          <Gift size={18} className="inline-block mr-2" />
          Cupones
        </button>
      </div>
      {activeTab === 'users' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
          <ul>
            {users.map((user: User) => (
              <li key={user.id} className="mb-2">
                {user.first_name} {user.last_name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'appointments' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Citas Programadas</h2>
          <ul>
            {appointments.map((appointment: Appointment) => (
              <li key={appointment.id} className="mb-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>Paciente:</strong> {appointment.first_name} {appointment.last_name}</p>
                    <p><strong>Fecha:</strong> {formatDate(appointment.appointment_date)}</p>
                    <p><strong>Hora:</strong> {appointment.appointment_time}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={appointment.attended}
                      onChange={(e) => handleAttendedChange(appointment.id, e.target.checked)}
                      className="mr-2"
                    />
                    {appointment.attended && <Check size={18} className="text-green-500" />}
                    <label>Atendida</label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Nuevo: Sección para mostrar los cupones */}
      {activeTab === 'coupons' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Cupones Generados</h2>
          <ul>
            {coupons.map((coupon: Coupon) => (
              <li key={coupon.id} className="mb-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>Usuario:</strong> {coupon.first_name} {coupon.last_name} ({coupon.email})</p>
                    <p><strong>Código:</strong> {coupon.code}</p>
                    <p><strong>Recompensa:</strong> {coupon.reward}</p>
                    <p><strong>Fecha de Expiración:</strong> {formatDate(coupon.expiration_date)}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={coupon.used}
                      onChange={(e) => handleCouponUsedChange(coupon.id, e.target.checked)}
                      className="mr-2"
                    />
                    {coupon.used && <Check size={18} className="text-green-500" />}
                    <label>Usado</label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard