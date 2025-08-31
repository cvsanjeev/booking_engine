import { useState, useEffect } from 'react'

interface Reservation {
  id: string
  customerName?: string
  checkIn: Date
  checkOut: Date
  status: string
  total: number
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
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
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        checkIn: new Date('2025-02-15'),
        checkOut: new Date('2025-02-18'),
        status: 'PENDING_PAYMENT',
        total: 13216,
      },
    ]

    setTimeout(() => {
      setReservations(mockReservations)
      setLoading(false)
    }, 1000)
  }, [])

  return { reservations, loading, error }
}