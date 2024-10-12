import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, Shield } from 'lucide-react'

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="text-center mb-16 py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a Di Huellitas</h1>
        <p className="text-xl mb-8">Tu socio de confianza en el cuidado de mascotas</p>
        <Link
          to="/register"
          className="btn btn-primary text-lg font-semibold"
        >
          Comienza Ahora
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="card flex flex-col items-center text-center">
          <Heart size={48} className="text-primary-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Cuidado Compasivo</h2>
          <p className="text-gray-600">Tratamos a tus mascotas con amor y dedicación</p>
        </div>
        <div className="card flex flex-col items-center text-center">
          <Clock size={48} className="text-primary-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Horarios Convenientes</h2>
          <p className="text-gray-600">Abierto los 7 días de la semana para tu comodidad</p>
        </div>
        <div className="card flex flex-col items-center text-center">
          <Shield size={48} className="text-primary-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Cuidado Experto</h2>
          <p className="text-gray-600">Nuestro equipo experimentado asegura lo mejor para tu mascota</p>
        </div>
      </section>

      <section className="mb-16 flex items-center">
        <div className="w-1/2 pr-8">
          <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Veterinario con perro" className="rounded-lg shadow-lg" />
        </div>
        <div className="w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sobre Di Huellitas</h2>
          <p className="text-gray-600 mb-4">
            Di Huellitas es una clínica veterinaria de vanguardia dedicada a proporcionar un cuidado excepcional para tus queridas mascotas. 
            Nuestro equipo de veterinarios y personal experimentado está comprometido a garantizar la salud y felicidad de cada animal 
            que pasa por nuestras puertas.
          </p>
          <p className="text-gray-600 mb-4">
            Con instalaciones modernas y un enfoque compasivo, ofrecemos una amplia gama de servicios que incluyen atención preventiva, 
            diagnósticos, cirugía y servicios de emergencia. En Di Huellitas, el bienestar de tu mascota es nuestra máxima prioridad.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestra Misión</h2>
        <p className="text-gray-600 mb-4">
          Nuestra misión es proporcionar servicios veterinarios de alta calidad a través de una atención personalizada y un enfoque integral 
          del bienestar de las mascotas. Nos comprometemos a mejorar la salud y la calidad de vida de las mascotas fomentando una relación 
          de confianza entre nuestros clientes y profesionales veterinarios. A través de nuestro sistema de citas en línea, buscamos 
          simplificar la gestión de servicios y proporcionar una experiencia cómoda y eficiente para nuestros usuarios.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestra Visión</h2>
        <p className="text-gray-600 mb-4">
          En Veterinaria Di Huellitas, aspiramos a ser la clínica veterinaria líder de la comunidad, reconocida por nuestro inquebrantable 
          compromiso con la salud y el bienestar de las mascotas. Visualizamos un futuro donde cada mascota reciba el cuidado que merece, 
          con profesionales capacitados y compasivos que garanticen un trato humano y profesional.
        </p>
      </section>
    </div>
  )
}

export default LandingPage