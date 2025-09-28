# Shared Configuration for LMS Microservices

This directory contains shared configuration and utilities used across all microservices in the LMS system.

## 📁 Directory Structure

```
shared/
├── config/
│   └── environment.ts          # Centralized environment configuration
├── supabase/
│   └── index.ts               # Centralized Supabase client management
├── constants/
│   └── index.ts               # Shared constants and configurations
├── logger.ts                  # Shared logging utility
├── middlewares/               # Shared middleware functions
├── types/                     # Shared TypeScript type definitions
└── env.example               # Environment template for all services
```

## 🔧 Centralized Supabase Configuration

### Benefits
- **Single Source of Truth**: All Supabase credentials managed in one place
- **Consistent Configuration**: Same validation and setup across all services
- **Easy Maintenance**: Update credentials once, affects all services
- **Environment Validation**: Automatic validation of required environment variables
- **Connection Testing**: Built-in connection validation

### Usage

#### In Service Code
```typescript
// Instead of creating your own Supabase client
import { supabase, createUserClient } from './config/supabase'

// Use the centralized client
import { getSupabaseClient, createSupabaseUserClientWithToken } from '../../../../shared/supabase'

const supabase = getSupabaseClient()
const userClient = createSupabaseUserClientWithToken(accessToken)
```

#### Environment Setup
```bash
# Run the setup script to create .env files for all services
./scripts/setup-env.sh

# Or manually copy the template
cp shared/env.example services/your-service/.env
```

## 🌍 Environment Configuration

### Required Variables
All services require these environment variables:

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Service Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4000
```

### Service-Specific Ports
- API Gateway: 3000
- Auth Service: 3001
- User Service: 3002
- Video Service: 3003
- Chat Call Service: 3004
- Payment Service: 3005
- Notification Service: 3006
- Course Service: 3007

## 🚀 Quick Setup

1. **Get Supabase Credentials**
   ```bash
   # Go to your Supabase dashboard
   # https://supabase.com/dashboard > Settings > API
   # Copy: Project URL, anon key, service_role key
   ```

2. **Run Setup Script**
   ```bash
   ./scripts/setup-env.sh
   ```

3. **Update Credentials**
   ```bash
   # Edit the .env files created by the script
   # Update with your actual Supabase credentials
   ```

4. **Start Services**
   ```bash
   ./start-microservices.sh
   ```

## 🔒 Security Best Practices 

- **Never commit .env files** to version control
- **Use service_role key only** for server-side operations
- **Use anon key** for client-side operations
- **Validate environment** on service startup
- **Rotate keys regularly** for production environments

## 🛠️ Development Workflow

### Adding New Service
1. Create service directory in `services/`
2. Copy `shared/env.example` to `services/new-service/.env`
3. Update service-specific environment variables
4. Import shared configuration:
   ```typescript
   import { getSupabaseClient } from '../../../../shared/supabase'
   import { getServiceConfig } from '../../../../shared/config/environment'
   ```

### Updating Configuration
1. Update `shared/env.example` for new variables
2. Update `shared/config/environment.ts` for validation
3. Run `./scripts/setup-env.sh` to update all services
4. Update individual service `.env` files as needed

## 📝 Migration from Individual Configs

If you have existing services with individual Supabase configurations:

1. **Backup existing configs**
2. **Update imports** to use shared configuration
3. **Remove duplicate code** from individual service configs
4. **Test all services** to ensure they work with centralized config

## 🐛 Troubleshooting

### Common Issues

**"Supabase configuration missing"**
- Ensure all required environment variables are set
- Check that .env file exists in service directory
- Verify environment variable names match exactly

**"Invalid Supabase URL format"**
- URL must start with `https://`
- URL must contain `.supabase.co`
- Example: `https://your-project-id.supabase.co`

**"Connection validation failed"**
- Check Supabase credentials are correct
- Verify Supabase project is active
- Ensure database tables exist (run migrations)

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development DEBUG=* npm run dev
```

## 📚 API Reference

### Supabase Client Functions
- `getSupabaseClient()` - Service role client for backend operations
- `getSupabaseUserClient()` - Anon key client for user operations
- `createSupabaseUserClientWithToken(token)` - User client with access token
- `validateSupabaseConnection()` - Test database connection
- `validateSupabaseEnvironment()` - Validate environment variables

### Environment Functions
- `loadEnvironmentConfig()` - Load and validate all environment variables
- `getServiceConfig(serviceName, defaultPort)` - Get service-specific config
- `validateEnvironment(serviceName)` - Validate environment for service startup
