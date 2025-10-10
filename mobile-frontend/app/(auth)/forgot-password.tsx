import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { Link } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/auth-api-client'

// Validation schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  // Sends password reset email to user
  const onSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true)
      await authService.requestPasswordReset(data.email)
      setEmailSent(true)
      Alert.alert(
        'Email Sent',
        'Please check your email for password reset instructions.'
      )
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <View className="items-center">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Email
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            We've sent you a password reset link. Please check your email and follow the instructions.
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="bg-blue-600 rounded-lg px-6 py-3">
              <Text className="text-white font-semibold">Back to Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</Text>
          <Text className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
            )}
          </View>

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mt-6"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600">Remember your password? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
