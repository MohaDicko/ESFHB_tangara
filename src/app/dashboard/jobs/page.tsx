import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, MapPin, Briefcase, ArrowRight, Banknote } from 'lucide-react'

export const metadata = {
  title: 'Offres d\'emploi | ESFHB Alumni',
}

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: jobs } = await supabase
    .from('job_offers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2 italic">Opportunités</h1>
          <p className="text-zinc-500 font-bold">Consultez les dernières offres d'emploi et de stage disponibles pour les diplômés.</p>
        </div>
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded-[40px] text-center flex flex-col items-center justify-center">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-300 mb-6">
             <Briefcase size={24} />
           </div>
           <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune offre pour le moment</h3>
           <p className="text-zinc-500 font-medium max-w-sm">Revenez plus tard, l'administration publie régulièrement de nouvelles annonces de cliniques et centres partenaires.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="group p-8 md:p-10 bg-white border border-zinc-100 rounded-[36px] flex flex-col justify-between hover:shadow-2xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand/5 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="z-10">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 rounded-[18px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-brand">
                     <Building2 size={20} />
                   </div>
                   <div className="flex flex-col items-end gap-2">
                     <span className="px-3 py-1.5 bg-brand/10 text-brand rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-brand/10">
                        {job.type || 'CDI'}
                     </span>
                     {job.target_specialty && job.target_specialty !== 'Toutes' && (
                       <span className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/10">
                          {job.target_specialty}
                       </span>
                     )}
                   </div>
                </div>
                
                <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight leading-tight group-hover:text-brand transition-colors duration-300">
                  {job.title}
                </h3>
                
                <div className="flex flex-col gap-3 mt-6 mb-8">
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                    <Building2 size={16} className="text-zinc-400" />
                    <span>{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-3 text-sm font-semibold text-zinc-500">
                      <MapPin size={16} className="text-zinc-400" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary_range && (
                    <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                      <Banknote size={16} className="text-emerald-500" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-medium">
                  {job.description}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-5 border-t border-zinc-100/80 z-10">
                 <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                    {new Date(job.created_at).toLocaleDateString('fr-FR')}
                 </span>
                 {job.contact_email ? (
                   <a href={`mailto:${job.contact_email}?subject=Candidature pour le poste: ${job.title}&body=Bonjour,%0D%0A%0D%0AJe vous écris concernant l'offre ${job.title} chez ${job.company}.`} className="relative z-10 py-3 px-6 rounded-xl bg-brand text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all duration-300 shadow-md shadow-brand/20 active:scale-95 group/btn">
                     Postuler <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                   </a>
                 ) : (
                   <button disabled className="relative z-10 py-3 px-6 rounded-xl bg-zinc-200 text-zinc-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-none cursor-not-allowed">
                     Indisponible
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
