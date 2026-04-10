import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function cleanupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    // Nettoyage : On supprime tous les utilisateurs qui ne sont pas des comptes officiels (tangara...)
    // Les contraintes ON DELETE CASCADE s'occupent des 'profiles' et 'experiences'
    const query = `
      DELETE FROM auth.users 
      WHERE email NOT LIKE 'tangara%' 
      AND email NOT LIKE 'souleymane%';
    `;

    const result = await client.query(query);
    console.log(`Nettoyage réussi : ${result.rowCount ?? 0} utilisateurs supprimés.`);
    console.log("La base de données est désormais prête pour la production.");
    
  } catch (err) {
    console.error('Erreur lors du nettoyage :', err.message);
  } finally {
    await client.end();
  }
}

cleanupDatabase();
