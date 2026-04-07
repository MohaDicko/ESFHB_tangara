'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, LayoutDashboard, UserCircle, Briefcase,
  Users, Settings, ShieldCheck, LogOut
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/dashboard',             label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/dashboard/profile',     label: 'Mon Profil',     icon: UserCircle },
  { href: '/dashboard/experiences', label: 'Mes Expériences',icon: Briefcase },
  { href: '/dashboard/directory',   label: 'Annuaire',       icon: Users },
]

interface Props {
  isAdmin?: boolean
  userEmail?: string
  logoutAction: () => Promise<void>
}

export default function MobileMenu({ isAdmin, userEmail, logoutAction }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Fermer automatiquement quand on change de page
  useEffect(() => { setOpen(false) }, [pathname])

  // Bloquer le scroll du body quand le drawer est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const finalNavItems = isAdmin
    ? [...navItems, { href: '/dashboard/admin', label: 'Administration', icon: ShieldCheck }]
    : navItems

  return (
    <>
      {/* Bouton burger */}
      <button
        id="mobile-menu-toggle"
        onClick={() => setOpen(true)}
        className="p-2 text-zinc-600 hover:text-black transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay sombre */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer latéral */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* En-tête du drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="ESFHB Logo" className="h-9 w-auto object-contain" />
            <div>
              <div className="font-black tracking-tighter text-sm leading-none">ÉCOLE DE SANTÉ</div>
              <div className="text-[9px] font-black text-[#0056b3] tracking-widest uppercase">F. Houphouët Boigny</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {finalNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#0056b3] text-white shadow-lg shadow-[#0056b3]/25'
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

        {/* Pied du drawer */}
        <div className="p-4 border-t border-zinc-100 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-black rounded-2xl transition-all group"
          >
            <Settings size={20} className="text-zinc-400 group-hover:text-black transition-colors" />
            Paramètres
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Déconnexion
            </button>
          </form>

          {/* Badge utilisateur */}
          <div className="mt-4 px-4 py-4 bg-zinc-900 rounded-3xl text-white">
            <div className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mb-1">Connecté en tant que</div>
            <div className="text-sm font-bold truncate">{userEmail}</div>
          </div>
        </div>
      </div>
    </>
  )
}
