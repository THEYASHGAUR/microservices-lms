'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

export default function InstructorProfilePage() {
  const instructorData = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    joinDate: 'September 1, 2023',
    instructorId: 'INST-2023-001',
    department: 'Computer Science',
    specialization: 'Frontend Development',
    totalCourses: 8,
    totalStudents: 245,
    averageRating: 4.8,
    totalRevenue: '$12,450'
  }

  const teachingStats = [
    {
      title: 'Total Courses',
      value: instructorData.totalCourses,
      icon: BookOpenIcon,
      color: 'text-blue-500'
    },
    {
      title: 'Total Students',
      value: instructorData.totalStudents,
      icon: UserGroupIcon,
      color: 'text-green-500'
    },
    {
      title: 'Average Rating',
      value: instructorData.averageRating,
      icon: StarIcon,
      color: 'text-yellow-500'
    },
    {
      title: 'Total Revenue',
      value: instructorData.totalRevenue,
      icon: ChartBarIcon,
      color: 'text-purple-500'
    }
  ]

  const recentCourses = [
    {
      id: 1,
      title: 'React Fundamentals',
      students: 45,
      rating: 4.9,
      status: 'Published',
      revenue: '$2,250'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      students: 32,
      rating: 4.8,
      status: 'Published',
      revenue: '$1,920'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      students: 28,
      rating: 4.7,
      status: 'Draft',
      revenue: '$0'
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Top Rated Instructor',
      description: 'Achieved 4.8+ average rating for 3 consecutive months',
      date: 'May 2024',
      icon: TrophyIcon
    },
    {
      id: 2,
      title: '100+ Students Milestone',
      description: 'Successfully taught over 100 students',
      date: 'April 2024',
      icon: UserGroupIcon
    },
    {
      id: 3,
      title: 'Course Creator',
      description: 'Published 5+ courses on the platform',
      date: 'March 2024',
      icon: BookOpenIcon
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instructor Profile</h1>
        <p className="text-gray-600">Manage your instructor profile and track your teaching performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your instructor profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input defaultValue={instructorData.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input type="email" defaultValue={instructorData.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input defaultValue={instructorData.phone} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor ID
                  </label>
                  <Input defaultValue={instructorData.instructorId} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <Input defaultValue={instructorData.department} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <Input defaultValue={instructorData.specialization} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Teaching Statistics</CardTitle>
              <CardDescription>Your teaching performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {teachingStats.map((stat) => (
                  <div key={stat.title} className="text-center p-4 border border-gray-200 rounded-lg">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Your latest course offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
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
                          <ChartBarIcon className="h-4 w-4 mr-1" />
                          {course.revenue}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3">
                    <achievement.icon className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                      <p className="text-xs text-gray-400">{achievement.date}</p>
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
                <span className="text-sm font-medium">{instructorData.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Department</span>
                <span className="text-sm font-medium">{instructorData.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verification</span>
                <span className="text-sm font-medium text-green-600">Verified</span>
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
                Create New Course
              </Button>
              <Button className="w-full" variant="outline">
                View Analytics
              </Button>
              <Button className="w-full" variant="outline">
                Manage Students
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
