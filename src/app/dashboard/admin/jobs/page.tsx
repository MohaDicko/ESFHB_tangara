import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, MapPin, Briefcase, Trash2, ArrowLeft } from 'lucide-react'
import CreateJobForm from './CreateJobForm'
import { deleteJobOffer } from './actions'

export default async function AdminJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: jobs } = await supabase
    .from('job_offers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/dashboard/admin" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black mb-4 transition-colors">
            <ArrowLeft size={16} /> Retour à l'administration
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2 italic">Offres d'emploi</h1>
          <p className="text-zinc-500 font-bold">Publier et gérer les offres visibles sur la page d'accueil.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 border-r border-zinc-100 pr-0 lg:pr-12">
          <CreateJobForm />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
               <Briefcase size={16} />
             </div>
             Offres publiées
          </h2>
          {!jobs || jobs.length === 0 ? (
            <div className="p-16 border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded-[40px] text-center flex flex-col items-center justify-center">
               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-300 mb-6">
                 <Briefcase size={24} />
               </div>
               <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune offre d'emploi</h3>
               <p className="text-zinc-500 font-medium max-w-sm">Utilisez le formulaire à gauche pour publier la première offre d'emploi sur la plateforme.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="group p-8 bg-white border border-zinc-100 rounded-[36px] flex flex-col justify-between hover:shadow-2xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand/5 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="z-10">
                    <div className="flex justify-between items-start mb-6">
                       <span className="px-3 py-1.5 bg-brand/10 text-brand rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                          {job.type}
                       </span>
                       <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${job.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                         {job.is_active ? 'Active' : 'Inactif'}
                       </span>
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-4 leading-tight group-hover:text-brand transition-colors">{job.title}</h3>
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm font-semibold text-zinc-600">
                         <Building2 size={16} className="text-zinc-400" /> {job.company}
                      </div>
                      {job.location && (
                         <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                            <MapPin size={16} className="text-zinc-400" /> {job.location}
                         </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-5 border-t border-zinc-100/80 z-10">
                     <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                        {new Date(job.created_at).toLocaleDateString('fr-FR')}
                     </span>
                     <form action={async () => {
                        'use server';
                        await deleteJobOffer(job.id);
                     }}>
                        <button type="submit" className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-500/20 active:scale-95" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                     </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
