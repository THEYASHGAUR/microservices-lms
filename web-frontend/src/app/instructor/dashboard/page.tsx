'use client'

import { useEffect, useState } from 'react'
import { useRouter, Route } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseApiClient } from '@/services/course-api-client'
import { Course, CourseStats } from '@/services/course-api-client'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  EyeIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Activity {
  id: string
  title: string
  student?: string
  course: string
  time: string
  type: 'enrollment' | 'assignment' | 'rating' | 'live-class'
}

interface Task {
  id: string
  title: string
  course: string
  dueDate?: string
  time?: string
  submissions?: number
  type: 'grading' | 'live-class'
}

export default function InstructorDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [statsData, coursesData] = await Promise.all([
          courseApiClient.getInstructorCourseStats(),
          courseApiClient.getInstructorCourses()
        ])
        
        setStats(statsData)
        setCourses(coursesData)
        
        // Generate mock activities and tasks based on real data
        setActivities(generateMockActivities(coursesData))
        setTasks(generateMockTasks(coursesData))
        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        
        // Check if it's a network error
        if (err instanceof Error && err.message.includes('Unable to connect to the server')) {
          setError('API Gateway is not running. Please start the microservices using: ./start-microservices.sh')
        } else {
          setError('Failed to load dashboard data. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const generateMockActivities = (courses: Course[]): Activity[] => {
    const activities: Activity[] = []
    const now = new Date()
    
    courses.slice(0, 3).forEach((course, index) => {
      activities.push({
        id: `activity-${index + 1}`,
        title: `New student enrolled in ${course.title}`,
        student: 'Alice Johnson',
        course: course.title,
        time: `${index + 1} hour${index > 0 ? 's' : ''} ago`,
        type: 'enrollment'
      })
    })
    
    return activities
  }

  const generateMockTasks = (courses: Course[]): Task[] => {
    const tasks: Task[] = []
    
    courses.slice(0, 2).forEach((course, index) => {
      tasks.push({
        id: `task-${index + 1}`,
        title: `Grade ${course.title} Assignment`,
        course: course.title,
        dueDate: index === 0 ? 'Today' : 'Tomorrow',
        submissions: Math.floor(Math.random() * 20) + 5,
        type: 'grading'
      })
    })
    
    return tasks
  }

  // const getActivityIcon = (type: string) => {
  //   switch (type) {
  //     case 'enrollment':
  //       return <UserGroupIcon className="h-5 w-5 text-green-500" />
  //     case 'assignment':
  //       return <AcademicCapIcon className="h-5 w-5 text-blue-500" />
  //     case 'rating':
  //       return <StarIcon className="h-5 w-5 text-yellow-500" />
  //     case 'live-class':
  //       return <ClockIcon className="h-5 w-5 text-red-500" />
  //     default:
  //       return <ChartBarIcon className="h-5 w-5 text-gray-500" />
  //   }
  // }


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
          <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  {error.includes('API Gateway is not running') && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-blue-800 text-sm">
                        <strong>Quick Fix:</strong> Open your terminal in the project root and run:
                      </p>
                      <code className="block mt-1 text-blue-900 bg-blue-100 p-2 rounded text-xs">
                        ./start-microservices.sh
                      </code>
                      <p className="text-blue-700 text-xs mt-2">
                        This will start the API Gateway and all microservices.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statsData = [
    {
      name: 'Total Courses',
      value: stats?.total_courses.toString() || '0',
      change: `+${stats?.total_courses || 0} total`,
      changeType: 'positive' as const,
      icon: BookOpenIcon
    },
    {
      name: 'Total Students',
      value: stats?.total_enrollments.toString() || '0',
      change: `+${stats?.total_enrollments || 0} enrollments`,
      changeType: 'positive' as const,
      icon: UserGroupIcon
    },
    {
      name: 'Average Rating',
      value: stats?.average_rating.toFixed(1) || '0.0',
      change: `Based on ${stats?.total_reviews || 0} reviews`,
      changeType: 'positive' as const,
      icon: StarIcon
    },
    {
      name: 'Published Courses',
      value: stats?.published_courses.toString() || '0',
      change: `${stats?.draft_courses || 0} draft${(stats?.draft_courses || 0) !== 1 ? 's' : ''} pending`,
      changeType: 'info' as const,
      icon: EyeIcon
    }
  ]

  const topCourses = courses.slice(0, 3).map(course => ({
    id: course.id,
    title: course.title,
    students: course.total_enrollments,
    rating: course.average_rating,
    revenue: `$${(course.price * course.total_enrollments).toLocaleString()}`
  }))

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <UserGroupIcon className="h-5 w-5 text-green-500" />
      case 'assignment':
        return <AcademicCapIcon className="h-5 w-5 text-blue-500" />
      case 'rating':
        return <StarIcon className="h-5 w-5 text-yellow-500" />
      case 'live-class':
        return <ClockIcon className="h-5 w-5 text-red-500" />
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'grading':
        return <CheckCircleIcon className="h-5 w-5 text-orange-500" />
      case 'live-class':
        return <ClockIcon className="h-5 w-5 text-red-500" />
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const handleCreateCourse = () => {
    router.push('/instructor/courses/create')
  }

  const handleViewCourses = () => {
    router.push('/instructor/courses')
  }

  const handleViewStudents = () => {
    router.push('/instructor/students')
  }

  const handleViewAnalytics = () => {
    router.push('/instructor/analytics' as Route)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600">Manage your courses and track student progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' :
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
            <CardDescription>Latest updates from your courses</CardDescription>
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
                    {activity.student && (
                      <p className="text-sm text-gray-500">Student: {activity.student}</p>
                    )}
                    <p className="text-sm text-gray-500">{activity.course}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your pending tasks and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.course}</p>
                    {task.submissions && (
                      <p className="text-sm text-gray-500">{task.submissions} submissions</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {task.time || `Due: ${task.dueDate}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Courses</CardTitle>
          <CardDescription>Your most successful courses this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {course.students} students
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <StarIcon className="h-4 w-4 mr-1" />
                      {course.rating}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      {course.revenue}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{course.revenue}</div>
                  <div className="text-sm text-gray-500">Revenue</div>
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
          <CardDescription>Common instructor tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div 
              onClick={handleCreateCourse}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <PlusIcon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Create Course</span>
            </div>
            <div 
              onClick={handleViewCourses}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <BookOpenIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">My Courses</span>
            </div>
            <div 
              onClick={handleViewStudents}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <UserGroupIcon className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Students List</span>
            </div>
            <div 
              onClick={handleViewAnalytics}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <ChartBarIcon className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
