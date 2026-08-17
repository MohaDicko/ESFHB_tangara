import { cache } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Settings, LogOut, ArrowRight } from 'lucide-react'
import { logout } from '../auth/actions'
import SidebarNav from './SidebarNav'
import MobileMenu from './MobileMenu'
import BottomNav from './BottomNav'

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
    <div className="flex h-screen h-[100dvh] bg-[#080c14] text-slate-100 selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-[#0b0f17] border-r border-white/10 shrink-0">
        
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                <img src="/logo.jpg" alt="ESFHB Logo" className="h-6 w-auto object-contain rounded-md" />
              </div>
            </div>
            <div>
              <div className="font-display font-black tracking-tight text-base leading-none text-white uppercase">ESFHB</div>
              <div className="text-[9px] font-bold text-emerald-400 tracking-[0.2em] uppercase mt-1">Alumni Tracker</div>
            </div>
          </Link>
        </div>

        {/* Primary Nav Links */}
        <SidebarNav isAdmin={isAdmin} />

        {/* Footer Nav Controls */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <nav className="space-y-1">
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
            >
              <Settings size={18} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              Paramètres
            </Link>
            <form action={logout}>
              <button 
                type="submit"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                Déconnexion
              </button>
            </form>
          </nav>
          
          <div className="pt-2 text-center text-[10px] font-bold text-slate-500">
            ESFHB Mali © {new Date().getFullYear()}
          </div>
        </div>
      </aside>

      {/* Main Content Window */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#080c14] relative">
        
        {/* Mobile Header Navigation */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0b0f17]/90 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-4 justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 p-0.5">
              <div className="h-full w-full bg-[#0b0f17] rounded-[9px] flex items-center justify-center">
                <img src="/logo.jpg" alt="ESFHB Logo" className="h-5 w-auto object-contain rounded" />
              </div>
            </div>
            <div>
              <div className="font-display font-black text-sm text-white uppercase leading-none">ESFHB</div>
              <div className="text-[8px] font-bold text-emerald-400 tracking-wider uppercase mt-0.5">Alumni Tracker</div>
            </div>
          </div>
          <MobileMenu isAdmin={isAdmin} userEmail={user?.email} logoutAction={logout} />
        </div>

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pt-0 md:pb-0">
          {children}
        </div>

        {/* Mobile Navigation Bar */}
        <BottomNav />
      </main>
    </div>
  )
}
