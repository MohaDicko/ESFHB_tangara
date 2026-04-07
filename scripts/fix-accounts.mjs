// Script de diagnostic et correction des comptes
// node scripts/fix-accounts.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qxcglthicdvmnqbjszca.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4Y2dsdGhpY2R2bW5xYmpzemNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTA3MTYsImV4cCI6MjA5MDYyNjcxNn0.pZSOR9woY8qxrG5hw20-uUl9AT5PeZHMOwG6FCYnH-U'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const TEST_ACCOUNTS = [
  { email: 'tangara.diplome@gmail.com', password: 'Test123456!' },
  { email: 'tangara.admin@gmail.com',   password: 'Test123456!' },
]

console.log('🔍 Diagnostic des comptes de test...\n')

for (const account of TEST_ACCOUNTS) {
  // Test login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  })

  if (error) {
    console.log(`❌ ${account.email} → ${error.message}`)
    
    // Try to re-create if doesn't exist
    if (error.message.includes('Invalid login') || error.message.includes('invalid credentials')) {
      console.log(`   ↳ Tentative de recréation...`)
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            full_name: account.email.includes('admin') ? 'Admin ESFHB' : 'Souleymane Tangara',
            promo_year: account.email.includes('admin') ? 2000 : 2020,
          }
        }
      })
      
      if (signupError) {
        console.log(`   ↳ ❌ Échec recréation: ${signupError.message}`)
      } else if (signupData.session) {
        console.log(`   ↳ ✅ Recréé et connecté ! ID: ${signupData.user.id}`)
        await supabase.auth.signOut()
      } else if (signupData.user) {
        console.log(`   ↳ ⚠️  Recréé mais email non confirmé (ID: ${signupData.user.id})`)
        console.log(`   ↳ Désactivez "Confirm email" dans Supabase Auth Settings !`)
      }
    }
  } else {
    console.log(`✅ ${account.email} → Connexion OK ! (ID: ${data.user.id})`)
    await supabase.auth.signOut()
  }
  
  await new Promise(r => setTimeout(r, 500))
}

console.log('\nTerminé.')
