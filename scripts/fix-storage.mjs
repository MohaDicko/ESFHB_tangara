// Script de diagnostic et fix du storage avatars
// node scripts/fix-storage.mjs

import pg from 'pg'
const { Client } = pg

const client = new Client({
  connectionString: 'postgresql://postgres.qxcglthicdvmnqbjszca:zv%24%2BN%218_8%24GY-bZ@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

await client.connect()
console.log('✅ Connecté\n')

// 1. Vérifier le bucket
const bucket = await client.query(`SELECT * FROM storage.buckets WHERE id = 'avatars'`)
console.log('📦 Bucket avatars:', bucket.rows.length > 0 ? '✅ Existe' : '❌ Manquant')

// 2. Lister les politiques existantes sur storage.objects
const policies = await client.query(`
  SELECT policyname, cmd, qual 
  FROM pg_policies 
  WHERE tablename = 'objects' AND schemaname = 'storage'
`)
console.log('\n📋 Politiques storage existantes:')
policies.rows.forEach(p => console.log(`   - ${p.policyname} (${p.cmd})`))

// 3. Supprimer toutes les politiques storage existantes
console.log('\n🗑️  Suppression des anciennes politiques...')
for (const p of policies.rows) {
  try {
    await client.query(`DROP POLICY IF EXISTS "${p.policyname}" ON storage.objects`)
    console.log(`   ✅ Supprimé: ${p.policyname}`)
  } catch (e) {
    console.log(`   ⚠️  ${p.policyname}: ${e.message}`)
  }
}

// 4. Créer/mettre à jour le bucket comme public
console.log('\n📦 Configuration du bucket avatars (public)...')
await client.query(`
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
  ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/gif','image/webp']
`)
console.log('   ✅ Bucket avatars configuré (public, 5MB max, images seulement)')

// 5. Créer des politiques très permissives pour le test
console.log('\n🔒 Création des nouvelles politiques storage...')

const newPolicies = [
  {
    name: 'allow_public_read_avatars',
    sql: `CREATE POLICY "allow_public_read_avatars" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars')`
  },
  {
    name: 'allow_auth_upload_avatars',
    sql: `CREATE POLICY "allow_auth_upload_avatars" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
      )`
  },
  {
    name: 'allow_auth_update_avatars',
    sql: `CREATE POLICY "allow_auth_update_avatars" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
      )`
  },
  {
    name: 'allow_auth_delete_avatars',
    sql: `CREATE POLICY "allow_auth_delete_avatars" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
      )`
  }
]

for (const p of newPolicies) {
  try {
    await client.query(p.sql)
    console.log(`   ✅ ${p.name}`)
  } catch (e) {
    console.log(`   ❌ ${p.name}: ${e.message}`)
  }
}

// 6. Vérification finale
const finalPolicies = await client.query(`
  SELECT policyname, cmd FROM pg_policies 
  WHERE tablename = 'objects' AND schemaname = 'storage'
`)
console.log('\n✅ Politiques finales:')
finalPolicies.rows.forEach(p => console.log(`   - ${p.policyname} (${p.cmd})`))

await client.end()
console.log('\n🎉 Storage configuré ! Les uploads devraient fonctionner maintenant.')
