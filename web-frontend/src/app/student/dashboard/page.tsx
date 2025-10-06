'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseApiClient } from '@/services/course-api-client'
import { Course } from '@/services/course-api-client'
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

interface Activity {
  id: string
  title: string
  course: string
  time: string
  type: 'assignment' | 'live-class' | 'enrollment' | 'grade'
}

interface Event {
  id: string
  title: string
  course: string
  time?: string
  dueDate?: string
  type: 'live-class' | 'assignment'
}

export default function StudentDashboard() {
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const coursesData = await courseApiClient.getUserEnrolledCourses()
        setEnrolledCourses(coursesData)
        
        // Generate mock activities and events based on real data
        setActivities(generateMockActivities(coursesData))
        setEvents(generateMockEvents(coursesData))
        
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
        title: `Submitted ${course.title} Assignment`,
        course: course.title,
        time: `${index + 1} day${index > 0 ? 's' : ''} ago`,
        type: 'assignment'
      })
    })
    
    return activities
  }

  const generateMockEvents = (courses: Course[]): Event[] => {
    const events: Event[] = []
    
    courses.slice(0, 2).forEach((course, index) => {
      events.push({
        id: `event-${index + 1}`,
        title: `${course.title} Assignment`,
        course: course.title,
        dueDate: index === 0 ? 'Today' : 'Tomorrow',
        type: 'assignment'
      })
    })
    
    return events
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
      name: 'Enrolled Courses',
      value: enrolledCourses.length.toString(),
      change: `${enrolledCourses.length} total`,
      changeType: 'positive' as const,
      icon: BookOpenIcon
    },
    {
      name: 'Completed Assignments',
      value: '8', // This would come from progress tracking
      change: '+2 this week',
      changeType: 'positive' as const,
      icon: CheckCircleIcon
    },
    {
      name: 'Pending Assignments',
      value: '2', // This would come from progress tracking
      change: 'Due soon',
      changeType: 'warning' as const,
      icon: ClockIcon
    },
    {
      name: 'Live Classes Today',
      value: '1', // This would come from schedule data
      change: 'React Hooks at 2 PM',
      changeType: 'info' as const,
      icon: PlayIcon
    }
  ]

  const handleViewCourses = () => {
    router.push('/student/courses')
  }

  const handleViewAssignments = () => {
    router.push('/student/assignments')
  }

  const handleViewLiveClasses = () => {
    router.push('/student/live-classes')
  }

  const handleViewChats = () => {
    router.push('/student/chats')
  }

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
              {activities.map((activity) => (
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
              {events.map((event) => (
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
            <div 
              onClick={handleViewCourses}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <BookOpenIcon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">My Courses</span>
            </div>
            <div 
              onClick={handleViewAssignments}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <DocumentTextIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Assignments</span>
            </div>
            <div 
              onClick={handleViewLiveClasses}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <PlayIcon className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-sm font-medium">Live Classes</span>
            </div>
            <div 
              onClick={handleViewChats}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <UserGroupIcon className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Chats</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
