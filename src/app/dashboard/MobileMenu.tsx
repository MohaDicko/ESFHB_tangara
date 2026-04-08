'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, LayoutDashboard, UserCircle, Briefcase, Star,
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
  { href: '/dashboard/experiences', label: 'Mes Expériences',icon: Star },
  { href: '/dashboard/directory',   label: 'Annuaire',       icon: Users },
  { href: '/dashboard/jobs',        label: 'Opportunités',   icon: Briefcase },
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
      {/* Bouton profil compact */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 p-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-900 transition-all active:scale-95 hover:bg-zinc-100"
        aria-label="Profil et réglages"
      >
        <div className="h-8 w-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-xs font-black ring-2 ring-brand/5">
           {userEmail?.substring(0, 2).toUpperCase()}
        </div>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-zinc-950/20 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Settings Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
           <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Mon Compte</span>
           <button onClick={() => setOpen(false)} className="p-2 text-zinc-400 hover:text-black">
              <X size={20} />
           </button>
        </div>

        <div className="flex-1 p-8 space-y-12 overflow-y-auto">
           {/* Profile Card */}
           <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-[32px] bg-brand/5 text-brand flex items-center justify-center text-3xl font-black border-4 border-white shadow-2xl shadow-brand/10">
                 {userEmail?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                 <div className="font-display font-black text-xl text-zinc-900">{userEmail?.split('@')[0]}</div>
                 <div className="text-sm font-medium text-zinc-400">{userEmail}</div>
              </div>
              {isAdmin && (
                <div className="px-3 py-1 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-full leading-none">Administrateur</div>
              )}
           </div>

           {/* Actions */}
           <div className="space-y-4">
              {isAdmin && (
                <>
                  <Link 
                    href="/dashboard/admin" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 p-5 bg-zinc-50 rounded-2xl text-zinc-900 font-bold hover:bg-emerald-600 hover:text-white transition-all group"
                  >
                     <ShieldCheck size={20} className="text-emerald-600 group-hover:text-white" />
                     Espace Admin
                     <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link 
                    href="/dashboard/admin/jobs" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 p-5 bg-brand/5 border border-brand/10 rounded-2xl text-zinc-900 font-bold hover:bg-brand hover:text-white transition-all group"
                  >
                     <Briefcase size={20} className="text-brand group-hover:text-white" />
                     Gérer les offres
                     <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </>
              )}
              <Link 
                href="/dashboard/settings" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-5 border border-zinc-100 rounded-2xl text-zinc-900 font-bold hover:bg-zinc-50 transition-all group"
              >
                 <Settings size={20} className="text-zinc-400 group-hover:text-brand" />
                 Configuration
              </Link>
           </div>
        </div>

        <div className="p-8 border-t border-zinc-100">
           <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                <LogOut size={20} />
                Déconnexion sécurisée
              </button>
           </form>
           <div className="mt-6 text-center text-[10px] font-black text-zinc-300 uppercase tracking-widest">
              Version 2.1.0 • ESFHB-ALUMNI
           </div>
        </div>
      </div>
    </>
  )
}
