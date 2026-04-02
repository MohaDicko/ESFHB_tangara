import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Key in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing connection to Supabase...')
  const { data, error } = await supabase.from('profiles').select('*').limit(1)

  if (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  } else {
    console.log('✅ Connection successful!')
    console.log('📊 Result (1st profile):', data)
  }
}

testConnection()
