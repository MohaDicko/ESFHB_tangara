// Script de création des comptes de test
// Lancer avec: node scripts/create-test-accounts.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qxcglthicdvmnqbjszca.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4Y2dsdGhpY2R2bW5xYmpzemNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTA3MTYsImV4cCI6MjA5MDYyNjcxNn0.pZSOR9woY8qxrG5hw20-uUl9AT5PeZHMOwG6FCYnH-U'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const accounts = [
  {
    email: 'tangara.diplome@gmail.com',
    password: 'Test123456!',
    fullName: 'Souleymane Tangara',
    promoYear: 2020,
    role: 'diplômé'
  },
  {
    email: 'tangara.admin@gmail.com',
    password: 'Test123456!',
    fullName: 'Admin ESFHB',
    promoYear: 2000,
    role: 'admin'
  }
]

console.log('🚀 Création des comptes de test ESFHB...\n')

for (const account of accounts) {
  const { data, error } = await supabase.auth.signUp({
    email: account.email,
    password: account.password,
    options: {
      data: {
        full_name: account.fullName,
        promo_year: account.promoYear
      }
    }
  })

  if (error) {
    console.log(`❌ [${account.role}] ${account.email} → Erreur: ${error.message}`)
  } else if (data.user) {
    console.log(`✅ [${account.role}] ${account.email} → Créé (ID: ${data.user.id})`)
    
    if (account.role === 'admin') {
      console.log(`\n📋 SQL pour activer le rôle admin:\n`)
      console.log(`INSERT INTO user_roles (id, role)`)
      console.log(`VALUES ('${data.user.id}', 'admin')`)
      console.log(`ON CONFLICT (id) DO UPDATE SET role = 'admin';\n`)
    }
  }
  
  // Petite pause entre les créations
  await new Promise(r => setTimeout(r, 1000))
}

console.log('\n✨ Terminé ! Vos identifiants:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('👑 ADMIN')
console.log('   Email   : tangara.admin@gmail.com')
console.log('   Password: Test123456!')
console.log('')
console.log('🎓 DIPLÔMÉ')
console.log('   Email   : tangara.diplome@gmail.com')
console.log('   Password: Test123456!')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
