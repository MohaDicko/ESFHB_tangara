'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, UserCircle, Star } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { icon: LayoutDashboard, label: 'Accueil', href: '/dashboard' },
    { icon: Users, label: 'Annuaire', href: '/dashboard/directory' },
    { icon: Star, label: 'Parcours', href: '/dashboard/experiences' },
    { icon: Briefcase, label: 'Emplois', href: '/dashboard/jobs' },
    { icon: UserCircle, label: 'Profil', href: '/dashboard/profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0f17]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 py-2 pb-5 shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href))
        
        return (
          <Link 
            key={tab.href} 
            href={tab.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 relative ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
            <Icon size={20} className={isActive ? 'scale-110 text-emerald-400' : 'opacity-70'} />
            <span className="text-[9px] uppercase tracking-wider">
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
