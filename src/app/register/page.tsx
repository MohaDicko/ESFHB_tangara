'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../auth/actions'
import { ArrowRight, Zap, Loader2, GraduationCap, User, Mail, Lock, Stethoscope } from 'lucide-react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 selection:bg-black selection:text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-3 justify-center mb-10 group text-center">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand/20 group-hover:scale-110 transition-transform">
             <Zap size={24} fill="white" />
          </div>
          <div className="text-left">
             <div className="font-black text-xl tracking-tighter leading-none">ÉCOLE DE SANTÉ</div>
             <div className="text-[9px] font-black text-brand tracking-widest uppercase">Félix Houphouët Boigny</div>
          </div>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-black/5 border border-zinc-100">
           <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Créer un compte</h1>
              <p className="text-zinc-500 font-medium">Rejoignez le réseau des anciens dès aujourd'hui.</p>
           </div>

           {error && (
             <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold mb-6 animate-shake">
                {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                 <label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Nom Complet</label>
                 <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      id="fullName"
                      name="fullName"
                      type="text" 
                      placeholder="Jean Dupont"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label htmlFor="promoYear" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Année de Promotion</label>
                 <div className="relative">
                    <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      id="promoYear"
                      name="promoYear"
                      type="number" 
                      min="1950"
                      max={2030}
                      placeholder="2024"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label htmlFor="specialty" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Spécialité</label>
                 <div className="relative">
                    <Stethoscope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <select
                      id="specialty"
                      name="specialty"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium appearance-none"
                    >
                      <option value="" disabled selected>Sélectionner une spécialité</option>
                      <option value="SMI">SMI — Santé Maternelle et Infantile</option>
                      <option value="SP">SP — Santé Publique</option>
                      <option value="TLP">TLP — Technicien de Labo. Pharmaceutique</option>
                      <option value="BM">BM — Biologie Médicale</option>
                      <option value="SF">SF — Sage-Femme</option>
                      <option value="IDE">IDE — Infirmier Diplômé d'État</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">E-mail institutionnel</label>
                 <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="jean.dupont@ecole.com"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Mot de passe</label>
                 <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      id="password"
                      name="password"
                      type="password" 
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand/10 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>S'inscrire <ArrowRight size={20} /></>}
              </button>
           </form>

           <div className="mt-8 text-center text-sm font-medium text-zinc-500">
              Déjà inscrit ? <Link href="/login" className="text-black font-bold hover:underline">Se connecter</Link>
           </div>
        </div>
        
        {/* Footer info */}
        <p className="mt-10 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
           Sécurisé par Supabase Auth
        </p>
      </div>
    </div>
  )
}
