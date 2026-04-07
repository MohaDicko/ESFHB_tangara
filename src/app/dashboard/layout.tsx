import { cache } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Settings, LogOut } from 'lucide-react'
import { logout } from '../auth/actions'
import SidebarNav from './SidebarNav'
import MobileMenu from './MobileMenu'

// Cache les requêtes Supabase pour toute la durée d'un rendu
const getSessionData = cache(async () => {
  const supabase = await createClient()
  const [{ data: { user } }, { data: roleData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('user_roles').select('role').single()
  ])
  return { user, isAdmin: roleData?.role === 'admin' }
})

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAdmin } = await getSessionData()

  if (!user) redirect('/login')

  return (
    <div className="flex h-screen bg-zinc-50 selection:bg-black selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-zinc-200">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10">
               <img src="/logo.jpg" alt="ESFHB Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
               <div className="font-black tracking-tighter text-base leading-none">ÉCOLE DE SANTÉ</div>
               <div className="text-[9px] font-black text-brand tracking-widest uppercase">F. Houphouët Boigny</div>
            </div>
          </Link>
        </div>

        <SidebarNav isAdmin={isAdmin} />

        <div className="p-4 border-t border-zinc-100">
          <nav className="space-y-1">
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-black rounded-2xl transition-all group"
            >
              <Settings size={20} className="text-zinc-400 group-hover:text-black transition-colors" />
              Paramètres
            </Link>
            <form action={logout}>
              <button 
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                Déconnexion
              </button>
            </form>
          </nav>
          
          <div className="mt-6 px-4 py-4 bg-zinc-900 rounded-3xl text-white">
             <div className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mb-2">Connecté en tant que</div>
             <div className="text-sm font-bold truncate">{user.email}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
           <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="ESFHB Logo" className="h-8 w-auto" />
              <span className="font-extrabold tracking-tighter">Annuaire ESFHB</span>
           </div>
           <MobileMenu isAdmin={isAdmin} userEmail={user.email} logoutAction={logout} />
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
