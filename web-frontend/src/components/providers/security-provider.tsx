'use client'

import { useEffect } from 'react'
import { CSRFProtection } from '@/lib/csrf-protection'

/**
 * Security provider component that initializes security measures
 * Should be placed at the root of the application
 */
export function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize CSRF protection
    CSRFProtection.initialize()
  }, [])

  return <>{children}</>
}
