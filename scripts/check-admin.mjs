import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`
    SELECT u.email, p.status, r.role 
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
    LEFT JOIN user_roles r ON u.id = r.user_id
    WHERE u.email = 'tangara.admin@gmail.com'
  `);
  console.log(res.rows);
  await client.end();
}
check();
