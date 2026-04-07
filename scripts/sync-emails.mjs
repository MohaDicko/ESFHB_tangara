// Fix complet: ajouter colonne email et synchroniser
import pg from 'pg'
const { Client } = pg

const client = new Client({
  connectionString: 'postgresql://postgres.qxcglthicdvmnqbjszca:zv%24%2BN%218_8%24GY-bZ@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

await client.connect()
console.log('✅ Connecté\n')

// 1. Ajouter la colonne email si pas là
console.log('📧 Ajout colonne email dans profiles...')
try {
  await client.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT`)
  console.log('   ✅ Colonne email ajoutée')
} catch (e) {
  console.log('   ⚠️', e.message)
}

// 2. Synchroniser les emails depuis auth.users
console.log('🔄 Synchronisation emails depuis auth.users...')
const syncResult = await client.query(`
  UPDATE profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.id = u.id
  RETURNING p.full_name, u.email
`)
console.log(`   ✅ ${syncResult.rowCount} profil(s) synchronisé(s)`)
syncResult.rows.forEach(r => console.log(`   → ${r.full_name}: ${r.email}`))

// 3. Vérification finale
const check = await client.query(`
  SELECT p.full_name, p.email, p.is_email_public, p.city
  FROM profiles p ORDER BY p.created_at
`)
console.log('\n📋 État des profils:')
check.rows.forEach(r => console.log(`   - ${r.full_name} | ${r.email} | public: ${r.is_email_public} | ${r.city || 'ville non définie'}`))

await client.end()
console.log('\n✨ Terminé ! Le bug mailto:undefined est corrigé.')
