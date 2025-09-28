// Template Supabase configuration for microservices
// Copy this file to your service's src/config/ directory and rename to supabase.ts

// Re-export centralized Supabase configuration
// This ensures all services use the same Supabase configuration from shared folder
export { 
  getSupabaseClient as supabase,
  createSupabaseUserClientWithToken as createUserClient,
  validateSupabaseConnection,
  validateSupabaseEnvironment
} from '../supabase'

// Usage examples:
// 
// import { supabase, createUserClient } from './config/supabase'
// 
// // For service role operations (backend)
// const supabaseClient = supabase
// 
// // For user operations with access token
// const userClient = createUserClient(accessToken)
// 
// // Validate environment on startup
// validateSupabaseEnvironment()
