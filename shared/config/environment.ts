// Centralized environment configuration for all microservices

export interface EnvironmentConfig {
  // Supabase Configuration
  supabase: {
    url: string
    serviceRoleKey: string
    anonKey: string
  }
  
  // Service Configuration
  service: {
    port: number
    nodeEnv: string
    frontendUrl: string
  }
  
  // CORS Configuration
  cors: {
    origin: string
    credentials: boolean
  }
  
  // Database Configuration (if using direct DB connection)
  database?: {
    host: string
    port: number
    username: string
    password: string
    database: string
  }
}

// Validates and loads environment configuration
export const loadEnvironmentConfig = (): EnvironmentConfig => {
  // Required environment variables
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY'
  ]

  // Check for missing required variables
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(varName => console.error(`- ${varName}`))
    console.error('')
    console.error('Please create a .env file in your service directory with these variables.')
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  const config: EnvironmentConfig = {
    supabase: {
      url: process.env.SUPABASE_URL!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      anonKey: process.env.SUPABASE_ANON_KEY!
    },
    service: {
      port: parseInt(process.env.PORT || '3000'),
      nodeEnv: process.env.NODE_ENV || 'development',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4000'
    },
    cors: {
      origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:4000',
      credentials: true
    }
  }

  // Optional database configuration
  if (process.env.DB_HOST) {
    config.database = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'lms_db'
    }
  }

  return config
}

// Validates Supabase URL format
export const validateSupabaseUrl = (url: string): boolean => {
  return url.startsWith('https://') && url.includes('.supabase.co')
}

// Gets service-specific environment configuration
export const getServiceConfig = (serviceName: string, defaultPort: number) => {
  const config = loadEnvironmentConfig()
  
  return {
    ...config,
    service: {
      ...config.service,
      port: parseInt(process.env.PORT || defaultPort.toString())
    }
  }
}

// Environment validation for startup
export const validateEnvironment = (serviceName: string): EnvironmentConfig => {
  try {
    const config = loadEnvironmentConfig()
    
    // Validate Supabase URL format
    if (!validateSupabaseUrl(config.supabase.url)) {
      throw new Error('Invalid Supabase URL format. Should be: https://your-project-id.supabase.co')
    }
    
    console.log(`✅ Environment configuration validated for ${serviceName}`)
    return config
  } catch (error) {
    console.error(`❌ Environment validation failed for ${serviceName}:`, error)
    process.exit(1)
  }
}
