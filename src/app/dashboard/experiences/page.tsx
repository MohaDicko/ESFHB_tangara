import { createClient } from '@/lib/supabase/server'
import { Briefcase } from 'lucide-react'
import { Suspense } from 'react'
import AddExperienceModal from './AddExperienceModal'
import ExperienceItem from './ExperienceItem'

export const dynamic = 'force-dynamic'

export default async function ExperiencesPage() {
  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-24">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-zinc-200">
          <div>
             <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">Parcours Pro</h1>
             <p className="text-zinc-500 font-bold">Gérez votre historique professionnel et vos réalisations.</p>
          </div>
          <AddExperienceModal />
       </div>

       {/* List of Experiences wrapped in Suspense */}
       <Suspense fallback={<ExperiencesSkeleton />}>
          <ExperienceList />
       </Suspense>
    </div>
  )
}

async function ExperienceList() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('profile_id', user?.id)
    .order('start_date', { ascending: false })

  return (
     <div className="space-y-6">
        {experiences && experiences.length > 0 ? (
          experiences.map((exp: any, index: number) => (
            <ExperienceItem key={exp.id} exp={exp} index={index} />
          ))
        ) : (
          <div className="px-10 py-24 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200 text-center space-y-6">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-zinc-300 mx-auto shadow-sm">
                <Briefcase size={40} />
             </div>
             <div className="max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune expérience ajoutée</h3>
                <p className="text-zinc-500 font-medium pb-6">
                  Mettez en valeur votre parcours pour inspirer les autres anciens et attirer des opportunités.
                </p>
             </div>
          </div>
        )}
     </div>
  )
}

function ExperiencesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
       {[1, 2, 3].map(i => (
         <div key={i} className="h-32 bg-zinc-50 rounded-[32px]" />
       ))}
    </div>
  )
}
