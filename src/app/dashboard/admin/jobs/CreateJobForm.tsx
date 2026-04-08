'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { createJobOffer } from './actions'

export default function CreateJobForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const result = await createJobOffer(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
      ;(event.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-[40px] p-8 border border-zinc-100 shadow-sm">
      <h2 className="text-2xl font-black mb-6">Nouvelle offre d'emploi</h2>
      
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-bold">{error}</div>}
      {success && <div className="p-4 bg-green-50 text-green-600 rounded-2xl mb-6 text-sm font-bold">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Titre du poste *</label>
            <input name="title" required className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none" placeholder="Ex: Infirmier(ère) Chef" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Entreprise / Hôpital *</label>
            <input name="company" required className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none" placeholder="Ex: CHU Gabriel Touré" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Email de contact *</label>
            <input name="contact_email" type="email" required className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none" placeholder="recrutement@chu.ml" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Localisation</label>
            <input name="location" className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none" placeholder="Ex: Bamako" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Type de contrat *</label>
            <select name="type" className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none">
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Spécialité visée</label>
            <select name="target_specialty" className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none">
              <option value="Toutes">Toutes les spécialités</option>
              <option value="SMI">Santé Maternelle (SMI)</option>
              <option value="SP">Santé Publique (SP)</option>
              <option value="TLP">Tech. Labo (TLP)</option>
              <option value="BM">Biologie Médicale (BM)</option>
              <option value="SF">Sage-Femme (SF)</option>
              <option value="IDE">Infirmier (IDE)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Rémunération / Salaire</label>
          <input name="salary_range" className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none" placeholder="Ex: 250k - 300k FCFA (Optionnel)" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Description *</label>
          <textarea name="description" required rows={4} className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none resize-none" placeholder="Détails de l'offre..." />
        </div>

        <button type="submit" disabled={loading} className="px-8 py-4 bg-brand text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 w-full active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-brand/20">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Publier l'offre
        </button>
      </form>
    </div>
  )
}
