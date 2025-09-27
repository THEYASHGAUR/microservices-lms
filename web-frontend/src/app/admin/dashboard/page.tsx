'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function AdminDashboard() {
  const stats = [
    {
      name: 'Total Users',
      value: '1,247',
      change: '+23 this week',
      changeType: 'positive',
      icon: UserGroupIcon
    },
    {
      name: 'Total Courses',
      value: '89',
      change: '+5 this month',
      changeType: 'positive',
      icon: BookOpenIcon
    },
    {
      name: 'Active Instructors',
      value: '34',
      change: '+2 this month',
      changeType: 'positive',
      icon: AcademicCapIcon
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: 'All systems operational',
      changeType: 'positive',
      icon: ServerIcon
    }
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'New instructor registered',
      user: 'Dr. Sarah Johnson',
      time: '2 hours ago',
      type: 'registration'
    },
    {
      id: 2,
      title: 'Course published for review',
      course: 'Machine Learning Fundamentals',
      instructor: 'Prof. Mike Chen',
      time: '4 hours ago',
      type: 'course'
    },
    {
      id: 3,
      title: 'User account suspended',
      user: 'john.doe@example.com',
      reason: 'Policy violation',
      time: '1 day ago',
      type: 'moderation'
    },
    {
      id: 4,
      title: 'System backup completed',
      time: '2 days ago',
      type: 'system'
    }
  ]

  const systemAlerts = [
    {
      id: 1,
      title: 'High server load detected',
      severity: 'warning',
      time: '30 minutes ago',
      status: 'investigating'
    },
    {
      id: 2,
      title: 'Database backup overdue',
      severity: 'info',
      time: '2 hours ago',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'SSL certificate expires soon',
      severity: 'warning',
      time: '1 day ago',
      status: 'pending'
    }
  ]

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
              {recentActivities.map((activity) => (
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
              {systemAlerts.map((alert) => (
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
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <UserGroupIcon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">User Management</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <ShieldCheckIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">System Settings</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <ChartBarIcon className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <ServerIcon className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium">System Health</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
