'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, UserCircle } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { icon: LayoutDashboard, label: 'Accueil', href: '/dashboard' },
    { icon: Users, label: 'Annuaire', href: '/dashboard/directory' },
    { icon: Briefcase, label: 'Expériences', href: '/dashboard/experiences' },
    { icon: UserCircle, label: 'Profil', href: '/dashboard/profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-zinc-100 flex items-center justify-around px-2 py-3 pb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href))
        
        return (
          <Link 
            key={tab.href} 
            href={tab.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 relative ${
              isActive ? 'text-brand' : 'text-zinc-400'
            }`}
          >
            {isActive && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand animate-in fade-in zoom-in" />
            )}
            <Icon size={24} className={isActive ? 'scale-110' : ''} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
