'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Zap } from 'lucide-react'

export default function LandingMobileMenu() {
  const [open, setOpen] = useState(false)

  // Fermer le menu lors d'un clic sur un lien
  const closeMenu = () => setOpen(false)

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-[60] bg-zinc-950/20 backdrop-blur-md md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-in-out md:hidden flex flex-col overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-indigo-600" />
            <div>
              <div className="font-black tracking-tighter text-sm leading-none">ESFHB</div>
              <div className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">ALUMNI</div>
            </div>
          </div>
          <button 
            onClick={closeMenu}
            className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 py-8 flex flex-col gap-6">
          <Link 
            href="#features" 
            onClick={closeMenu}
            className="text-2xl font-display font-black tracking-tight text-zinc-900 flex items-center justify-between group"
          >
            Fonctionnalités
            <ArrowRight size={20} className="text-zinc-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
          </Link>
          <Link 
            href="#stats" 
            onClick={closeMenu}
            className="text-2xl font-display font-black tracking-tight text-zinc-900 flex items-center justify-between group"
          >
            Statistiques
            <ArrowRight size={20} className="text-zinc-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
          </Link>
          <Link 
            href="#impact" 
            onClick={closeMenu}
            className="text-2xl font-display font-black tracking-tight text-zinc-900 flex items-center justify-between group"
          >
            Impact
            <ArrowRight size={20} className="text-zinc-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
          </Link>
          
          <div className="h-px bg-zinc-100 my-4" />
          
          <Link 
            href="/login" 
            onClick={closeMenu}
            className="text-2xl font-display font-black tracking-tight text-zinc-900 flex items-center justify-between group"
          >
            Se Connecter
            <ArrowRight size={20} className="text-zinc-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
          </Link>
        </nav>

        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 mt-auto">
          <Link 
            href="/register" 
            onClick={closeMenu}
            className="w-full bg-indigo-600 text-white p-5 rounded-2xl text-center font-bold shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            Rejoindre la plateforme
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </>
  )
}
