'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function StudentDashboard() {
  const stats = [
    {
      name: 'Enrolled Courses',
      value: '3',
      change: '+1 this month',
      changeType: 'positive',
      icon: BookOpenIcon
    },
    {
      name: 'Completed Assignments',
      value: '8',
      change: '+2 this week',
      changeType: 'positive',
      icon: CheckCircleIcon
    },
    {
      name: 'Pending Assignments',
      value: '2',
      change: 'Due soon',
      changeType: 'warning',
      icon: ClockIcon
    },
    {
      name: 'Live Classes Today',
      value: '1',
      change: 'React Hooks at 2 PM',
      changeType: 'info',
      icon: PlayIcon
    }
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'Submitted React Component Library Assignment',
      course: 'React Fundamentals',
      time: '2 hours ago',
      type: 'assignment'
    },
    {
      id: 2,
      title: 'Joined Live Class: JavaScript ES6+ Features',
      course: 'Advanced JavaScript',
      time: '1 day ago',
      type: 'live-class'
    },
    {
      id: 3,
      title: 'Enrolled in Node.js Backend Development',
      course: 'Node.js Backend Development',
      time: '3 days ago',
      type: 'enrollment'
    },
    {
      id: 4,
      title: 'Received grade for Database Design Project',
      course: 'Database Management',
      time: '1 week ago',
      type: 'grade'
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'React Hooks Deep Dive',
      course: 'React Fundamentals',
      time: 'Today at 2:00 PM',
      type: 'live-class'
    },
    {
      id: 2,
      title: 'Node.js API Project',
      course: 'Node.js Backend Development',
      dueDate: 'Tomorrow',
      type: 'assignment'
    },
    {
      id: 3,
      title: 'JavaScript Algorithms',
      course: 'Advanced JavaScript',
      dueDate: 'In 3 days',
      type: 'assignment'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />
      case 'live-class':
        return <PlayIcon className="h-5 w-5 text-green-500" />
      case 'enrollment':
        return <BookOpenIcon className="h-5 w-5 text-purple-500" />
      case 'grade':
        return <CheckCircleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'live-class':
        return <PlayIcon className="h-5 w-5 text-red-500" />
      case 'assignment':
        return <DocumentTextIcon className="h-5 w-5 text-orange-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your learning progress overview.</p>
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
                stat.changeType === 'warning' ? 'text-orange-600' :
                stat.changeType === 'info' ? 'text-blue-600' :
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
            <CardDescription>Your latest learning activities</CardDescription>
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
                    <p className="text-sm text-gray-500">{activity.course}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your upcoming classes and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.course}</p>
                    <p className="text-xs text-gray-400">
                      {event.time || `Due: ${event.dueDate}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <BookOpenIcon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">My Courses</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <DocumentTextIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Assignments</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <PlayIcon className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-sm font-medium">Live Classes</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <UserGroupIcon className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Chats</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
