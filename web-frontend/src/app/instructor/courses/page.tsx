'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseApiClient } from '@/services/course-api-client'
import { Course } from '@/services/course-api-client'
import { 
  BookOpenIcon, 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function InstructorCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const coursesData = await courseApiClient.getInstructorCourses()
        setCourses(coursesData)
        
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load courses. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleCreateCourse = () => {
    router.push('/instructor/courses/create')
  }

  const handleViewCourse = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}`)
  }

  const handleEditCourse = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}/edit`)
  }

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      try {
        await courseApiClient.deleteCourse(courseId)
        setCourses(prev => prev.filter(course => course.id !== courseId))
      } catch (err) {
        console.error('Failed to delete course:', err)
        setError('Failed to delete course. Please try again.')
      }
    }
  }

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      await courseApiClient.toggleCoursePublish(courseId, !currentStatus)
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, is_published: !currentStatus, status: !currentStatus ? 'published' : 'draft' }
          : course
      ))
    } catch (err) {
      console.error('Failed to toggle course status:', err)
      setError('Failed to update course status. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your courses and track their performance.</p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Course</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">Create your first course to get started.</p>
            <button
              onClick={handleCreateCourse}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Course</span>
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpenIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.short_description || course.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{course.total_enrollments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4" />
                      <span>{course.average_rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{course.estimated_duration}h</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${course.price}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCourse(course.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Course"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                        title="Edit Course"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Course"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTogglePublish(course.id, course.is_published)}
                      className={`flex-1 px-3 py-2 text-sm rounded-md ${
                        course.is_published
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {course.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}