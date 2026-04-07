import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function cleanupDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database for cleanup.');

    // We keep the tangara admin account (and any others starting with tangara)
    const query = `
      DELETE FROM auth.users WHERE email NOT LIKE 'tangara%';
    `;

    const result = await client.query(query);
    console.log(`Success: ${result.rowCount ?? 0} fake profile(s) deleted.`);
    console.log("Base de données nettoyée et prête pour la production !");
  } catch (err) {
    console.error('Error executing query:', err.message);
  } finally {
    await client.end();
  }
}

cleanupDb();
