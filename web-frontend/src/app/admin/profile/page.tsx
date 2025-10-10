'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ShieldCheckIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function AdminProfilePage() {
  const adminData = {
    name: 'Admin User',
    email: 'admin@lms.com',
    phone: '+1 (555) 000-0000',
    joinDate: 'January 1, 2024',
    adminId: 'ADMIN-001',
    role: 'Super Administrator',
    permissions: 'Full Access',
    lastLogin: '2 hours ago',
    totalActions: 1247
  }

  const systemStats = [
    {
      title: 'Total Users',
      value: '1,247',
      icon: UserGroupIcon,
      color: 'text-blue-500'
    },
    {
      title: 'Total Courses',
      value: '89',
      icon: BookOpenIcon,
      color: 'text-green-500'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: ServerIcon,
      color: 'text-green-500'
    },
    {
      title: 'Active Sessions',
      value: '156',
      icon: ChartBarIcon,
      color: 'text-purple-500'
    }
  ]

  const recentActions = [
    {
      id: 1,
      action: 'User account suspended',
      target: 'john.doe@example.com',
      time: '30 minutes ago',
      type: 'moderation'
    },
    {
      id: 2,
      action: 'Course approved for publication',
      target: 'React Advanced Patterns',
      time: '1 hour ago',
      type: 'approval'
    },
    {
      id: 3,
      action: 'System backup completed',
      target: 'Database backup',
      time: '2 hours ago',
      type: 'system'
    },
    {
      id: 4,
      action: 'New instructor verified',
      target: 'Dr. Sarah Johnson',
      time: '3 hours ago',
      type: 'verification'
    }
  ]

  const systemAlerts = [
    {
      id: 1,
      title: 'High server load detected',
      severity: 'warning',
      time: '15 minutes ago',
      status: 'investigating'
    },
    {
      id: 2,
      title: 'SSL certificate expires in 30 days',
      severity: 'info',
      time: '1 hour ago',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Database optimization completed',
      severity: 'success',
      time: '2 hours ago',
      status: 'resolved'
    }
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'moderation':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'approval':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'system':
        return <ServerIcon className="h-5 w-5 text-blue-500" />
      case 'verification':
        return <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
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
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'info':
        return <ServerIcon className="h-5 w-5 text-blue-500" />
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-600">Manage your administrator profile and system overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Information</CardTitle>
              <CardDescription>Update your admin profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input defaultValue={adminData.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input type="email" defaultValue={adminData.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input defaultValue={adminData.phone} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin ID
                  </label>
                  <Input defaultValue={adminData.adminId} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <Input defaultValue={adminData.role} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <Input defaultValue={adminData.permissions} disabled />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* System Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Current system statistics and health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {systemStats.map((stat) => (
                  <div key={stat.title} className="text-center p-4 border border-gray-200 rounded-lg">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Administrative Actions</CardTitle>
              <CardDescription>Your latest system actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(action.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{action.action}</p>
                      <p className="text-sm text-gray-500">Target: {action.target}</p>
                      <p className="text-xs text-gray-400">{action.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-xs text-gray-500">Status: {alert.status}</p>
                      <p className="text-xs text-gray-400">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium">{adminData.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm font-medium">{adminData.lastLogin}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Actions</span>
                <span className="text-sm font-medium">{adminData.totalActions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                User Management
              </Button>
              <Button className="w-full" variant="outline">
                System Settings
              </Button>
              <Button className="w-full" variant="outline">
                View Analytics
              </Button>
              <Button className="w-full" variant="outline">
                System Health
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
