'use client'

import { 
  Users, 
  LayoutDashboard, 
  ShieldCheck, 
  Briefcase, 
  Star,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/dashboard/experiences', label: 'Parcours Pro', icon: Star },
  { href: '/dashboard/directory', label: 'Annuaire Diplômés', icon: Users },
  { href: '/dashboard/jobs', label: 'Opportunités', icon: Briefcase },
  { href: '/dashboard/profile', label: 'Mon Profil', icon: UserCheck },
]

export default function SidebarNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  
  return (
    <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
      <div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-3">
          Navigation Principale
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} transition-colors`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {isAdmin && (
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-3">
            Console Administrateur
          </div>
          <nav className="space-y-1">
            <Link
              href="/dashboard/admin"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                pathname === '/dashboard/admin'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={18} className={pathname === '/dashboard/admin' ? 'text-white' : 'text-slate-500 group-hover:text-sky-400'} />
              Gestion des Membres
            </Link>
            <Link
              href="/dashboard/admin/jobs"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                pathname === '/dashboard/admin/jobs'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase size={18} className={pathname === '/dashboard/admin/jobs' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} />
              Publier une Offre
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
