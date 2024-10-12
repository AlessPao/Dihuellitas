import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { PawPrint, User, LogOut, ChevronLeft } from 'lucide-react'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard'

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {showBackButton && (
              <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-primary-600 transition-colors">
                <ChevronLeft size={24} />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <PawPrint size={24} className="text-primary-600" />
              <span className="text-xl font-bold text-gray-800">Di Huellitas</span>
            </Link>
          </div>
          <nav>
            {isLoggedIn ? (
              <ul className="flex space-x-4">
                <li>
                  <Link to="/profile" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
                    <User size={18} className="mr-1" />
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <LogOut size={18} className="mr-1" />
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
              >
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header