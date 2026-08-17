import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Import functions to test
import { profileSchema, experienceSchema } from '../src/lib/validation.ts'
import { formatAlumniCsv } from '../src/lib/csv-exporter.ts'

const { Client } = pg

describe('🧪 SUITE DE TESTS UNITAIRES', () => {
  test('1. Validation Profil Alumnus (Zod)', () => {
    const validProfile = {
      full_name: 'Souleymane Tangara',
      status: 'Privé',
      city: 'Bamako',
      country: 'Mali',
      is_email_public: true,
      is_contact_public: false
    }
    const res = profileSchema.safeParse(validProfile)
    assert.equal(res.success, true, 'Le profil valide devrait passer')
  })

  test('2. Rejet de nom trop court ou statut invalide', () => {
    const invalidProfile = { full_name: 'A', status: 'Inconnu' }
    const res = profileSchema.safeParse(invalidProfile)
    assert.equal(res.success, false, 'Le profil invalide doit être rejeté')
  })

  test('3. Validation Expérience Professionnelle (Zod)', () => {
    const validExp = {
      company_name: 'Hôpital Gabriel Touré',
      job_title: 'Médecin Généraliste',
      start_date: '2022-01-15',
      is_current: true,
      sector: 'Santé'
    }
    const res = experienceSchema.safeParse(validExp)
    assert.equal(res.success, true, 'L\'expérience valide doit passer')
  })

  test('4. Rejet de date de fin antérieure à la date de début', () => {
    const invalidExp = {
      company_name: 'Clinique Pasteur',
      job_title: 'Infirmier',
      start_date: '2023-05-01',
      end_date: '2022-01-01',
      is_current: false
    }
    const res = experienceSchema.safeParse(invalidExp)
    assert.equal(res.success, false, 'Doit rejeter une date de fin antérieure')
  })

  test('5. Exportation CSV (Formatage & UTF-8 BOM)', () => {
    const mockData = [{
      full_name: 'Dr. Tangara "Senior"',
      email: 'tangara@example.com',
      promo_year: 2023,
      specialty: 'Infirmier d\'État',
      city: 'Bamako',
      country: 'Mali',
      phone: '+223 70000000',
      status: 'Public'
    }]
    const csv = formatAlumniCsv(mockData)
    assert.ok(csv.startsWith('\uFEFF'), 'Le CSV doit contenir l\'en-tête UTF-8 BOM pour Excel')
    assert.ok(csv.includes('"Dr. Tangara ""Senior"""'), 'Les guillemets doivent être échappés')
    assert.ok(csv.includes('"Public"'), 'Le statut doit figurer dans le CSV')
  })
})

describe('🔄 SUITE DE TESTS D\'INTÉGRATION', () => {
  test('6. Connexion Base de Données PostgreSQL', async () => {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL?.replace(/pgbouncer=true/, '')
    assert.ok(connectionString, 'DATABASE_URL doit être définie dans .env.local')
    
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })

    await client.connect()
    const res = await client.query('SELECT current_database(), version()')
    assert.ok(res.rows.length > 0, 'La requête version doit retourner un résultat')
    await client.end()
  })

  test('7. Vérification des Colonnes de la table profiles', async () => {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL?.replace(/pgbouncer=true/, '')
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
    await client.connect()

    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profiles'
    `)
    const columns = res.rows.map(r => r.column_name)
    assert.ok(columns.includes('full_name'), 'La table profiles doit contenir full_name')
    assert.ok(columns.includes('promo_year'), 'La table profiles doit contenir promo_year')
    assert.ok(columns.includes('status'), 'La table profiles doit contenir status')

    await client.end()
  })

  test('8. Vérification des Index de Performance', async () => {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL?.replace(/pgbouncer=true/, '')
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
    await client.connect()

    const res = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'profiles'
    `)
    const indexes = res.rows.map(r => r.indexname)
    assert.ok(indexes.includes('idx_profiles_status'), 'Index idx_profiles_status doit exister')
    assert.ok(indexes.includes('idx_profiles_promo'), 'Index idx_profiles_promo doit exister')
    assert.ok(indexes.includes('idx_profiles_full_name'), 'Index idx_profiles_full_name doit exister')

    await client.end()
  })

  test('9. Vérification des Droits Administrateur', async () => {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL?.replace(/pgbouncer=true/, '')
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
    await client.connect()

    const res = await client.query(`
      SELECT u.email, r.role 
      FROM auth.users u
      JOIN user_roles r ON u.id = r.user_id
      WHERE u.email = 'tangara.admin@gmail.com'
    `)
    assert.ok(res.rows.length > 0, 'L\'utilisateur tangara.admin@gmail.com doit exister')
    assert.equal(res.rows[0].role, 'admin', 'Le rôle doit être admin')

    await client.end()
  })
})
