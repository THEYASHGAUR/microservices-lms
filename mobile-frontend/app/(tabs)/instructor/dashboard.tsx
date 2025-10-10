import { View, Text } from 'react-native'
import { useAuthStore } from '@/stores/auth-store'

export default function InstructorDashboardScreen() {
  const { user } = useAuthStore()

  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Text className="text-2xl font-bold text-gray-900 mb-2">
        Instructor Dashboard
      </Text>
      <Text className="text-gray-600">
        Welcome, {user?.name}!
      </Text>
      <Text className="text-gray-500 text-center mt-4 px-6">
        Instructor features coming soon...
      </Text>
    </View>
  )
}
