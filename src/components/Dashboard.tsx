import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Gift } from 'lucide-react'

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Di Huellitas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/schedule"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
        >
          <Calendar size={48} className="text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Schedule Appointment</h2>
          <p className="text-gray-600 text-center">Book a new appointment for your pet</p>
        </Link>
        <Link
          to="/redeem"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
        >
          <Gift size={48} className="text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Redeem Points</h2>
          <p className="text-gray-600 text-center">Check your points and redeem rewards</p>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard