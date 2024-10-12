import React, { useState, useEffect } from 'react'
import { User, PlusCircle } from 'lucide-react'

interface Pet {
  id: number;
  name: string;
  type: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  points: number;
}

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ firstName: '', lastName: '', dni: '', email: '', points: 0 })
  const [pets, setPets] = useState<Pet[]>([])
  const [newPetName, setNewPetName] = useState('')
  const [newPetType, setNewPetType] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUserInfo()
    fetchPets()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setUserInfo(data)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while fetching user information.')
    }
  }

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/pets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setPets(data)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while fetching pets.')
    }
  }

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPetName && newPetType) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newPetName, type: newPetType }),
        })

        const data = await response.json()

        if (response.ok) {
          const newPet: Pet = data
          setPets(prevPets => [...prevPets, newPet])
          setNewPetName('')
          setNewPetType('')
          setMessage('Pet added successfully!')
        } else {
          setMessage(data.message || 'An error occurred while adding the pet.')
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Mi Perfil</h1>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <User size={24} className="mr-2" />
          Información Personal
        </h2>
        <p><strong>Nombre:</strong> {userInfo.firstName} {userInfo.lastName}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>DNI:</strong> {userInfo.dni}</p>
        <p><strong>Puntos:</strong> {userInfo.points}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mis Mascotas</h2>
        <ul className="mb-4">
          {pets.map((pet: Pet) => (
            <li key={pet.id} className="mb-2">
              {pet.name} - {pet.type}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddPet} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Nombre de la Mascota"
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={newPetName}
            onChange={(e) => setNewPetName(e.target.value)}
            required
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={newPetType}
            onChange={(e) => setNewPetType(e.target.value)}
            required
          >
            <option value="">Seleccionar Tipo de Mascota</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Conejo">Conejo</option>
            <option value="Otro">Otro</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
          >
            <PlusCircle size={18} className="mr-2" />
            Agregar Mascota
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile