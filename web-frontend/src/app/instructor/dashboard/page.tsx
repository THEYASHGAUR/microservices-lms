'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

export default function InstructorDashboard() {
  const stats = [
    {
      name: 'Total Courses',
      value: '5',
      change: '+1 this month',
      changeType: 'positive',
      icon: BookOpenIcon
    },
    {
      name: 'Total Students',
      value: '127',
      change: '+12 this week',
      changeType: 'positive',
      icon: UserGroupIcon
    },
    {
      name: 'Average Rating',
      value: '4.8',
      change: '+0.2 this month',
      changeType: 'positive',
      icon: StarIcon
    },
    {
      name: 'Published Courses',
      value: '4',
      change: '1 draft pending',
      changeType: 'info',
      icon: EyeIcon
    }
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'New student enrolled in React Fundamentals',
      student: 'Alice Johnson',
      course: 'React Fundamentals',
      time: '1 hour ago',
      type: 'enrollment'
    },
    {
      id: 2,
      title: 'Assignment submitted for grading',
      student: 'Mike Chen',
      course: 'Node.js Backend Development',
      time: '3 hours ago',
      type: 'assignment'
    },
    {
      id: 3,
      title: 'Course rating received',
      student: 'Sarah Wilson',
      course: 'Advanced JavaScript',
      time: '1 day ago',
      type: 'rating'
    },
    {
      id: 4,
      title: 'Live class completed',
      course: 'React Fundamentals',
      time: '2 days ago',
      type: 'live-class'
    }
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: 'Grade React Component Library Assignment',
      course: 'React Fundamentals',
      dueDate: 'Today',
      submissions: 15,
      type: 'grading'
    },
    {
      id: 2,
      title: 'Live Class: JavaScript ES6+ Features',
      course: 'Advanced JavaScript',
      time: 'Tomorrow at 2:00 PM',
      type: 'live-class'
    },
    {
      id: 3,
      title: 'Review Node.js API Project',
      course: 'Node.js Backend Development',
      dueDate: 'In 2 days',
      submissions: 8,
      type: 'grading'
    }
  ]

  const topCourses = [
    {
      id: 1,
      title: 'React Fundamentals',
      students: 45,
      rating: 4.9,
      revenue: '$2,250'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      students: 32,
      rating: 4.8,
      revenue: '$1,920'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      students: 28,
      rating: 4.7,
      revenue: '$1,680'
    }
  ]

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600">Manage your courses and track student progress.</p>
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
              {recentActivities.map((activity) => (
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
              {upcomingTasks.map((task) => (
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
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <PlusIcon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Create Course</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <BookOpenIcon className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">My Courses</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <UserGroupIcon className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Students List</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <ChartBarIcon className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
