import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'
import '../global.css'

export default function RootLayout() {
  const { initializeAuth, isLoading } = useAuthStore()

  useEffect(() => {
    // Initialize authentication state on app start
    initializeAuth()
  }, [initializeAuth])

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}
