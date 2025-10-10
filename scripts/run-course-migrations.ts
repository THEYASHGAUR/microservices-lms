#!/usr/bin/env node

import { runServiceMigrations } from '../shared/supabase/migrations/index'

async function runMigrations() {
  try {
    console.log('🚀 Running course service database migrations...')

    const results = await runServiceMigrations('course-service')

    console.log(`✅ Migration completed. ${results.length} migrations processed.`)

    for (const result of results) {
      if (result.success) {
        console.log(`✅ ${result.migration.filename}`)
      } else {
        console.error(`❌ ${result.migration.filename}: ${result.error}`)
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
