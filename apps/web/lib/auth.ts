// Simple auth check for demo purposes
export async function getCurrentUser() {
  // In development, return a mock admin user
  if (process.env.NODE_ENV === 'development') {
    return {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    };
  }
  
  // In production, this would check actual authentication
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/auth/me`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.warn('Failed to get current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

// Mock auth options for Next.js compatibility
export const authOptions = {
  session: {
    strategy: 'jwt' as const,
  },
  providers: [],
};