// Script d'exécution de la migration SQL
// node scripts/run-migration.mjs

import { readFileSync } from 'fs'
import pg from 'pg'

const { Client } = pg

// URL directe (sans pgbouncer pour les DDL)
const connectionString = 'postgresql://postgres.qxcglthicdvmnqbjszca:zv%24%2BN%218_8%24GY-bZ@aws-0-eu-west-1.pooler.supabase.com:5432/postgres'

const client = new Client({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
})

console.log('🔌 Connexion à la base de données...')

try {
  await client.connect()
  console.log('✅ Connecté !\n')

  // Migration des colonnes manquantes
  const migrations = [
    {
      name: 'Colonne is_email_public',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_email_public BOOLEAN DEFAULT true`
    },
    {
      name: 'Colonne is_contact_public', 
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_contact_public BOOLEAN DEFAULT false`
    },
    {
      name: 'Colonne avatar_url',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT`
    },
    {
      name: 'Colonne status',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'En recherche'`
    },
    {
      name: 'Colonne bio',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT`
    },
    {
      name: 'Colonne phone',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT`
    },
    {
      name: 'Colonne city',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT`
    },
    {
      name: 'Colonne country',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Mali'`
    },
    {
      name: 'Colonne specialty',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty TEXT`
    },
    {
      name: 'Colonne updated_at',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    },
    {
      name: 'Mise à jour valeurs par défaut',
      sql: `UPDATE profiles SET 
        is_email_public = COALESCE(is_email_public, true),
        is_contact_public = COALESCE(is_contact_public, false),
        status = COALESCE(status, 'En recherche'),
        country = COALESCE(country, 'Mali')
      WHERE id IS NOT NULL`
    },
    {
      name: 'Trigger handle_new_user',
      sql: `CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, full_name, promo_year, email, is_email_public, is_contact_public)
          VALUES (
            new.id, 
            COALESCE(new.raw_user_meta_data->>'full_name', 'Nouvel alumnus'),
            COALESCE((new.raw_user_meta_data->>'promo_year')::integer, 2024),
            new.email,
            true,
            false
          )
          ON CONFLICT (id) DO NOTHING;
          
          INSERT INTO public.user_roles (user_id, role)
          VALUES (new.id, 'alumni')
          ON CONFLICT (user_id) DO NOTHING;
          
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER`
    },
    {
      name: 'Recréation trigger',
      sql: `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user()`
    },
    {
      name: 'Bucket avatars',
      sql: `INSERT INTO storage.buckets (id, name, public) 
        VALUES ('avatars', 'avatars', true)
        ON CONFLICT (id) DO UPDATE SET public = true`
    },
  ]

  for (const migration of migrations) {
    try {
      await client.query(migration.sql)
      console.log(`✅ ${migration.name}`)
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`⏭️  ${migration.name} (déjà existant)`)
      } else {
        console.log(`❌ ${migration.name}: ${err.message}`)
      }
    }
  }

  // Vérification finale
  console.log('\n📋 Colonnes de la table profiles :')
  const result = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    ORDER BY ordinal_position
  `)
  result.rows.forEach(r => console.log(`   - ${r.column_name} (${r.data_type})`))

} catch (err) {
  console.error('❌ Erreur de connexion:', err.message)
} finally {
  await client.end()
  console.log('\n✨ Migration terminée !')
}
