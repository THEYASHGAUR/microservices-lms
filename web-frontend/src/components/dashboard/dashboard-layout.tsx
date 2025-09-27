'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { Route } from 'next'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { authService } from '@/services/auth-api-client'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  name: string
  href: Route
  icon: React.ComponentType<{ className?: string }>
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // Call the auth service logout
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state and storage
      logout()
      localStorage.removeItem('auth-token')
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Redirect to login page
      router.push('/auth/login')
    }
  }

  const getNavigation = (): NavigationItem[] => {
    const baseNavigation = [
      { name: 'Dashboard', href: '/dashboard' as Route, icon: ChartBarIcon },
    ]

    if (user?.role === 'admin') {
      return [
        ...baseNavigation,
        { name: 'User Management', href: '/dashboard/users' as Route, icon: UserGroupIcon },
        { name: 'System Settings', href: '/dashboard/settings' as Route, icon: CogIcon },
      ]
    }

    if (user?.role === 'instructor') {
      return [
        ...baseNavigation,
        { name: 'My Courses', href: '/dashboard/courses' as Route, icon: BookOpenIcon },
        { name: 'Students', href: '/dashboard/students' as Route, icon: UserGroupIcon },
        { name: 'Profile', href: '/dashboard/profile' as Route, icon: CogIcon },
      ]
    }

    if (user?.role === 'student') {
      return [
        ...baseNavigation,
        { name: 'My Courses', href: '/dashboard/courses' as Route, icon: BookOpenIcon },
        { name: 'Assignments', href: '/dashboard/assignments' as Route, icon: ChartBarIcon },
        { name: 'Grades', href: '/dashboard/grades' as Route, icon: ChartBarIcon },
        { name: 'Profile', href: '/dashboard/profile' as Route, icon: CogIcon },
      ]
    }

    return baseNavigation
  }

  const navigation = getNavigation()

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">LMS</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-500' : ''}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">LMS</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-500' : ''}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="mt-2 w-full justify-start"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </Button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center gap-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden lg:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
