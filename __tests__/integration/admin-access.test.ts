import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { Client } = pg

describe('Integration Tests - Admin Role & Permissions', () => {
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

  it('should verify admin role assignment for tangara.admin@gmail.com', async () => {
    const res = await client.query(`
      SELECT u.email, r.role 
      FROM auth.users u
      JOIN user_roles r ON u.id = r.user_id
      WHERE u.email = 'tangara.admin@gmail.com'
    `)
    expect(res.rows.length).toBeGreaterThan(0)
    expect(res.rows[0].email).toBe('tangara.admin@gmail.com')
    expect(res.rows[0].role).toBe('admin')
  })
})
