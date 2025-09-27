'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courseApiClient } from '@/services/course-api-client'
import type { Course, CourseStats } from '@/types/course-types'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  StarIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Static data for instructor courses
  const staticCourses: Course[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React development',
      instructor: 'Dr. Sarah Johnson',
      duration: '8 weeks',
      students: 45,
      rating: 4.9,
      price: 99,
      thumbnail: '/api/placeholder/300/200',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-03-20'
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts',
      instructor: 'Dr. Sarah Johnson',
      duration: '10 weeks',
      students: 32,
      rating: 4.8,
      price: 129,
      thumbnail: '/api/placeholder/300/200',
      status: 'published',
      createdAt: '2024-02-01',
      updatedAt: '2024-03-15'
    },
    {
      id: '3',
      title: 'Node.js Backend Development',
      description: 'Build robust backend applications with Node.js',
      instructor: 'Dr. Sarah Johnson',
      duration: '12 weeks',
      students: 28,
      rating: 4.7,
      price: 149,
      thumbnail: '/api/placeholder/300/200',
      status: 'draft',
      createdAt: '2024-02-20',
      updatedAt: '2024-03-10'
    }
  ]

  const staticStats: CourseStats = {
    totalCourses: 3,
    publishedCourses: 2,
    draftCourses: 1,
    totalStudents: 105,
    totalRevenue: 12450,
    averageRating: 4.8
  }

  // Initialize with static data
  useEffect(() => {
    setCourses(staticCourses)
    setStats(staticStats)
    setLoading(false)
  }, [])

  // Handles course deletion
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    
    try {
      await courseApiClient.deleteCourse(courseId)
      setCourses(courses.filter(course => course.id !== courseId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course')
    }
  }

  // Formats date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Gets status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Gets level badge color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800'
      case 'intermediate':
        return 'bg-orange-100 text-orange-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading courses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your courses and track student enrollments</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Create New Course
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-gray-500">
                {stats.publishedCourses} published, {stats.draftCourses} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Enrollments</CardTitle>
              <UserGroupIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
              <p className="text-xs text-gray-500">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              <StarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-gray-500">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Published Courses</CardTitle>
              <EyeIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedCourses}</div>
              <p className="text-xs text-gray-500">
                {((stats.publishedCourses / stats.totalCourses) * 100).toFixed(0)}% of total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpenIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{course.enrolledStudents} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{course.duration}h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">${course.price}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-xs text-gray-500 pt-1">
                  Created {formatDate(course.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first course</p>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
