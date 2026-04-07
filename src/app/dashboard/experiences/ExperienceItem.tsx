'use client'

import { useState } from 'react'
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Pencil, 
  Trash2, 
  Loader2 
} from 'lucide-react'
import { deleteExperience } from '../actions'

export default function ExperienceItem({ exp, index }: { exp: any, index: number }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Voulez-vous vraiment supprimer cette expérience ?')) return

    setIsDeleting(true)
    const result = await deleteExperience(exp.id)
    if (result.error) {
      alert(result.error)
      setIsDeleting(false)
    }
  }

  return (
    <div className={`p-8 bg-white border border-zinc-100 rounded-[40px] hover:border-zinc-200 transition-all group relative overflow-hidden ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
       <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform flex-shrink-0">
             <Building2 size={32} />
          </div>
          <div className="flex-1 space-y-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h3 className="text-2xl font-black text-zinc-950">{exp.job_title}</h3>
                   <p className="text-zinc-500 font-bold flex items-center gap-1.5 mt-1">
                      <span className="text-black">{exp.company_name}</span> 
                      {exp.sector && <span className="flex items-center gap-1"> • {exp.sector}</span>}
                   </p>
                </div>
                <div className="flex items-center gap-3">
                   <button className="p-3 rounded-xl hover:bg-zinc-50 text-zinc-400 hover:text-black transition-colors disabled:opacity-30">
                      <Pencil size={18} />
                   </button>
                   <button 
                     onClick={handleDelete}
                     disabled={isDeleting}
                     className="p-3 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-30"
                   >
                      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                   </button>
                </div>
             </div>
             
             <div className="flex flex-wrap gap-6 text-sm font-bold text-zinc-400">
                <span className="flex items-center gap-2">
                  <Calendar size={18} /> 
                  {new Date(exp.start_date).getFullYear()} — {exp.is_current ? 'Présent' : (exp.end_date ? new Date(exp.end_date).getFullYear() : 'N/A')}
                </span>
                <span className="flex items-center gap-2"><MapPin size={18} /> {exp.location || 'Distant'}</span>
             </div>

             {exp.description && (
               <p className="text-zinc-600 font-medium leading-relaxed max-w-3xl">
                  {exp.description}
               </p>
             )}
          </div>
       </div>
       {/* Decorative numbers - hidden on mobile to avoid overlap */}
       <div className="hidden md:block absolute top-1/2 right-12 -translate-y-1/2 text-zinc-50 font-black text-[120px] select-none group-hover:text-zinc-100 transition-colors pointer-events-none">
          0{index + 1}
       </div>
    </div>
  )
}
