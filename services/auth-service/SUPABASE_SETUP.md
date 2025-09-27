# Supabase Setup Instructions

## Quick Setup

1. **Create a Supabase project:**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose your organization and enter project details
   - Wait for the project to be created

2. **Get your API credentials:**
   - In your Supabase dashboard, go to **Settings > API**
   - Copy the following values:
     - **Project URL** (format: `https://your-project-id.supabase.co`)
     - **anon public** key
     - **service_role** key (keep this secret!)

3. **Create environment file:**
   - Create a `.env` file in the `services/auth-service/` directory
   - Add the following content:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Development Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:4000
```

4. **Set up the database schema:**
   - In your Supabase dashboard, go to **SQL Editor**
   - Run the SQL scripts from the `migrations/` folder in order:
     - `001_create_profiles_table.sql`
     - `002_create_user_sessions_table.sql`
     - `003_create_password_reset_tokens_table.sql`
     - `004_fix_auth_setup.sql`

5. **Restart the auth service:**
   - Stop the current services (Ctrl+C)
   - Run `./start-microservices.sh` again

## Database Schema

The auth service expects these tables to exist in your Supabase database:

- `profiles` - User profile information
- `user_sessions` - User session tracking
- `password_reset_tokens` - Password reset functionality

All migration files are in the `migrations/` directory.

## Security Notes

- Never commit your `.env` file to version control
- The `service_role` key has admin privileges - keep it secure
- Use the `anon` key for client-side operations
- The `service_role` key is only used server-side

## Troubleshooting

If you see "Supabase configuration missing!" error:
1. Make sure you created the `.env` file in the correct location
2. Verify all three environment variables are set
3. Check that the URL format is correct (must include `.supabase.co`)
4. Restart the auth service after making changes
