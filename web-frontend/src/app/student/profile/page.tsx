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
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function StudentProfilePage() {
  const studentData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 15, 2024',
    studentId: 'STU-2024-001',
    level: 'Intermediate',
    totalCourses: 5,
    completedCourses: 3,
    certificates: 2,
    studyHours: 45
  }

  const enrolledCourses = [
    {
      id: 1,
      title: 'React Fundamentals',
      progress: 85,
      status: 'In Progress',
      instructor: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      progress: 100,
      status: 'Completed',
      instructor: 'Prof. Mike Chen'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      progress: 60,
      status: 'In Progress',
      instructor: 'Dr. Emily Davis'
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'First Course Completed',
      description: 'Completed your first course successfully',
      date: 'March 15, 2024',
      icon: TrophyIcon
    },
    {
      id: 2,
      title: 'Consistent Learner',
      description: 'Studied for 30 consecutive days',
      date: 'April 10, 2024',
      icon: CheckCircleIcon
    },
    {
      id: 3,
      title: 'Top Performer',
      description: 'Scored 95% in Advanced JavaScript',
      date: 'May 5, 2024',
      icon: TrophyIcon
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600">Manage your personal information and track your learning progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input defaultValue={studentData.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input type="email" defaultValue={studentData.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input defaultValue={studentData.phone} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <Input defaultValue={studentData.studentId} disabled />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Courses */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Your current course enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
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
          {/* Profile Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Total Courses</span>
                </div>
                <span className="font-semibold">{studentData.totalCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="font-semibold">{studentData.completedCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">Certificates</span>
                </div>
                <span className="font-semibold">{studentData.certificates}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Study Hours</span>
                </div>
                <span className="font-semibold">{studentData.studyHours}h</span>
              </div>
            </CardContent>
          </Card>

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
                <span className="text-sm font-medium">{studentData.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Level</span>
                <span className="text-sm font-medium">{studentData.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
