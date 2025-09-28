// Centralized Migration Management System
// This file manages all database migrations for all services

import { getSupabaseClient } from '../index'
import fs from 'fs'
import path from 'path'

export interface Migration {
  id: string
  service: string
  filename: string
  sql: string
  executed_at?: string
}

export interface MigrationResult {
  success: boolean
  migration: Migration
  error?: string
}

// Get all migration files for a specific service
export const getServiceMigrations = (serviceName: string): Migration[] => {
  const migrationsDir = path.join(__dirname, serviceName)
  
  if (!fs.existsSync(migrationsDir)) {
    return []
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  return files.map(file => {
    const filePath = path.join(migrationsDir, file)
    const sql = fs.readFileSync(filePath, 'utf8')
    
    return {
      id: file.replace('.sql', ''),
      service: serviceName,
      filename: file,
      sql
    }
  })
}

// Get all migrations across all services
export const getAllMigrations = (): Migration[] => {
  const services = ['auth-service', 'course-service', 'user-service', 'payment-service']
  const allMigrations: Migration[] = []

  services.forEach(service => {
    const serviceMigrations = getServiceMigrations(service)
    allMigrations.push(...serviceMigrations)
  })

  return allMigrations.sort((a, b) => a.id.localeCompare(b.id))
}

// Execute a single migration
export const executeMigration = async (migration: Migration): Promise<MigrationResult> => {
  try {
    const supabase = getSupabaseClient()
    
    // Execute the SQL migration
    const { error } = await supabase.rpc('exec_sql', { sql: migration.sql })
    
    if (error) {
      return {
        success: false,
        migration,
        error: error.message
      }
    }

    // Record migration execution
    await recordMigrationExecution(migration)

    return {
      success: true,
      migration: {
        ...migration,
        executed_at: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      success: false,
      migration,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Record migration execution in database
const recordMigrationExecution = async (migration: Migration): Promise<void> => {
  const supabase = getSupabaseClient()
  
  await supabase
    .from('migration_history')
    .insert({
      migration_id: migration.id,
      service: migration.service,
      filename: migration.filename,
      executed_at: new Date().toISOString()
    })
}

// Get migration execution history
export const getMigrationHistory = async (): Promise<Migration[]> => {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('migration_history')
    .select('*')
    .order('executed_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get migration history: ${error.message}`)
  }

  return data || []
}

// Check if migration has been executed
export const isMigrationExecuted = async (migrationId: string, service: string): Promise<boolean> => {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('migration_history')
    .select('id')
    .eq('migration_id', migrationId)
    .eq('service', service)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to check migration status: ${error.message}`)
  }

  return !!data
}

// Run all pending migrations for a service
export const runServiceMigrations = async (serviceName: string): Promise<MigrationResult[]> => {
  const migrations = getServiceMigrations(serviceName)
  const results: MigrationResult[] = []

  for (const migration of migrations) {
    const isExecuted = await isMigrationExecuted(migration.id, serviceName)
    
    if (!isExecuted) {
      console.log(`Running migration: ${migration.filename}`)
      const result = await executeMigration(migration)
      results.push(result)
      
      if (!result.success) {
        console.error(`Migration failed: ${migration.filename}`, result.error)
        break
      }
    } else {
      console.log(`Migration already executed: ${migration.filename}`)
    }
  }

  return results
}

// Run all pending migrations for all services
export const runAllMigrations = async (): Promise<MigrationResult[]> => {
  const services = ['auth-service', 'course-service', 'user-service', 'payment-service']
  const allResults: MigrationResult[] = []

  for (const service of services) {
    console.log(`\n🔄 Running migrations for ${service}...`)
    const serviceResults = await runServiceMigrations(service)
    allResults.push(...serviceResults)
  }

  return allResults
}

// Create migration history table if it doesn't exist
export const createMigrationHistoryTable = async (): Promise<void> => {
  const supabase = getSupabaseClient()
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS migration_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      migration_id VARCHAR(255) NOT NULL,
      service VARCHAR(100) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(migration_id, service)
    );
  `

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
  
  if (error) {
    throw new Error(`Failed to create migration history table: ${error.message}`)
  }
}
