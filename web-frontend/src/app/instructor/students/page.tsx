'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { studentApiClient } from '@/services/student-api-client'
import type { Student, StudentStats } from '@/types/student-types'
import { 
  UserGroupIcon, 
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')

  // Static data for instructor students
  const staticStudents: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/api/placeholder/40/40',
      enrolledAt: '2024-01-15',
      progress: 85,
      lastAccessedAt: '2024-03-20',
      status: 'active',
      courseId: '1',
      courseTitle: 'React Fundamentals',
      enrolledCourses: ['1', '2'],
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: '/api/placeholder/40/40',
      enrolledAt: '2024-02-01',
      progress: 100,
      lastAccessedAt: '2024-03-18',
      status: 'completed',
      courseId: '2',
      courseTitle: 'Advanced JavaScript',
      enrolledCourses: ['2', '3'],
      joinedAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      avatar: '/api/placeholder/40/40',
      enrolledAt: '2024-02-20',
      progress: 60,
      lastAccessedAt: '2024-03-19',
      status: 'active',
      courseId: '3',
      courseTitle: 'Node.js Backend Development',
      enrolledCourses: ['3'],
      joinedAt: '2024-02-20'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      avatar: '/api/placeholder/40/40',
      enrolledAt: '2024-01-10',
      progress: 45,
      lastAccessedAt: '2024-03-15',
      status: 'inactive',
      courseId: '1',
      courseTitle: 'React Fundamentals',
      enrolledCourses: ['1'],
      joinedAt: '2024-01-10'
    }
  ]

  const staticStats: StudentStats = {
    totalStudents: 4,
    activeStudents: 2,
    inactiveStudents: 1,
    completedStudents: 1,
    averageProgress: 72.5,
    newStudentsThisMonth: 2
  }

  // Initialize with static data
  useEffect(() => {
    setStudents(staticStudents)
    setStats(staticStats)
    setLoading(false)
  }, [])

  // Filters students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesCourse = courseFilter === 'all' || student.enrolledCourses.includes(courseFilter)
    
    return matchesSearch && matchesStatus && matchesCourse
  })

  // Gets unique courses for filter dropdown
  const uniqueCourses = Array.from(new Set(students.flatMap(student => student.enrolledCourses)))

  // Gets status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading students...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Students List</h1>
          <p className="text-gray-600">Manage and track your students' progress</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <UserGroupIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-gray-500">
                {stats.activeStudents} active, {stats.inactiveStudents} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Students</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
              <p className="text-xs text-gray-500">
                {((stats.activeStudents / stats.totalStudents) * 100).toFixed(0)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Progress</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageProgress.toFixed(0)}%</div>
              <p className="text-xs text-gray-500">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New This Month</CardTitle>
              <ClockIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newStudentsThisMonth}</div>
              <p className="text-xs text-gray-500">Recent enrollments</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Student Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Progress</p>
                    <p className="font-semibold">{student.progress}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Courses</p>
                    <p className="font-semibold">{student.enrolledCourses.length}</p>
                  </div>
                </div>

                {/* Enrolled Courses */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Enrolled Courses:</p>
                  <div className="flex flex-wrap gap-1">
                    {student.enrolledCourses.slice(0, 2).map((course: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {course}
                      </span>
                    ))}
                    {student.enrolledCourses.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{student.enrolledCourses.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
                </div>

                <div className="text-xs text-gray-500 pt-1">
                  Joined {formatDate(student.joinedAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || courseFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Students will appear here once they enroll in your courses'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
