import { createClient } from '@supabase/supabase-js';

// Validate Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if Supabase credentials are properly configured
if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please set the following environment variables:');
  console.error('- SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('- SUPABASE_ANON_KEY');
  console.error('');
  console.error('You can get these from your Supabase project dashboard:');
  console.error('1. Go to https://supabase.com/dashboard');
  console.error('2. Select your project');
  console.error('3. Go to Settings > API');
  console.error('4. Copy the Project URL and API keys');
  console.error('');
  console.error('Create a .env file in the auth-service directory with:');
  console.error('SUPABASE_URL=your-project-url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('SUPABASE_ANON_KEY=your-anon-key');
  throw new Error('Supabase configuration is required');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Invalid SUPABASE_URL format!');
  console.error('URL should be: https://your-project-id.supabase.co');
  throw new Error('Invalid Supabase URL format');
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client for user operations (with anon key)
export const supabaseUser = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client initialized successfully');
