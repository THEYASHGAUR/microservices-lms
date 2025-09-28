// Centralized Supabase Environment Configuration
// This file manages all Supabase environment variables and validation

export interface SupabaseConfig {
  url: string
  serviceRoleKey: string
  anonKey: string
}

// Validates and returns Supabase configuration
export const getSupabaseConfig = (): SupabaseConfig => {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.SUPABASE_ANON_KEY

  if (!url || !serviceRoleKey || !anonKey) {
    console.error('❌ Supabase configuration missing!')
    console.error('Please set the following environment variables:')
    console.error('- SUPABASE_URL')
    console.error('- SUPABASE_SERVICE_ROLE_KEY')
    console.error('- SUPABASE_ANON_KEY')
    console.error('')
    console.error('You can get these from your Supabase project dashboard:')
    console.error('1. Go to https://supabase.com/dashboard')
    console.error('2. Select your project')
    console.error('3. Go to Settings > API')
    console.error('4. Copy the Project URL and API keys')
    throw new Error('Supabase configuration is required')
  }

  // Validate URL format
  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    console.error('❌ Invalid SUPABASE_URL format!')
    console.error('URL should be: https://your-project-id.supabase.co')
    throw new Error('Invalid Supabase URL format')
  }

  return { url, serviceRoleKey, anonKey }
}

// Validates Supabase environment variables
export const validateSupabaseEnvironment = (): void => {
  try {
    getSupabaseConfig()
    console.log('✅ Supabase environment variables validated')
  } catch (error) {
    console.error('❌ Supabase environment validation failed:', error)
    process.exit(1)
  }
}

// Environment validation helper
export const validateSupabaseUrl = (url: string): boolean => {
  return url.startsWith('https://') && url.includes('.supabase.co')
}
