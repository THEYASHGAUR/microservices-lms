'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseApiClient } from '@/services/course-api-client'
import { Course } from '@/services/course-api-client'
import { 
  UserGroupIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  ServerIcon
} from '@heroicons/react/24/outline'

interface Activity {
  id: string
  title: string
  user?: string
  course?: string
  instructor?: string
  reason?: string
  time: string
  type: 'registration' | 'course' | 'moderation' | 'system'
}

interface Alert {
  id: string
  title: string
  severity: 'warning' | 'error' | 'info'
  time: string
  status: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all courses for admin view
        const { courses: coursesData } = await courseApiClient.getCourses({ limit: 100 })
        setCourses(coursesData)
        
        // Generate mock activities and alerts based on real data
        setActivities(generateMockActivities(coursesData))
        setAlerts(generateMockAlerts())
        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const generateMockActivities = (courses: Course[]): Activity[] => {
    const activities: Activity[] = []
    
    courses.slice(0, 3).forEach((course, index) => {
      activities.push({
        id: `activity-${index + 1}`,
        title: 'New instructor registered',
        user: 'Dr. Sarah Johnson',
        time: `${index + 1} hour${index > 0 ? 's' : ''} ago`,
        type: 'registration'
      })
    })
    
    return activities
  }

  const generateMockAlerts = (): Alert[] => {
    return [
      {
        id: 'alert-1',
        title: 'High server load detected',
        severity: 'warning',
        time: '30 minutes ago',
        status: 'investigating'
      },
      {
        id: 'alert-2',
        title: 'Database backup overdue',
        severity: 'info',
        time: '2 hours ago',
        status: 'scheduled'
      },
      {
        id: 'alert-3',
        title: 'SSL certificate expires soon',
        severity: 'warning',
        time: '1 day ago',
        status: 'pending'
      }
    ]
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <UserGroupIcon className="h-5 w-5 text-green-500" />
      case 'course':
        return <BookOpenIcon className="h-5 w-5 text-blue-500" />
      case 'moderation':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'system':
        return <ServerIcon className="h-5 w-5 text-gray-500" />
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-red-600">{error}</p>
        </div>
        <div className="flex justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Users',
      value: '1,247', // This would come from user service
      change: '+23 this week',
      changeType: 'positive' as const,
      icon: UserGroupIcon
    },
    {
      name: 'Total Courses',
      value: courses.length.toString(),
      change: `+${courses.length} total`,
      changeType: 'positive' as const,
      icon: BookOpenIcon
    },
    {
      name: 'Active Instructors',
      value: '34', // This would come from user service
      change: '+2 this month',
      changeType: 'positive' as const,
      icon: AcademicCapIcon
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: 'All systems operational',
      changeType: 'positive' as const,
      icon: ServerIcon
    }
  ]

  const handleViewUsers = () => {
    router.push('/admin/users')
  }

  const handleViewSystemSettings = () => {
    router.push('/admin/settings')
  }

  const handleViewAnalytics = () => {
    router.push('/admin/analytics')
  }

  const handleViewSystemHealth = () => {
    router.push('/admin/system-health')
  }

  const userStats = [
    {
      role: 'Students',
      count: 1156,
      percentage: 92.7,
      color: 'bg-blue-500'
    },
    {
      role: 'Instructors',
      count: 34,
      percentage: 2.7,
      color: 'bg-green-500'
    },
    {
      role: 'Admins',
      count: 3,
      percentage: 0.2,
      color: 'bg-red-500'
    },
    {
      role: 'Pending',
      count: 54,
      percentage: 4.3,
      color: 'bg-yellow-500'
    }
  ]

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'info':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management center.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    {activity.user && (
                      <p className="text-sm text-gray-500">User: {activity.user}</p>
                    )}
                    {activity.course && (
                      <p className="text-sm text-gray-500">Course: {activity.course}</p>
                    )}
                    {activity.instructor && (
                      <p className="text-sm text-gray-500">Instructor: {activity.instructor}</p>
                    )}
                    {activity.reason && (
                      <p className="text-sm text-gray-500">Reason: {activity.reason}</p>
                    )}
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Current system status and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-500">Status: {alert.status}</p>
                    <p className="text-xs text-gray-400">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
          <CardDescription>Breakdown of users by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStats.map((stat) => (
              <div key={stat.role} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{stat.role}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">{stat.count} users</div>
                  <div className="text-sm font-medium text-gray-900">{stat.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div 
              onClick={handleViewUsers}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <UserGroupIcon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">User Management</span>
            </div>
            <div 
              onClick={handleViewSystemSettings}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <ShieldCheckIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">System Settings</span>
            </div>
            <div 
              onClick={handleViewAnalytics}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <ChartBarIcon className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
            <div 
              onClick={handleViewSystemHealth}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <ServerIcon className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium">System Health</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
