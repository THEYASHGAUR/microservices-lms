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
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }

  try {
    // In a real app, you would verify the token with your auth service
    // For now, we'll simulate a session
    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const user = await response.json()
    return { user, token }
  } catch (error) {
    console.error('Error verifying session:', error)
    return null
  }
}
