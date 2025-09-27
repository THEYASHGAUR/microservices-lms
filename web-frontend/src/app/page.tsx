import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/server-session'

export default async function HomePage() {
  const session = await getServerSession()
  
  if (session) {
    // Redirect to role-specific dashboard
    switch (session.user?.role) {
      case 'student':
        redirect('/student/dashboard')
        break
      case 'instructor':
        redirect('/instructor/dashboard')
        break
      case 'admin':
        redirect('/admin/dashboard')
        break
      default:
        redirect('/auth/login')
    }
  } else {
    redirect('/auth/login')
  }
}
