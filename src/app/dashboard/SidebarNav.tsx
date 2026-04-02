'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  Users, 
  Settings,
  LucideIcon
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Mon Profil', icon: UserCircle },
  { href: '/dashboard/experiences', label: 'Mes Expériences', icon: Briefcase },
  { href: '/dashboard/directory', label: 'Annuaire', icon: Users },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-4 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link 
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all group ${
              isActive 
                ? 'bg-brand text-white shadow-xl shadow-brand/10' 
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <span className={`${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-black'} transition-colors`}>
              <Icon size={20} />
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
