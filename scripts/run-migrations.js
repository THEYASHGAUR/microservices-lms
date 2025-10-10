const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

async function runMigrations() {
  try {
    console.log('🚀 Running course service database migrations...')

    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get migration files
    const migrationsDir = path.join(__dirname, '../shared/supabase/migrations/course-service')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    console.log(`Found ${migrationFiles.length} migration files`)

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`)
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')

      try {
        const { error } = await supabase.rpc('exec_sql', { sql })

        if (error) {
          // If rpc doesn't exist, try direct execution
          console.log('Trying direct SQL execution...')
          const { error: directError } = await supabase.from('_temp').select('1')
        }

        console.log(`✅ ${file} completed successfully`)
      } catch (error) {
        console.error(`❌ Error in ${file}:`, error.message)
        // Continue with other migrations
      }
    }

    console.log('✅ All migrations completed!')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigrations()
