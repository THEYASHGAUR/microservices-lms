import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Create user client with token
export const createUserClient = (accessToken: string) => {
  return createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY || '', {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  })
}

// Validate Supabase connection

export const validateSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple connection test - just check if we can execute a basic query
    const { error } = await supabase
      .from('courses')
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
