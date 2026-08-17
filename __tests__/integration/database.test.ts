import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { Client } = pg

describe('Integration Tests - PostgreSQL Database', () => {
  let client: pg.Client

  beforeAll(async () => {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL?.replace(/pgbouncer=true/, '')
    expect(connectionString).toBeDefined()
    
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
    await client.connect()
  })

  afterAll(async () => {
    if (client) await client.end()
  })

  it('should successfully query profiles table structure', async () => {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profiles'
    `)
    const columns = res.rows.map(r => r.column_name)
    expect(columns).toContain('id')
    expect(columns).toContain('full_name')
    expect(columns).toContain('promo_year')
    expect(columns).toContain('status')
    expect(columns).toContain('avatar_url')
  })

  it('should verify database performance indexes exist', async () => {
    const res = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'profiles'
    `)
    const indexes = res.rows.map(r => r.indexname)
    expect(indexes).toContain('idx_profiles_status')
    expect(indexes).toContain('idx_profiles_promo')
    expect(indexes).toContain('idx_profiles_full_name')
  })
})
