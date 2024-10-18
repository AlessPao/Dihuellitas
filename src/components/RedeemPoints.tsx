import React, { useState, useEffect } from 'react'
import { Gift, Check, Camera } from 'lucide-react'

const RedeemPoints: React.FC = () => {
  const [points, setPoints] = useState(0)
  const [selectedReward, setSelectedReward] = useState('')
  const [message, setMessage] = useState('')
  const [coupon, setCoupon] = useState<{ code: string; reward: string; expiration_date: string } | null>(null)
  const [coupons, setCoupons] = useState<Array<{ code: string; reward: string; expiration_date: string; used: boolean }>>([])

  const rewards = [
    { name: '10% Discount', cost: 30 },
    { name: 'Free Grooming', cost: 50 },
    { name: 'Extra Appointment', cost: 70 },
  ]

  useEffect(() => {
    fetchPoints()
    fetchCoupons()
  }, [])

  const fetchPoints = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/points', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setPoints(data.points)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred while fetching points.')
    }
  }

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/coupons', {
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

  const handleRedeem = async () => {
    const reward = rewards.find((r) => r.name === selectedReward)
    if (reward && points >= reward.cost) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ rewardName: reward.name, rewardCost: reward.cost }),
        })

        const data = await response.json()

        if (response.ok) {
          setPoints(points - reward.cost)
          setCoupon(data)
          setMessage(`Coupon generated for ${selectedReward}!`)
          setSelectedReward('')
          fetchCoupons() // Refresh the coupons list
        } else {
          setMessage(data.message)
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.')
      }
    } else {
      setMessage('Not enough points to redeem this reward.')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Redeem Points</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-xl font-semibold mb-4 flex items-center">
          <Gift size={24} className="mr-2 text-green-600" />
          Your Points: {points}
        </p>
        {message && <p className="mb-4 text-center text-green-600">{message}</p>}
        <h2 className="text-lg font-semibold mb-2">Available Rewards:</h2>
        <ul className="mb-4">
          {rewards.map((reward) => (
            <li key={reward.name} className="mb-2 flex items-center">
              <input
                type="radio"
                id={reward.name}
                name="reward"
                value={reward.name}
                checked={selectedReward === reward.name}
                onChange={(e) => setSelectedReward(e.target.value)}
                className="mr-2"
              />
              <label htmlFor={reward.name}>
                {reward.name} - {reward.cost} points
              </label>
            </li>
          ))}
        </ul>
        <button
          onClick={handleRedeem}
          disabled={!selectedReward}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Check size={18} className="mr-2" />
          Redeem Selected Reward
        </button>
      </div>
      
      {coupon && (
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dashed border-green-500">
            <h3 className="text-2xl font-bold text-center mb-4">Your New Coupon</h3>
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">{coupon.reward}</p>
              <p className="text-3xl font-bold mb-4">{coupon.code}</p>
              <p className="text-sm text-gray-600 mb-4">Valid until {new Date(coupon.expiration_date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center justify-center text-green-600">
              <Camera size={24} className="mr-2" />
              <p className="text-sm font-medium">Take a screenshot of this coupon</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Coupons</h2>
        {coupons.map((coupon) => (
          <div key={coupon.code} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <p className="font-semibold">{coupon.reward}</p>
            <p className="text-sm">Code: {coupon.code}</p>
            <p className="text-sm">Expires: {new Date(coupon.expiration_date).toLocaleDateString()}</p>
            <p className="text-sm">{coupon.used ? 'Used' : 'Not used'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RedeemPoints