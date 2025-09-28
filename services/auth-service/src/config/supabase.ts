// Re-export centralized Supabase configuration with service-specific operations
import { 
  getSupabaseClient,
  getSupabaseUserClient,
  validateSupabaseConnection,
  validateSupabaseEnvironment,
  AuthServiceSupabase
} from '#shared/supabase'

// Export the client instance (not the function)
export const supabase = getSupabaseClient()
export const supabaseUser = getSupabaseUserClient()

// Re-export utilities
export { validateSupabaseConnection, validateSupabaseEnvironment }

// Create service instance for easy use
export const authSupabase = new AuthServiceSupabase()
