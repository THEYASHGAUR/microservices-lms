'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin dashboard
    router.push('/admin/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Redirecting to admin dashboard...</div>
    </div>
  )
}
