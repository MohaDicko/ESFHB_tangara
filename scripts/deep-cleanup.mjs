import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function deepCleanup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    // 1. Supprimer les profils orphelins (ceux qui n'ont pas de compte Auth associé)
    // Cela inclut les 210 profils du script "seed-alumni"
    const deleteOrphans = `
      DELETE FROM public.profiles 
      WHERE id NOT IN (SELECT id FROM auth.users);
    `;
    const resOrphans = await client.query(deleteOrphans);
    console.log(`🗑️ Profiles orphelins supprimés : ${resOrphans.rowCount}`);

    // 2. Rétablir la contrainte de clé étrangère (si elle a été supprimée par le script de seed)
    console.log('🔗 Rétablissement de la contrainte de clé étrangère...');
    try {
      await client.query(`
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
      `);
      console.log('✅ Contrainte de clé étrangère rétablie.');
    } catch (e) {
      console.log('ℹ️ La contrainte existe déjà ou n\'a pas pu être ajoutée : ', e.message);
    }

    // 3. Supprimer les vrais utilisateurs de test restants (ceux qui ne sont pas tangara ou souleymane)
    const deleteTestUsers = `
      DELETE FROM auth.users 
      WHERE email NOT LIKE 'tangara%' 
      AND email NOT LIKE 'souleymane%';
    `;
    const resUsers = await client.query(deleteTestUsers);
    console.log(`👤 Utilisateurs Auth de test supprimés : ${resUsers.rowCount}`);

    console.log("\n✨ Base de données totalement nettoyée et sécurisée !");
    
  } catch (err) {
    console.error('❌ Erreur lors du nettoyage profond :', err.message);
  } finally {
    await client.end();
  }
}

deepCleanup();
