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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
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
      setSelectedProperty(mockProperties[0]) // Select first property by default
      setLoading(false)
    }, 1000)
  }, [])

  return { properties, selectedProperty, setSelectedProperty, loading, error }
}