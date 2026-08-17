'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../auth/actions'
import { ArrowRight, Loader2, Mail, Lock, ShieldCheck, Sparkles, Activity } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col lg:flex-row selection:bg-emerald-500 selection:text-white">
      
      {/* Left Artwork Banner (Visible on Tablet & Desktop) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#0b0f17] via-[#0f172a] to-[#061e1b] p-12 flex-col justify-between overflow-hidden border-r border-white/10">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="h-full w-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
              <img src="/logo.jpg" alt="ESFHB Logo" className="h-6 w-auto object-contain rounded-md" />
            </div>
          </div>
          <div>
            <div className="font-display font-black tracking-tighter text-lg text-white uppercase leading-none">ESFHB</div>
            <div className="text-[9px] font-bold text-emerald-400 tracking-[0.2em] uppercase mt-0.5">Alumni Tracker</div>
          </div>
        </Link>

        {/* Testimonial / Showcase Card */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase border border-emerald-500/20">
            <Activity size={14} className="animate-pulse" />
            Portail Officiel Sécurisé
          </div>
          <h2 className="text-4xl font-display font-black text-white leading-tight">
            Restez connecté à l'institution de santé de référence.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Consultez votre profil diplômé, mettez à jour votre parcours professionnel et accédez aux opportunités exclusives du réseau.
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">Chiffrement & RLS Structuré</div>
              <div className="text-slate-400">Vos données personnelles sont confidentielles et sécurisées.</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} École de Santé Félix Houphouët-Boigny (ESFHB).
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 p-0.5">
              <div className="h-full w-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                <img src="/logo.jpg" alt="ESFHB Logo" className="h-6 w-auto object-contain rounded-md" />
              </div>
            </div>
            <div className="text-left">
              <div className="font-display font-black text-lg tracking-tight text-white uppercase leading-none">ESFHB</div>
              <div className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">Alumni Tracker</div>
            </div>
          </Link>

          {/* Form Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">Espace Membre</h1>
            <p className="text-slate-400 text-sm">Entrez vos identifiants pour vous connecter au réseau.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Adresse E-mail</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="nom@exemple.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-400">Mot de passe</label>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Connexion <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="text-center text-xs font-medium text-slate-400">
            Pas encore de compte ? <Link href="/register" className="text-emerald-400 font-bold hover:underline ml-1">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
