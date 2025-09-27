'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InstructorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to instructor dashboard
    router.push('/instructor/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Redirecting to instructor dashboard...</div>
    </div>
  )
}
