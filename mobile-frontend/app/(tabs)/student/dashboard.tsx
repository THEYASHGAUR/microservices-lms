import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { useAuthStore } from '@/stores/auth-store'
import { studentService } from '@/services/student-api-client'
import { courseService } from '@/services/course-api-client'
import type { StudentDashboard, Course } from '@/types'
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react-native'

export default function StudentDashboardScreen() {
  const { user } = useAuthStore()
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null)
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetches dashboard data and recent courses
  const fetchDashboardData = async () => {
    try {
      const [dashboardData, enrolledCourses] = await Promise.all([
        studentService.getDashboard(),
        courseService.getEnrolledCourses(),
      ])
      
      setDashboard(dashboardData)
      setRecentCourses(enrolledCourses.slice(0, 3)) // Show only 3 recent courses
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Handles pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </Text>
          <Text className="text-gray-600 mt-1">
            Continue your learning journey
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row space-x-4 mb-6">
          <View className="flex-1 bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row items-center">
              <BookOpen size={24} color="#3b82f6" />
              <View className="ml-3">
                <Text className="text-2xl font-bold text-gray-900">
                  {dashboard?.enrolledCourses || 0}
                </Text>
                <Text className="text-sm text-gray-600">Enrolled</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row items-center">
              <Award size={24} color="#10b981" />
              <View className="ml-3">
                <Text className="text-2xl font-bold text-gray-900">
                  {dashboard?.completedCourses || 0}
                </Text>
                <Text className="text-sm text-gray-600">Completed</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row space-x-4 mb-6">
          <View className="flex-1 bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row items-center">
              <TrendingUp size={24} color="#f59e0b" />
              <View className="ml-3">
                <Text className="text-2xl font-bold text-gray-900">
                  {dashboard?.totalProgress || 0}%
                </Text>
                <Text className="text-sm text-gray-600">Progress</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row items-center">
              <Clock size={24} color="#8b5cf6" />
              <View className="ml-3">
                <Text className="text-2xl font-bold text-gray-900">
                  {dashboard?.upcomingDeadlines?.length || 0}
                </Text>
                <Text className="text-sm text-gray-600">Deadlines</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Courses */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Courses
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          {recentCourses.length > 0 ? (
            <View className="space-y-3">
              {recentCourses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <Text className="font-semibold text-gray-900 mb-1">
                    {course.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-2">
                    by {course.instructorName}
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-blue-600 font-medium">
                      Continue Learning
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {course.enrolledStudents} students
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-lg p-6 shadow-sm">
              <Text className="text-gray-600 text-center">
                No courses enrolled yet. Start exploring!
              </Text>
            </View>
          )}
        </View>

        {/* Recent Activity */}
        {dashboard?.recentActivity && dashboard.recentActivity.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </Text>
            <View className="space-y-3">
              {dashboard.recentActivity.slice(0, 3).map((activity) => (
                <View key={activity.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <Text className="font-medium text-gray-900 mb-1">
                    {activity.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-2">
                    {activity.description}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Upcoming Deadlines */}
        {dashboard?.upcomingDeadlines && dashboard.upcomingDeadlines.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Deadlines
            </Text>
            <View className="space-y-3">
              {dashboard.upcomingDeadlines.slice(0, 3).map((deadline) => (
                <View key={deadline.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <Text className="font-medium text-gray-900 mb-1">
                    {deadline.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-2">
                    {deadline.courseTitle}
                  </Text>
                  <Text className="text-red-600 text-sm font-medium">
                    Due: {new Date(deadline.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
