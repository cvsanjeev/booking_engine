interface Reservation {
  id: string;
  propertyId: string;
  unitTypeId: string;
  unitId?: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  subtotal: number;
  tax: number;
  fees: number;
  discount: number;
  total: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock reservations data for development
const mockReservations: Reservation[] = [
  {
    id: '1',
    propertyId: '1',
    unitTypeId: '1',
    status: 'CONFIRMED',
    checkIn: new Date('2025-02-01'),
    checkOut: new Date('2025-02-05'),
    adults: 2,
    children: 0,
    subtotal: 14000,
    tax: 2520,
    fees: 0,
    discount: 0,
    total: 16520,
    currency: 'INR',
    customerEmail: 'john@example.com',
    customerName: 'John Doe',
    customerPhone: '+91-9876543210',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getReservation(id: string): Promise<Reservation | null> {
  // In development, return mock data
  // In production, this would fetch from the API
  if (process.env.NODE_ENV === 'development') {
    return mockReservations.find(r => r.id === id) || null;
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/reservations/${id}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch reservation');
    }
    
    return response.json();
  } catch (error) {
    console.warn('Failed to fetch reservation from API, using mock data:', error);
    return mockReservations.find(r => r.id === id) || null;
  }
}

export async function getReservationHold(holdId: string): Promise<Reservation | null> {
  // For now, use the same function as getReservation
  // In a real app, this would fetch a reservation hold specifically
  return getReservation(holdId);
}

export async function verifyPayment(reservationId: string, paymentId: string): Promise<boolean> {
  // In development, simulate payment verification
  if (process.env.NODE_ENV === 'development') {
    console.log(`Verifying payment ${paymentId} for reservation ${reservationId}`);
    return true;
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/reservations/${reservationId}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId }),
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Failed to verify payment via API:', error);
    return false;
  }
}