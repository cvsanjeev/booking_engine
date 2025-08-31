import { useState, useEffect } from 'react'

interface Reservation {
  id: string
  customerName?: string
  checkIn: Date
  checkOut: Date
  status: string
  total: number
  unitTypeCode?: string
}

interface Block {
  id: string
  startDate: Date
  endDate: Date
  reason: string
  unitTypeCode?: string
}

export function useReservations(property?: any, startDate?: string, endDate?: string) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for demo
    const mockReservations: Reservation[] = [
      {
        id: '1',
        customerName: 'John Doe',
        checkIn: new Date('2025-02-01'),
        checkOut: new Date('2025-02-05'),
        status: 'CONFIRMED',
        total: 16520,
        unitTypeCode: 'premium-1bhk',
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        checkIn: new Date('2025-02-15'),
        checkOut: new Date('2025-02-18'),
        status: 'PENDING_PAYMENT',
        total: 13216,
        unitTypeCode: 'standard-1bhk',
      },
    ]

    const mockBlocks: Block[] = [
      {
        id: '1',
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-12'),
        reason: 'Maintenance',
        unitTypeCode: 'premium-1bhk',
      },
    ]

    setTimeout(() => {
      setReservations(mockReservations)
      setBlocks(mockBlocks)
      setLoading(false)
      setIsLoading(false)
    }, 1000)
  }, [property, startDate, endDate])

  return { reservations, blocks, loading, isLoading, error }
}