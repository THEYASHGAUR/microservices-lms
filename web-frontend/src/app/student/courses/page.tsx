'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpenIcon, 
  ClockIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  students: number
  price: number
  isEnrolled: boolean
  hasAccess: boolean
  thumbnail: string
}

// Dummy course data
const dummyCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    instructor: 'John Doe',
    duration: '8 weeks',
    students: 150,
    price: 299,
    isEnrolled: true,
    hasAccess: true,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts',
    instructor: 'Jane Smith',
    duration: '12 weeks',
    students: 89,
    price: 399,
    isEnrolled: false,
    hasAccess: false,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications',
    instructor: 'Mike Johnson',
    duration: '10 weeks',
    students: 120,
    price: 349,
    isEnrolled: true,
    hasAccess: false,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    description: 'Learn modern design principles',
    instructor: 'Sarah Wilson',
    duration: '6 weeks',
    students: 200,
    price: 249,
    isEnrolled: false,
    hasAccess: false,
    thumbnail: '/api/placeholder/300/200'
  }
]

export default function StudentCoursesPage() {
  const [courses] = useState<Course[]>(dummyCourses)

  const handleCourseAccess = (course: Course) => {
    if (course.hasAccess) {
      // Navigate to course content
      console.log('Accessing course:', course.title)
    } else if (course.isEnrolled) {
      // Show payment required message
      alert('Payment required to access this course')
    } else {
      // Show enrollment message
      alert('Please enroll in this course first')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600">Access your enrolled courses and explore new ones</p>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.filter(course => course.isEnrolled).map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpenIcon className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {course.students} students
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {course.hasAccess ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <LockClosedIcon className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className={`text-sm ${course.hasAccess ? 'text-green-600' : 'text-red-600'}`}>
                      {course.hasAccess ? 'Access Granted' : 'Payment Required'}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleCourseAccess(course)}
                    variant={course.hasAccess ? "default" : "outline"}
                    size="sm"
                  >
                    {course.hasAccess ? (
                      <>
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Access Course
                      </>
                    ) : (
                      'Complete Payment'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Courses */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.filter(course => !course.isEnrolled).map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <BookOpenIcon className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {course.students} students
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{course.price}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}