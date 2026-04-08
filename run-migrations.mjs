import pg from 'pg'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const { Client } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: '.env.local' })

const connectionString = process.env.DATABASE_URL.replace(/pgbouncer=true/, '') // Prefer direct connection or disable pgbouncer if it's transaction mode

// If DIRECT_URL is available, use it.
const dbUrl = process.env.DIRECT_URL || connectionString

async function runSql() {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Connecting to Supabase (direct)...')
    await client.connect()
    console.log('Connected!')

    const sqlPath = path.join(__dirname, 'insert_jobs.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('Executing insert_jobs.sql...')
    await client.query(sql)
    console.log('✅ Configuration successfully applied to Supabase!')

  } catch (err) {
    console.error('❌ Error applying configuration:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runSql()
