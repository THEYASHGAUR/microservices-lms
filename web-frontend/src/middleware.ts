import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Verifies JWT token with auth service and returns user data
async function verifyUserToken(token: string): Promise<{ user: { role: string } } | null> {
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
    return data.data
  } catch (error) {
    // Log error securely without exposing sensitive information
    return null
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname)

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user is authenticated and trying to access auth pages
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // For protected routes, verify token and check role permissions
  if (token && !isPublicRoute) {
    const userData = await verifyUserToken(token)
    
    // If token is invalid or expired, redirect to login
    if (!userData) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    const userRole = userData.user.role

    // Define role-based route access
    const adminRoutes = ['/admin']
    const instructorRoutes = ['/instructor']
    const studentRoutes = ['/student']

    // Check if user is trying to access admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = userRole === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }

    // Check if user is trying to access instructor routes
    if (instructorRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'instructor' && userRole !== 'admin') {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }

    // Check if user is trying to access student routes
    if (studentRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'student' && userRole !== 'admin') {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/instructor/dashboard'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }

    // If user accesses root path, redirect to their role-based dashboard
    if (pathname === '/') {
      const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : 
                           userRole === 'instructor' ? '/instructor/dashboard' : 
                           '/student/dashboard'
      return NextResponse.redirect(new URL(dashboardPath, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
