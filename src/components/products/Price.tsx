'use client'

import { Settings } from '@/lib/models/SettingsModel'
import { useEffect, useState } from 'react'

export default function Price({ price }: { price: number }) {
  const [factor, setFactor] = useState<number>() // Store the factor (value field)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the factor (value) from the API
  useEffect(() => {
   const fetchFactor = async () => {
     try {
       const response = await fetch('/api/settings')
       if (!response.ok) throw new Error('Failed to fetch settings')

       const data: Settings[] = await response.json()

       // Log the API response
       console.log('API response:', data)

       // Find the setting with the name 'factor'
       const factorSetting = data.find((setting) => setting.name === 'factor')

       if (factorSetting) {
         setFactor(factorSetting.value) // Set the factor from the value field
       } else {
         throw new Error('Factor not found in settings')
       }

       setLoading(false)
     } catch (err: any) {
       setError(err.message)
       setLoading(false)
     }
   }

    fetchFactor()
  }, [])

   console.log('valuue: ', factor)

  const formatPrice = () => {
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (factor === null) return <div>Error: Factor not available</div> // Handle the case if factor is not set

    // Multiply the price by the factor and format it
    const formattedPrice = price * factor!
    return formattedPrice.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return <span>{formatPrice()}</span>
}
