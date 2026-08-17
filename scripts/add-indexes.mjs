import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { Client } = pg
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL.replace(/pgbouncer=true/, '')

async function applyIndexes() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL database...')
    await client.connect()
    console.log('✅ Connected!\n')

    const indexes = [
      {
        name: 'idx_profiles_status',
        sql: `CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);`
      },
      {
        name: 'idx_profiles_promo',
        sql: `CREATE INDEX IF NOT EXISTS idx_profiles_promo ON profiles(promo_year);`
      },
      {
        name: 'idx_profiles_full_name',
        sql: `CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);`
      },
      {
        name: 'idx_experiences_profile',
        sql: `CREATE INDEX IF NOT EXISTS idx_experiences_profile ON experiences(profile_id);`
      },
      {
        name: 'idx_user_roles_user_id',
        sql: `CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);`
      }
    ]

    for (const idx of indexes) {
      try {
        await client.query(idx.sql)
        console.log(`⚡ Index created/verified: ${idx.name}`)
      } catch (err) {
        console.warn(`⚠️ Error on ${idx.name}: ${err.message}`)
      }
    }

    console.log('\n✨ Database indexation successfully completed!')
  } catch (err) {
    console.error('❌ Connection or Execution error:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

applyIndexes()
