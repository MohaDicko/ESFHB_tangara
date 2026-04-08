'use client'

import { 
  Users, 
  LayoutDashboard, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Zap,
  Briefcase,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { href: '/dashboard/experiences', label: 'Mes Expériences', icon: Star },
  { href: '/dashboard/directory', label: 'Annuaire', icon: Users },
  { href: '/dashboard/jobs', label: 'Opportunités', icon: Briefcase },
]

export default function SidebarNav({ isAdmin, logout }: { isAdmin?: boolean, logout?: any }) {
  const pathname = usePathname()
  
  return (
    <aside className="hidden md:flex w-80 flex-col bg-zinc-950 text-white relative overflow-hidden h-full">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      {/* Logo Section */}
      <div className="p-10 relative z-10">
        <div className="flex items-center gap-4 mb-2">
           <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20 p-2">
              <Zap size={24} className="text-blue-600" fill="currentColor" />
           </div>
           <div>
             <div className="font-display font-black tracking-tighter text-2xl leading-none uppercase">ESFHB</div>
             <div className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase mt-1">Alumni Network</div>
           </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-6 space-y-2 relative z-10">
        <div className="text-[11px] font-black text-zinc-400 tracking-[0.2em] uppercase mb-6 pl-4">Menu Principal</div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4.5 rounded-[22px] text-sm font-black transition-all duration-300 group ${
                isActive
                  ? 'bg-brand text-white shadow-2xl shadow-brand/40'
                  : 'text-zinc-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-brand'} transition-colors`} />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
            </Link>
          )
        })}

        {isAdmin && (
          <div className="pt-10 space-y-2">
            <div className="text-[11px] font-black text-zinc-400 tracking-[0.2em] uppercase mb-6 pl-4">Administration</div>
            <Link
              href="/dashboard/admin"
              className={`flex items-center gap-4 px-6 py-4.5 rounded-[22px] text-sm font-black transition-all duration-300 group ${
                pathname === '/dashboard/admin'
                  ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30'
                  : 'text-zinc-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck size={22} className={pathname === '/dashboard/admin' ? 'text-white' : 'text-zinc-500 group-hover:text-emerald-400'} />
              Gestion Membres
            </Link>
            <Link
              href="/dashboard/admin/jobs"
              className={`flex items-center gap-4 px-6 py-4.5 rounded-[22px] text-sm font-black transition-all duration-300 group ${
                pathname === '/dashboard/admin/jobs'
                  ? 'bg-brand text-white shadow-2xl shadow-brand/30'
                  : 'text-zinc-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase size={22} className={pathname === '/dashboard/admin/jobs' ? 'text-white' : 'text-zinc-500 group-hover:text-brand'} />
              Offres d'Emploi
            </Link>
          </div>
        )}
      </nav>

      {/* Footer Nav */}
      <div className="p-8 border-t border-white/5 relative z-10">
        <div className="space-y-1">
           <Link
             href="/dashboard/settings"
             className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all group"
           >
             <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
             Paramètres
           </Link>
           <form action={logout}>
             <button
               type="submit"
               className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all group"
             >
               <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
               Déconnexion
             </button>
           </form>
        </div>
      </div>
    </aside>
  )
}
