import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './env'

// Re-export environment configuration
export { getSupabaseConfig, validateSupabaseEnvironment, validateSupabaseUrl } from './env'

// Creates Supabase client with service role key for backend operations
export const createSupabaseClient = (): SupabaseClient => {
  const config = getSupabaseConfig()
  
  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Creates Supabase client for user operations (with anon key)
export const createSupabaseUserClient = (): SupabaseClient => {
  const config = getSupabaseConfig()
  
  return createClient(config.url, config.anonKey)
}

// Creates Supabase client for user operations with access token
export const createSupabaseUserClientWithToken = (accessToken: string): SupabaseClient => {
  const config = getSupabaseConfig()
  
  return createClient(config.url, config.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  })
}

// Singleton instances for common use cases
let _supabaseClient: SupabaseClient | null = null
let _supabaseUserClient: SupabaseClient | null = null

// Gets or creates singleton Supabase client with service role
export const getSupabaseClient = (): SupabaseClient => {
  if (!_supabaseClient) {
    _supabaseClient = createSupabaseClient()
  }
  return _supabaseClient
}

// Gets or creates singleton Supabase client with anon key
export const getSupabaseUserClient = (): SupabaseClient => {
  if (!_supabaseUserClient) {
    _supabaseUserClient = createSupabaseUserClient()
  }
  return _supabaseUserClient
}

// Validates Supabase connection
export const validateSupabaseConnection = async (): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    
    // Try to access a simple table to validate connection
    // Use a more generic approach that works with any Supabase project
    const { data, error } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Supabase connection validation failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection validated successfully')
    return true
  } catch (error) {
    console.error('❌ Supabase connection validation failed:', error)
    return false
  }
}

// Re-export all service-specific configurations
export { AuthServiceSupabase } from './services/auth-service'
export { CourseServiceSupabase } from './services/course-service'

// Re-export migration management
export * from './migrations'

// Re-export all types
export * from './types'
