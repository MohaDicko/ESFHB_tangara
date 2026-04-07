import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function setAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    const query = `
      INSERT INTO public.user_roles (user_id, role)
      SELECT id, 'admin' FROM auth.users WHERE email = 'tangara.admin@gmail.com'
      ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    `;

    const result = await client.query(query);
    console.log(`Success: ${result.rowCount ?? 0} row(s) affected.`);
    console.log("Le compte tangara.admin@gmail.com est désormais Administrateur !");
  } catch (err) {
    console.error('Error executing query:', err.message);
  } finally {
    await client.end();
  }
}

setAdmin();
