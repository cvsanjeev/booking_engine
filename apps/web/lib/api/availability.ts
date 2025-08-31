interface AvailabilitySearchParams {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
}

interface UnitTypeAvailability {
  id: string;
  name: string;
  baseRate: number;
  description?: string;
  amenities: string[];
  images: string[];
  available: number;
  pricing: {
    subtotal: number;
    tax: number;
    fees: number;
    total: number;
  };
}

// Mock availability data for development
export async function searchAvailability(params: AvailabilitySearchParams): Promise<UnitTypeAvailability[]> {
  // In development, return mock data
  if (process.env.NODE_ENV === 'development') {
    const nights = Math.ceil((params.checkOut.getTime() - params.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return [
      {
        id: '1',
        name: '1BHK Premium',
        baseRate: 4130,
        description: 'Spacious 1BHK apartment with premium amenities',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Workspace'],
        images: [],
        available: 4,
        pricing: {
          subtotal: 4130 * nights,
          tax: Math.round(4130 * nights * 0.18),
          fees: 0,
          total: Math.round(4130 * nights * 1.18),
        },
      },
      {
        id: '2',
        name: '1BHK Standard',
        baseRate: 3304,
        description: 'Comfortable 1BHK apartment with essential amenities',
        amenities: ['WiFi', 'AC', 'Kitchen'],
        images: [],
        available: 2,
        pricing: {
          subtotal: 3304 * nights,
          tax: Math.round(3304 * nights * 0.18),
          fees: 0,
          total: Math.round(3304 * nights * 1.18),
        },
      },
      {
        id: '3',
        name: 'Studio',
        baseRate: 2596,
        description: 'Cozy studio apartment perfect for solo travelers',
        amenities: ['WiFi', 'AC', 'Kitchenette'],
        images: [],
        available: 2,
        pricing: {
          subtotal: 2596 * nights,
          tax: Math.round(2596 * nights * 0.18),
          fees: 0,
          total: Math.round(2596 * nights * 1.18),
        },
      },
    ];
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const searchParams = new URLSearchParams({
      propertyId: params.propertyId,
      checkIn: params.checkIn.toISOString(),
      checkOut: params.checkOut.toISOString(),
      adults: params.adults.toString(),
      children: params.children.toString(),
    });
    
    const response = await fetch(`${apiUrl}/api/properties/${params.propertyId}/availability?${searchParams}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to search availability');
    }
    
    return response.json();
  } catch (error) {
    console.warn('Failed to search availability from API, using mock data:', error);
    // Return mock data as fallback
    return searchAvailability(params);
  }
}