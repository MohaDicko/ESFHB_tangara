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
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
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
        className="p-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-zinc-50 rounded-2xl transition-all active:scale-90"
        aria-label="Ouvrir le menu"
      >
        <Menu size={26} />
      </button>

      {/* Overlay sombre */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer latéral */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* En-tête du drawer */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-100/80">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 p-2">
                <img src="/logo.jpg" alt="ESFHB Logo" className="h-full w-auto object-contain" />
             </div>
             <div>
               <div className="font-display font-black tracking-tighter text-sm leading-none text-zinc-950">ESFHB ALUMNI</div>
               <div className="text-[9px] font-black text-indigo-600 tracking-widest uppercase mt-0.5">PLATFORME OFFICIELLE</div>
             </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-2xl transition-all active:scale-90"
            aria-label="Fermer le menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {finalNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 text-sm font-bold rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-500/5'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600'
                }`}
              >
                <Icon size={22} className={`${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-indigo-600'} transition-colors`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Pied du drawer */}
        <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 rounded-t-[32px]">
          <div className="space-y-2 mb-6">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-4 px-5 py-3.5 text-sm font-bold text-zinc-500 hover:bg-white hover:text-black rounded-2xl transition-all border border-transparent hover:border-zinc-100 group"
            >
              <Settings size={20} className="text-zinc-400 group-hover:text-indigo-600 transition-colors" />
              Paramètres
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-4 px-5 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                Déconnexion
              </button>
            </form>
          </div>

          {/* Badge utilisateur Premium */}
          <div className="p-5 bg-zinc-950 rounded-[24px] text-white shadow-xl shadow-zinc-200">
            <div className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase mb-2">SESSION ACTUELLE</div>
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-[10px] font-black">
                  {userEmail?.substring(0, 2).toUpperCase()}
               </div>
               <div className="text-sm font-bold truncate flex-1">{userEmail}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
