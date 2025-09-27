'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StudentPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to student dashboard
    router.push('/student/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Redirecting to student dashboard...</div>
    </div>
  )
}
