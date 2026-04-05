import { createClient } from '@/lib/supabase/server'
import { 
  Calendar, 
  MapPin, 
  GraduationCap, 
  ChevronLeft,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const unstable_instant = { prefetch: 'static' }

export default async function AlumniProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) {
    notFound()
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
       {/* Back Button */}
       <Link href="/dashboard/directory" className="flex items-center gap-2 text-zinc-500 font-bold hover:text-brand transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Retour à l'annuaire
       </Link>

       {/* Header */}
       <div className="p-10 bg-white border border-zinc-100 rounded-[48px] shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-50 rounded-[40px] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden shadow-brand/5">
             <div className="text-zinc-200">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <Briefcase size={64} />
                )}
             </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
             <div>
                <h1 className="text-4xl font-black tracking-tight text-zinc-950 mb-1">{profile.full_name}</h1>
                <p className="text-brand font-black text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
                   <GraduationCap size={16} /> Promotion {profile.promo_year} • {profile.specialty || 'ESFé Mali'}
                </p>
             </div>
             
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold text-zinc-400">
                <span className="flex items-center gap-2"><MapPin size={18} /> {profile.city || 'Mali'}</span>
             </div>

             <div className={`inline-flex px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
               profile.status === 'En poste' ? 'bg-green-50 text-green-600' : 'bg-brand/5 text-brand'
             }`}>
                {profile.status}
             </div>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
             <button className="w-full py-4 px-6 bg-brand text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-brand/20 transition-all">
                <Mail size={18} /> Contacter par email
             </button>
             <button className="w-full py-4 px-6 bg-zinc-50 text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all">
                <Phone size={18} /> Voir le numéro
             </button>
          </div>
       </div>

       <div className="grid md:grid-cols-3 gap-12">
          {/* Timeline & Experiences */}
          <div className="md:col-span-2 space-y-10">
             <Suspense fallback={<div className="h-64 bg-zinc-100 rounded-[32px] animate-pulse" />}>
                <ExperienceTimeline profileId={id} />
             </Suspense>
          </div>

          {/* Bio / About */}
          <div className="space-y-10">
             <section className="p-8 bg-zinc-950 rounded-[40px] text-white space-y-6 overflow-hidden relative group">
                <div className="relative z-10">
                   <h3 className="text-lg font-bold">À propos de {profile.full_name.split(' ')[0]}</h3>
                   <p className="text-sm font-medium text-zinc-400 leading-loose">
                      {profile.bio || "Aucune description fournie."}
                   </p>
                </div>
                <GraduationCap size={150} className="absolute -bottom-10 -right-10 text-white/5 rotate-12 group-hover:scale-125 transition-transform duration-700" />
             </section>

             <section className="p-8 bg-white border border-zinc-100 rounded-[40px] space-y-6">
                <h3 className="text-lg font-bold">Informations Clés</h3>
                <div className="space-y-4">
                   <InfoRow label="Promotion" value={profile.promo_year} />
                   <InfoRow label="Spécialité" value={profile.specialty || 'Santé'} />
                   <InfoRow label="Localisation" value={profile.city || 'Mali'} />
                   <InfoRow label="Etablissement" value="ESFé Mali" />
                </div>
             </section>
          </div>
       </div>
    </div>
  )
}

async function ExperienceTimeline({ profileId }: { profileId: string }) {
  const supabase = await createClient()
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false })

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
        <Briefcase size={24} className="text-zinc-400" /> Parcours Professionnel
      </h2>
      <div className="relative space-y-12 before:absolute before:left-8 before:top-2 before:bottom-2 before:w-1 before:bg-brand/5">
        {experiences && experiences.length > 0 ? (
          experiences.map((exp) => (
            <div key={exp.id} className="relative pl-16 group">
              <div className="absolute left-[26px] top-1.5 w-3 h-3 bg-white border-2 border-brand rounded-full z-10 group-hover:scale-150 transition-transform shadow-sm" />
              
              <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[32px] group-hover:bg-white group-hover:border-brand/10 transition-all">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <h3 className="text-xl font-bold text-zinc-950">{exp.job_title}</h3>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-zinc-100 shadow-sm">
                    <Calendar size={12} /> {new Date(exp.start_date).getFullYear()} — {exp.is_current ? 'Présent' : (exp.end_date ? new Date(exp.end_date).getFullYear() : '')}
                  </div>
                </div>
                <p className="text-lg font-bold text-zinc-600 mb-4">{exp.company_name}</p>
                {exp.description && (
                  <p className="text-zinc-500 font-medium leading-relaxed italic">
                    " {exp.description} "
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-zinc-400 font-bold border-2 border-dashed border-zinc-100 rounded-[32px]">
            Aucune expérience renseignée pour le moment.
          </div>
        )}
      </div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string, value: any }) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-zinc-50 last:border-0">
       <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
       <span className="text-sm font-black text-zinc-950">{value}</span>
    </div>
  )
}
