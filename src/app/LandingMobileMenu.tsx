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
        className="md:hidden p-4 text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all active:scale-95 flex items-center gap-2 border border-zinc-100"
        aria-label="Ouvrir le menu"
      >
        <div className="flex flex-col gap-1 w-6">
           <div className="h-0.5 w-full bg-zinc-950 rounded-full" />
           <div className="h-0.5 w-full bg-zinc-950 rounded-full" />
           <div className="h-0.5 w-full bg-zinc-500 rounded-full ml-auto w-4" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Menu</span>
      </button>

      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-md md:hidden transition-all duration-300 animate-in fade-in"
          onClick={closeMenu}
        />
      )}

      {/* Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden flex flex-col overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8 flex items-center justify-between border-b border-zinc-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
               <Zap size={22} fill="white" />
            </div>
            <div>
              <div className="font-display font-black tracking-tighter text-base leading-none">ESFHB</div>
              <div className="text-[10px] font-black text-indigo-600 tracking-widest uppercase mt-0.5">ALUMNI PRO</div>
            </div>
          </div>
          <button 
            onClick={closeMenu}
            className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-2xl transition-all"
            aria-label="Fermer le menu"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="flex-1 px-8 py-10 flex flex-col gap-8">
          <Link 
            href="#features" 
            onClick={closeMenu}
            className="text-3xl font-display font-black tracking-tight text-zinc-950 flex items-center justify-between group"
          >
            Fonctionnalités
            <ArrowRight size={20} className="text-zinc-300 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link 
            href="#stats" 
            onClick={closeMenu}
            className="text-3xl font-display font-black tracking-tight text-zinc-950 flex items-center justify-between group"
          >
            Statistiques
            <ArrowRight size={20} className="text-zinc-300 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link 
            href="#impact" 
            onClick={closeMenu}
            className="text-3xl font-display font-black tracking-tight text-zinc-950 flex items-center justify-between group"
          >
            Impact
            <ArrowRight size={20} className="text-zinc-300 group-hover:translate-x-1 transition-all" />
          </Link>
          
          <div className="h-px bg-zinc-100 my-4" />
          
          <Link 
            href="/login" 
            onClick={closeMenu}
            className="text-3xl font-display font-black tracking-tight text-indigo-600 flex items-center justify-between group"
          >
            Connexion
            <ArrowRight size={20} className="text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </nav>

        <div className="p-8 border-t border-zinc-50 bg-zinc-50/50 mt-auto space-y-4">
          <div className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase text-center mb-2">Pas encore de compte ?</div>
          <Link 
            href="/register" 
            onClick={closeMenu}
            className="w-full bg-zinc-950 text-white p-5 rounded-2xl text-center font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            Rejoindre le réseau
            <ArrowRight size={18} className="text-zinc-400" />
          </Link>
        </div>
      </div>
    </>
  )
}
