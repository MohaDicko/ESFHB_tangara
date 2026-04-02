'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../auth/actions'
import { ArrowRight, Zap, Loader2, Mail, Lock } from 'lucide-react'

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
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 selection:bg-black selection:text-white">
      <div className="w-full max-w-md">
        {/* Logo */}
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
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Bon retour</h1>
              <p className="text-zinc-500 font-medium">Accédez à votre espace professionnel.</p>
           </div>

           {error && (
             <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold mb-6 animate-shake">
                {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Adresse E-mail</label>
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
                 <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-zinc-400">Mot de passe</label>
                    <Link href="#" className="text-xs font-bold text-zinc-400 hover:text-black">Oublié ?</Link>
                 </div>
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
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Se connecter <ArrowRight size={20} /></>}
              </button>
           </form>

           <div className="mt-10 text-center text-sm font-medium text-zinc-500">
              Pas encore de compte ? <Link href="/register" className="text-black font-bold hover:underline">S'inscrire</Link>
           </div>
        </div>
        
        {/* Footer info */}
        <p className="mt-10 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
           Sécurité de niveau institutionnel
        </p>
      </div>
    </div>
  )
}
