import { useState, useEffect } from 'react'

interface Property {
  id: string
  code: string
  name: string
  address?: string
  city?: string
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for demo
    const mockProperties: Property[] = [
      {
        id: '1',
        code: 'BLR001',
        name: 'Bangalore Central Apartments',
        address: '123 MG Road',
        city: 'Bangalore',
      },
      {
        id: '2',
        code: 'DEL001',
        name: 'Delhi Executive Suites',
        address: '456 CP Street',
        city: 'New Delhi',
      },
    ]

    setTimeout(() => {
      setProperties(mockProperties)
      setLoading(false)
    }, 1000)
  }, [])

  return { properties, loading, error }
}