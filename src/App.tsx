import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import Profile from './components/Profile'
import ScheduleAppointment from './components/ScheduleAppointment'
import RedeemPoints from './components/RedeemPoints'

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? element : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/schedule" element={<PrivateRoute element={<ScheduleAppointment />} />} />
            <Route path="/redeem" element={<PrivateRoute element={<RedeemPoints />} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App