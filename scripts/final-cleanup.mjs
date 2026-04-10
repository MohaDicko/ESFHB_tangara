import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function cleanup() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query("DELETE FROM auth.users WHERE email = 'robot.test@example.com'");
  console.log('✅ Nettoyage : Compte Robot supprimé.');
  await client.end();
}
cleanup();
