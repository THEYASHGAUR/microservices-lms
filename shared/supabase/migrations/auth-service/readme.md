# Auth Service Database Migrations

This folder contains SQL migration files for setting up a **future-proof authentication database schema** in Supabase following best practices.

## Migration Files

### 001_create_profiles_table.sql
- **Users Table**: Core identity data (email, password_hash, role, is_active)
- **Profiles Table**: Extendable user info (full_name, avatar_url, bio, settings)
- **Row Level Security (RLS)** policies for data protection
- **Automatic triggers** for profile creation and timestamp updates
- **Role-based access control** (ADMIN, INSTRUCTOR, STUDENT)

### 002_create_user_sessions_table.sql
- **User Sessions Table**: Track logins & active sessions
- **JWT/Refresh token management** with device tracking
- **Session cleanup functions** for expired sessions
- **"Logout all devices"** functionality
- **Device fingerprinting** with JSONB storage

### 003_create_password_reset_tokens_table.sql
- **Password Reset Tokens**: Secure password recovery flow
- **Email Verification Tokens**: Optional email confirmation flow
- **Secure token generation** with configurable expiration
- **Token validation functions** with automatic cleanup
- **One-time use tokens** with usage tracking

## How to Run Migrations

1. **Copy the SQL content** from each migration file
2. **Open Supabase Dashboard** → SQL Editor
3. **Paste and execute** each migration in order (001, 002, 003)
4. **Verify tables** are created in the Database section

## Environment Variables Required

```env
# Backend
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:4000

# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema Overview

```
users (core auth)
├── profiles (extra info - keeps users lean)
├── user_sessions (JWT/refresh + device tracking)
├── password_reset_tokens (recovery flow)
└── email_verification_tokens (onboarding flow)
```

## Best Practices Implemented

### 🔒 Security
- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** with proper policies
- **Secure token generation** using cryptographically secure random bytes
- **Token hashing** for storage security
- **One-time use tokens** with expiration tracking

### ⚡ Performance
- **Optimized indexes** on frequently queried columns
- **GIN indexes** for JSONB fields
- **Efficient cleanup functions** with row count returns
- **Proper foreign key constraints** with CASCADE deletes

### 🛠️ Maintainability
- **Clean table separation** (users vs profiles)
- **Flexible JSONB settings** for future extensions
- **Comprehensive function library** for common operations
- **Automatic timestamp management** with triggers
- **Consistent naming conventions** and documentation

### 🔄 Scalability
- **Device tracking** for multi-device support
- **Session management** with configurable expiration
- **Token-based flows** for password reset and email verification
- **Admin capabilities** for user management
- **Extensible schema** for future features

## Key Features

- ✅ **Future-proof schema** following industry best practices
- ✅ **Complete auth flows** (login, signup, password reset, email verification)
- ✅ **Multi-device session management**
- ✅ **Role-based permissions** (ADMIN, INSTRUCTOR, STUDENT)
- ✅ **Automatic cleanup** of expired data
- ✅ **Device fingerprinting** and security tracking
- ✅ **Flexible user settings** with JSONB storage
- ✅ **Comprehensive audit trail** with timestamps
