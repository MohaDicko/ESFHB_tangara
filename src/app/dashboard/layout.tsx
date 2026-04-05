import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const unstable_instant = false
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Zap,
  Menu
} from 'lucide-react'
import { logout } from '../auth/actions'
import SidebarNav from './SidebarNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-zinc-50 selection:bg-black selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-zinc-200">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
               <Zap size={20} fill="white" />
            </div>
            <div>
               <div className="font-black tracking-tighter text-base leading-none">ÉCOLE DE SANTÉ</div>
               <div className="text-[9px] font-black text-brand tracking-widest uppercase">F. Houphouët Boigny</div>
            </div>
          </Link>
        </div>

        <SidebarNav />

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
           <div className="flex items-center gap-2">
              <Zap size={20} className="text-black" />
              <span className="font-bold tracking-tighter">AlumniTracker</span>
           </div>
           <button className="p-2 text-zinc-500">
              <Menu size={24} />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
