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
        className="md:hidden flex items-center gap-3 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full text-zinc-900 transition-all active:scale-95 hover:bg-zinc-100 shadow-sm"
        aria-label="Ouvrir le menu"
      >
        <div className="flex flex-col gap-1.5 w-5">
           <div className={`h-0.5 w-full bg-brand rounded-full transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
           <div className={`h-0.5 w-3/4 bg-brand rounded-full ml-auto transition-all ${open ? 'opacity-0' : ''}`} />
           <div className={`h-0.5 w-full bg-brand rounded-full transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-900 pr-1">Navigation</span>
      </button>

      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-[60] bg-zinc-950/20 backdrop-blur-md md:hidden transition-all duration-300 animate-in fade-in"
          onClick={closeMenu}
        />
      )}

      {/* Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-[88%] max-w-sm bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) md:hidden flex flex-col overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
               <Zap size={22} fill="white" />
            </div>
            <div>
              <div className="font-display font-black tracking-tighter text-lg leading-none text-zinc-900">ESFHB</div>
              <div className="text-[10px] font-black text-brand tracking-widest uppercase mt-0.5 flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                 Alumni Médical
              </div>
            </div>
          </div>
          <button 
            onClick={closeMenu}
            className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-2xl transition-all"
            aria-label="Fermer le menu"
          >
            <X size={26} />
          </button>
        </div>

        <nav className="flex-1 px-8 py-12 flex flex-col gap-10">
          <Link 
            href="#features" 
            onClick={closeMenu}
            className="text-4xl font-display font-black tracking-tighter text-zinc-900 flex items-center justify-between group"
          >
            Savoir-faire
            <ArrowRight size={22} className="text-zinc-200 group-hover:translate-x-2 group-hover:text-brand transition-all" />
          </Link>
          <Link 
            href="#stats" 
            onClick={closeMenu}
            className="text-4xl font-display font-black tracking-tighter text-zinc-900 flex items-center justify-between group"
          >
            Chiffres clés
            <ArrowRight size={22} className="text-zinc-200 group-hover:translate-x-2 group-hover:text-brand transition-all" />
          </Link>
          <Link 
            href="#impact" 
            onClick={closeMenu}
            className="text-4xl font-display font-black tracking-tighter text-zinc-900 flex items-center justify-between group"
          >
            L&apos;impact
            <ArrowRight size={22} className="text-zinc-200 group-hover:translate-x-2 group-hover:text-brand transition-all" />
          </Link>
          
          <div className="h-px bg-zinc-100 my-2" />
          
          <Link 
            href="/login" 
            onClick={closeMenu}
            className="text-3xl font-display font-black tracking-tight text-brand flex items-center justify-between group py-2"
          >
            Connexion au portail
            <div className="w-10 h-10 bg-brand/5 rounded-full flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all">
               <ArrowRight size={20} />
            </div>
          </Link>
        </nav>

        <div className="p-8 border-t border-zinc-100 bg-zinc-50/50 mt-auto space-y-6">
          <div className="text-[11px] font-black text-zinc-400 tracking-[0.2em] uppercase text-center">PAS ENCORE DIPLÔMÉ ?</div>
          <Link 
            href="/register" 
            onClick={closeMenu}
            className="w-full bg-zinc-950 text-white p-5 rounded-2xl text-center font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            Rejoindre et S&apos;inscrire
            <ArrowRight size={18} className="text-emerald-400" />
          </Link>
        </div>
      </div>
    </>
  )
}
