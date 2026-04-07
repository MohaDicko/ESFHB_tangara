import { cache } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Settings, LogOut, ArrowRight, Zap } from 'lucide-react'
import { logout } from '../auth/actions'
import SidebarNav from './SidebarNav'
import MobileMenu from './MobileMenu'
import BottomNav from './BottomNav'

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
    <div className="flex h-screen h-[100dvh] bg-zinc-50 selection:bg-black selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-zinc-200">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3.5 group">
            <div className="h-11 w-11 bg-white rounded-2xl shadow-xl shadow-indigo-500/10 flex items-center justify-center border border-zinc-100 p-2">
               <img src="/logo.jpg" alt="ESFHB Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
               <div className="font-display font-black tracking-tighter text-base leading-none text-zinc-950">ÉCOLE DE SANTÉ</div>
               <div className="text-[10px] font-black text-brand tracking-widest uppercase mt-0.5">F. Houphouët Boigny</div>
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
          
          <Link 
            href="https://sahelmultiservice.com" 
            target="_blank" 
            className="mt-8 flex flex-col items-center gap-2 group relative py-4 px-2 rounded-[32px] hover:bg-zinc-50 transition-all duration-500"
          >
            <div className="text-[10px] font-black text-zinc-300 tracking-[0.2em] uppercase">Built with Excellence</div>
            <div className="flex items-center gap-2 text-[11px] font-black text-zinc-900 group-hover:text-indigo-600 transition-colors">
               <div className="w-5 h-5 bg-zinc-950 rounded-lg flex items-center justify-center text-[8px] text-white font-black group-hover:bg-indigo-600 transition-colors">SM</div>
               SAHEL MULTISERVICE
               <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white md:m-3 md:rounded-[48px] md:shadow-2xl md:shadow-zinc-200/50 border border-zinc-100">
        {/* Mobile Header - Native Style */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-zinc-100 h-16 flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
              <Zap size={18} fill="white" />
            </div>
            <div>
              <div className="font-display font-black tracking-tighter text-base leading-none text-zinc-950 uppercase">ESFHB</div>
              <div className="text-[8px] font-black text-brand tracking-[0.2em] uppercase mt-0.5">Alumni Med</div>
            </div>
          </div>
          <MobileMenu isAdmin={isAdmin} userEmail={user?.email} logoutAction={logout} />
        </div>

        <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pt-0 md:pb-0">
          {children}
        </div>

        {/* Mobile Tab Bar */}
        <BottomNav />
      </main>
    </div>
  )
}
