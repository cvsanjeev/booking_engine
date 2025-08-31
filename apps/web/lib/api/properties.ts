interface Property {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  currency: string;
  settings?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Mock properties data for development
const mockProperties: Property[] = [
  {
    id: '1',
    code: 'BLR001',
    name: 'Bangalore Central Apartments',
    address: '123 MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    currency: 'INR',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    code: 'DEL001',
    name: 'Delhi Executive Suites',
    address: '456 CP Street',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    currency: 'INR',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getProperties(): Promise<Property[]> {
  // In development, return mock data
  // In production, this would fetch from the API
  if (process.env.NODE_ENV === 'development') {
    return mockProperties;
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/properties`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    return response.json();
  } catch (error) {
    console.warn('Failed to fetch properties from API, using mock data:', error);
    return mockProperties;
  }
}

export async function getProperty(code: string): Promise<Property | null> {
  const properties = await getProperties();
  return properties.find(p => p.code === code) || null;
}