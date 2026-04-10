import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fixRLS() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  // 1. Ajouter la politique pour permettre aux utilisateurs de voir leur rôle
  try {
    await client.query(`
      CREATE POLICY "Les utilisateurs peuvent voir leur propre role" 
      ON user_roles FOR SELECT USING (auth.uid() = user_id);
    `);
    console.log('✅ Politique SELECT ajoutée sur user_roles');
  } catch (e) {
    console.log('⚠️ Politique déjà existante ou erreur:', e.message);
  }

  // 2. S'assurer que RLS est actif
  await client.query("ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;");
  
  await client.end();
}
fixRLS();
