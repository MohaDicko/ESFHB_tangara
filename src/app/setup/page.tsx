import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * PAGE DE SETUP LOCAL — pour créer les comptes de test rapidement
 * Accessible uniquement sur http://localhost:3000/setup
 */
export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
            ⚙️ OUTIL DE CONFIGURATION
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Setup des Comptes de Test</h1>
          <p className="text-zinc-400 text-sm">Utilisez les formulaires ci-dessous pour créer vos comptes de démonstration.</p>
        </div>

        {/* Compte Utilisateur Standard */}
        <div className="bg-zinc-800/50 rounded-2xl p-6 mb-4 border border-zinc-700">
          <h2 className="text-white font-bold mb-1">🎓 Compte Diplômé Standard</h2>
          <p className="text-zinc-400 text-xs mb-4">Accès normal à l&apos;annuaire et au profil</p>
          <form action={async () => {
            'use server'
            const sb = await createClient()
            const { data, error } = await sb.auth.signUp({
              email: 'tangara.diplome@gmail.com',
              password: 'Test123456!',
              options: {
                data: { full_name: 'Souleymane Tangara', promo_year: 2020 }
              }
            })
            if (!error) redirect('/login')
          }}>
            <div className="space-y-1 mb-4 text-sm font-mono">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Email</span>
                <span>tangara.diplome@gmail.com</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Mot de passe</span>
                <span>Test123456!</span>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition-all">
              Créer le compte Diplômé →
            </button>
          </form>
        </div>

        {/* Compte Admin */}
        <div className="bg-zinc-800/50 rounded-2xl p-6 mb-6 border border-zinc-700">
          <h2 className="text-white font-bold mb-1">👑 Compte Administrateur</h2>
          <p className="text-zinc-400 text-xs mb-4">Accès complet + dashboard admin</p>
          <form action={async () => {
            'use server'
            const sb = await createClient()
            const { data, error } = await sb.auth.signUp({
              email: 'tangara.admin@gmail.com',
              password: 'Test123456!',
              options: {
                data: { full_name: 'Admin ESFHB', promo_year: 2000 }
              }
            })
            if (!error) redirect('/login')
          }}>
            <div className="space-y-1 mb-4 text-sm font-mono">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Email</span>
                <span>tangara.admin@gmail.com</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Mot de passe</span>
                <span>Test123456!</span>
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-sm transition-all">
              Créer le compte Admin →
            </button>
          </form>
        </div>

        {/* Instructions SQL */}
        <div className="bg-zinc-800/30 rounded-2xl p-5 border border-dashed border-zinc-700">
          <h3 className="text-white font-bold text-sm mb-3">📋 Après création — Activer le rôle Admin</h3>
          <p className="text-zinc-400 text-xs mb-3">Exécutez ce SQL dans Supabase :</p>
          <pre className="bg-zinc-950 rounded-xl p-4 text-xs text-green-400 overflow-x-auto">
{`INSERT INTO user_roles (id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'tangara.admin@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';`}
          </pre>
        </div>
      </div>
    </div>
  )
}
