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
  ArrowRightStartOnRectangleIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon
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
      // Get token for logout call
      const token = localStorage.getItem('auth-token') || document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('auth-token='))
        ?.split('=')[1]
      
      if (token) {
        // Call the auth service logout
        await authService.logout(token)
      }
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
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard' as Route, icon: ChartBarIcon },
        { name: 'User Management', href: '/admin/user-management' as Route, icon: UserGroupIcon },
        { name: 'System Settings', href: '/admin/system-settings' as Route, icon: CogIcon },
        { name: 'Profile', href: '/admin/profile' as Route, icon: CogIcon },
      ]
    }

    if (user?.role === 'instructor') {
      return [
        { name: 'Dashboard', href: '/instructor/dashboard' as Route, icon: ChartBarIcon },
        { name: 'My Courses', href: '/instructor/courses' as Route, icon: BookOpenIcon },
        { name: 'Students List', href: '/instructor/students' as Route, icon: UserGroupIcon },
        { name: 'Profile', href: '/instructor/profile' as Route, icon: CogIcon },
      ]
    }

    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', href: '/student/dashboard' as Route, icon: ChartBarIcon },
        { name: 'My Courses', href: '/student/courses' as Route, icon: BookOpenIcon },
        { name: 'Chats', href: '/student/chats' as Route, icon: ChatBubbleLeftRightIcon },
        { name: 'Live Class', href: '/student/live-class' as Route, icon: ChartBarIcon },
        { name: 'Assignments', href: '/student/assignments' as Route, icon: ChartBarIcon },
        { name: 'Profile', href: '/student/profile' as Route, icon: CogIcon },
        { name: 'Payment', href: '/student/payment' as Route, icon: CreditCardIcon },
        { name: 'Settings', href: '/student/settings' as Route, icon: CogIcon }
      ]
    }

    // Default fallback - redirect to login if no role
    return []
  }

  const navigation = getNavigation()

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  // Gets role badge color and styling
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'instructor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Capitalizes role name for display
  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
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
                {user?.role && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${getRoleBadgeStyle(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="mt-2 w-full justify-start"
            >
              <ArrowRightStartOnRectangleIcon className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
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
                {user?.role && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${getRoleBadgeStyle(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="mt-2 w-full justify-start"
            >
              <ArrowRightStartOnRectangleIcon className="mr-2 h-4 w-4" />
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
              <div className="flex items-center gap-x-3">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:flex lg:flex-col lg:items-end">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                  {user?.role && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(user.role)}`}>
                      {formatRole(user.role)}
                    </span>
                  )}
                </div>
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
