'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  AcademicCapIcon 
} from '@heroicons/react/24/outline'

export function DashboardContent() {
  const { user } = useAuthStore()

  const stats = [
    {
      name: 'Total Courses',
      value: '12',
      change: '+2.5%',
      changeType: 'positive',
      icon: BookOpenIcon,
    },
    {
      name: 'Active Students',
      value: '1,234',
      change: '+12.3%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
    {
      name: 'Completion Rate',
      value: '87.5%',
      change: '+3.2%',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
    {
      name: 'Certificates Issued',
      value: '456',
      change: '+8.1%',
      changeType: 'positive',
      icon: AcademicCapIcon,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'course_completed',
      user: 'John Doe',
      course: 'React Fundamentals',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'new_enrollment',
      user: 'Jane Smith',
      course: 'Advanced JavaScript',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'assignment_submitted',
      user: 'Mike Johnson',
      course: 'Node.js Backend',
      time: '6 hours ago',
    },
    {
      id: 4,
      type: 'certificate_issued',
      user: 'Sarah Wilson',
      course: 'Full Stack Development',
      time: '1 day ago',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your learning management system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activities from your students and courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.type.replace('_', ' ')} in {activity.course}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Create New Course</div>
                <div className="text-sm text-gray-500">Add a new course to your curriculum</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">View Analytics</div>
                <div className="text-sm text-gray-500">Check detailed performance metrics</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Manage Students</div>
                <div className="text-sm text-gray-500">View and manage student enrollments</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
