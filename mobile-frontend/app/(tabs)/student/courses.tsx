import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native'
import { courseService } from '@/services/course-api-client'
import type { Course } from '@/types'
import { Search, BookOpen, Star, Users } from 'lucide-react-native'

export default function StudentCoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all')

  // Fetches courses based on active tab
  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      let coursesData: Course[] = []

      if (activeTab === 'enrolled') {
        coursesData = await courseService.getEnrolledCourses()
      } else {
        const response = await courseService.getCourses(1, 20)
        coursesData = response.courses
      }

      setCourses(coursesData)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [activeTab])

  // Handles pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchCourses()
  }

  // Filters courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Courses</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Search size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tab Navigation */}
        <View className="flex-row space-x-4">
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${
              activeTab === 'all' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onPress={() => setActiveTab('all')}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'all' ? 'text-white' : 'text-gray-700'
              }`}
            >
              All Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${
              activeTab === 'enrolled' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onPress={() => setActiveTab('enrolled')}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'enrolled' ? 'text-white' : 'text-gray-700'
              }`}
            >
              My Courses
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Courses List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-lg text-gray-600">Loading courses...</Text>
          </View>
        ) : filteredCourses.length > 0 ? (
          <View className="py-4 space-y-4">
            {filteredCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <View className="flex-row">
                  <View className="w-16 h-16 bg-gray-200 rounded-lg mr-4 items-center justify-center">
                    <BookOpen size={24} color="#6b7280" />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">
                      {course.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-2">
                      by {course.instructorName}
                    </Text>
                    
                    <View className="flex-row items-center space-x-4">
                      <View className="flex-row items-center">
                        <Users size={14} color="#6b7280" />
                        <Text className="text-gray-600 text-sm ml-1">
                          {course.enrolledStudents || 0}
                        </Text>
                      </View>
                      
                      {course.rating && (
                        <View className="flex-row items-center">
                          <Star size={14} color="#fbbf24" fill="#fbbf24" />
                          <Text className="text-gray-600 text-sm ml-1">
                            {course.rating.toFixed(1)}
                          </Text>
                        </View>
                      )}
                      
                      <Text className="text-blue-600 font-medium text-sm">
                        ${course.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center py-8">
            <BookOpen size={48} color="#d1d5db" />
            <Text className="text-lg text-gray-600 mt-4 text-center">
              {activeTab === 'enrolled' 
                ? 'No enrolled courses yet' 
                : 'No courses found'
              }
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              {activeTab === 'enrolled' 
                ? 'Start exploring courses to enroll' 
                : 'Try adjusting your search'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
