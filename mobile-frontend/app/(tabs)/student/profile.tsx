import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'
import { studentService } from '@/services/student-api-client'
import type { StudentProfile } from '@/types'
import { User, Mail, Calendar, Award, LogOut, Settings, Edit3 } from 'lucide-react-native'

export default function StudentProfileScreen() {
  const { user, logout } = useAuthStore()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetches student profile data
  const fetchProfile = async () => {
    try {
      const profileData = await studentService.getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Handles pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchProfile()
  }

  // Handles user logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout()
            router.replace('/(auth)/login')
          },
        },
      ]
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading profile...</Text>
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
        {/* Profile Header */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <View className="items-center">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <User size={32} color="#3b82f6" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {profile?.name || user?.name}
            </Text>
            <Text className="text-gray-600 mb-4">
              {profile?.email || user?.email}
            </Text>
            <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2">
              <Text className="text-white font-medium">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Information */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Profile Information
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Mail size={20} color="#6b7280" />
              <View className="ml-3">
                <Text className="text-sm text-gray-600">Email</Text>
                <Text className="text-gray-900">{profile?.email || user?.email}</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Calendar size={20} color="#6b7280" />
              <View className="ml-3">
                <Text className="text-sm text-gray-600">Member Since</Text>
                <Text className="text-gray-900">
                  {profile?.createdAt 
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : 'N/A'
                  }
                </Text>
              </View>
            </View>

            {profile?.bio && (
              <View className="flex-row items-start">
                <Edit3 size={20} color="#6b7280" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">Bio</Text>
                  <Text className="text-gray-900">{profile.bio}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Learning Statistics */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Learning Statistics
          </Text>
          
          <View className="flex-row space-x-4">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {profile?.enrolledCourses?.length || 0}
              </Text>
              <Text className="text-sm text-gray-600">Enrolled</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-green-600">
                {profile?.completedCourses?.length || 0}
              </Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {profile?.totalProgress || 0}%
              </Text>
              <Text className="text-sm text-gray-600">Progress</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity className="bg-white rounded-lg p-4 shadow-sm flex-row items-center">
            <Settings size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-900 font-medium">Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 shadow-sm flex-row items-center">
            <Award size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-900 font-medium">Achievements</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-red-50 rounded-lg p-4 shadow-sm flex-row items-center"
            onPress={handleLogout}
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="ml-3 text-red-600 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
