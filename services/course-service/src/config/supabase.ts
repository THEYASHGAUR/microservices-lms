// Re-export centralized Supabase configuration with service-specific operations
export { 
  getSupabaseClient as supabase,
  createSupabaseUserClientWithToken as createUserClient,
  validateSupabaseConnection,
  validateSupabaseEnvironment,
  CourseServiceSupabase
} from '../../../shared/supabase'

// Create service instance for easy use
export const courseSupabase = new CourseServiceSupabase()
