'use client'

import { useState } from 'react'
import { PlusCircle, X, Briefcase, Building2, Calendar, MapPin, Loader2, Save } from 'lucide-react'
import { addExperience } from '../actions'

export default function AddExperienceModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isCurrent, setIsCurrent] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await addExperience(formData)

    if (result.success) {
      setIsOpen(false)
      setIsCurrent(false)
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-8 py-5 rounded-[24px] font-bold flex items-center gap-2 hover:shadow-2xl shadow-black/20 transition-all active:scale-95"
      >
        <PlusCircle size={20} />
        Nouvelle expérience
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
         <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">Ajouter une expérience</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
               <X size={24} />
            </button>
         </div>

         <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Poste occupé</label>
                  <div className="relative">
                     <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                     <input 
                       name="job_title" 
                       required 
                       placeholder="Développeur Fullstack"
                       className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:ring-2 focus:ring-black/5 outline-none"
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Entreprise</label>
                  <div className="relative">
                     <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                     <input 
                       name="company_name" 
                       required 
                       placeholder="Tech Solutions"
                       className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:ring-2 focus:ring-black/5 outline-none"
                     />
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Date de début</label>
                  <div className="relative">
                     <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                     <input 
                       name="start_date" 
                       type="date"
                       required 
                       className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:ring-2 focus:ring-black/5 outline-none"
                     />
                  </div>
               </div>
               {!isCurrent && (
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Date de fin</label>
                    <div className="relative">
                       <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                       <input 
                         name="end_date" 
                         type="date"
                         required={!isCurrent}
                         className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:ring-2 focus:ring-black/5 outline-none"
                       />
                    </div>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 cursor-pointer" onClick={() => setIsCurrent(!isCurrent)}>
               <input 
                 type="checkbox" 
                 name="is_current" 
                 checked={isCurrent}
                 onChange={(e) => setIsCurrent(e.target.checked)}
                 className="w-5 h-5 accent-black"
               />
               <span className="text-sm font-bold text-zinc-700">C'est mon poste actuel</span>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Description (Optionnel)</label>
               <textarea 
                 name="description" 
                 placeholder="Décrivez vos missions et réalisations..."
                 className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:ring-2 focus:ring-black/5 outline-none min-h-[120px]"
               />
            </div>

            <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row gap-4">
               <button 
                 type="button"
                 onClick={() => setIsOpen(false)}
                 className="flex-1 px-6 py-4 rounded-2xl border-2 border-zinc-200 font-bold text-zinc-500 hover:bg-white transition-all w-full sm:w-auto"
               >
                  Annuler
               </button>
               <button 
                 type="submit"
                 disabled={loading}
                 className="flex-[2] bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-xl shadow-black/10 w-full sm:w-auto"
               >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer</>}
               </button>
            </div>
         </form>
      </div>
    </div>
  )
}
