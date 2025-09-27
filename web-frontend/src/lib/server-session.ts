import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor' | 'admin'
}

export interface Session {
  user: User
  token: string
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return { user: data.data.user, token }
  } catch (error) {
    console.error('Error verifying session:', error)
    return null
  }
}
