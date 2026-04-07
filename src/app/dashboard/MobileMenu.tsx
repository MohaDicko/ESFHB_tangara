'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, LayoutDashboard, UserCircle, Briefcase,
  Users, Settings, ShieldCheck, LogOut, Zap, ArrowRight
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
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-4 py-2 bg-white border border-zinc-200 rounded-full text-zinc-900 transition-all active:scale-95 hover:border-brand/30 shadow-sm"
        aria-label="Ouvrir le menu"
      >
        <div className="flex flex-col gap-1 w-4">
           <div className="h-0.5 w-full bg-brand rounded-full" />
           <div className="h-0.5 w-full bg-brand rounded-full opacity-60" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Menu</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-zinc-950/20 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer latéral */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[88%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* En-tête du drawer */}
        <div className="flex items-center justify-between px-8 py-8 border-b border-zinc-100/80 sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
                <Zap size={20} fill="white" />
             </div>
             <div>
               <div className="font-display font-black tracking-tighter text-base leading-none">ESPACE ALUMNI</div>
               <div className="text-[9px] font-black text-brand tracking-widest uppercase mt-0.5">Session Sécurisée</div>
             </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-2xl transition-all"
            aria-label="Fermer le menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-10 space-y-3 overflow-y-auto">
          {finalNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-6 py-5 text-base font-bold rounded-[22px] transition-all duration-300 group ${
                  isActive
                    ? 'bg-brand text-white shadow-xl shadow-brand/25'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={22} className={`${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-brand'} transition-colors`} />
                  {item.label}
                </div>
                <ArrowRight size={16} className={`${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'} transition-all`} />
              </Link>
            )
          })}
        </nav>

        {/* Pied du drawer */}
        <div className="p-8 bg-zinc-50/50 border-t border-zinc-100 rounded-t-[40px]">
          <div className="space-y-3 mb-8">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-zinc-500 hover:bg-white hover:text-zinc-900 rounded-2xl transition-all border border-transparent hover:border-zinc-100 group"
            >
              <Settings size={20} className="text-zinc-400 group-hover:text-brand transition-colors" />
              Configuration
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                Déconnexion
              </button>
            </form>
          </div>

          {/* Badge utilisateur Premium */}
          <div className="p-6 bg-white border border-zinc-200 rounded-[30px] shadow-sm">
            <div className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase mb-3 text-center">Utilisateur Actif</div>
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-xs font-black ring-4 ring-brand/5">
                  {userEmail?.substring(0, 2).toUpperCase()}
               </div>
               <div className="text-xs font-bold truncate flex-1 text-zinc-900">{userEmail}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
