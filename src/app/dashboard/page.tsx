import { createClient } from '@/lib/supabase/server'
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Building2, 
  ArrowRight,
  Search,
  PlusCircle,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { EmploymentChart, SectorChart } from './DashboardCharts'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, status')
    .eq('id', user?.id)
    .single()

  // Business Logic: Fetch Aggregate Data for Charts
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('status')

  const statusCounts = (allProfiles || []).reduce((acc: any, curr: any) => {
    const status = curr.status || 'En recherche'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }))

  // Fetch recent profiles
  const { data: recentAlumni } = await supabase
    .from('profiles')
    .select('id, full_name, promo_year, status, avatar_url, created_at')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Tableau de bord personnel</div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
             Content de vous revoir, <br />
             <span className="text-zinc-400 font-extrabold">{profile?.full_name || 'Alumni'}</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/dashboard/experiences" className="bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-95 leading-none">
              <PlusCircle size={18} />
              Ajouter une expérience
           </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <KpiCard 
           icon={<TrendingUp size={24} className="text-green-600" />} 
           label="Ma Visibilité" 
           value="Top 15%" 
           desc="Parmis les alumni de votre promotion"
         />
         <KpiCard 
           icon={<Users size={24} className="text-blue-600" />} 
           label="Réseau Promo" 
           value="124" 
           desc="Membres actifs cette semaine"
         />
         <KpiCard 
           icon={<MapPin size={24} className="text-purple-600" />} 
           label="Opportunités" 
           value="12" 
           desc="Offres proches de vous"
         />
         <KpiCard 
           icon={<Building2 size={24} className="text-orange-600" />} 
           label="Statut Actuel" 
           value={profile?.status || 'En recherche'} 
           desc="Mise à jour il y a 2j"
         />
      </div>

      {/* Main Grid: Analytical Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
         <div className="p-8 bg-white border border-zinc-100 rounded-[40px] shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-zinc-900">Répartition par Statut</h3>
               <span className="text-xs font-bold text-zinc-400">Total: 100%</span>
            </div>
            <EmploymentChart data={chartData} />
            <div className="grid grid-cols-2 gap-4 mt-4">
               {chartData.length > 0 ? chartData.map((item, i) => (
                 <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#0056b3', '#10b981', '#f59e0b', '#8b5cf6'][i % 4] }} />
                    <span className="text-xs font-bold text-zinc-500">{item.name}: <span className="text-black">{item.value as number}</span></span>
                 </div>
               )) : (
                 ['En poste', 'En recherche', 'Entrepreneur', 'Étudiant'].map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#0056b3', '#10b981', '#f59e0b', '#8b5cf6'][i] }} />
                       <span className="text-xs font-bold text-zinc-500">{label}</span>
                    </div>
                  ))
               )}
            </div>
         </div>

         <div className="p-8 bg-white border border-zinc-100 rounded-[40px] shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-zinc-900">Top Secteurs d'Activité</h3>
               <span className="text-xs font-bold text-zinc-400">Derniers 12 mois</span>
            </div>
            <SectorChart data={[]} />
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Feed/Activity */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black tracking-tight">Activités du réseau</h2>
               <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
               </div>
            </div>

            <div className="space-y-4">
               {recentAlumni?.map((person) => (
                 <Link 
                   href={`/dashboard/directory/${person.id}`}
                   key={person.id} 
                   className="block p-6 bg-white border border-zinc-100 rounded-[28px] hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all group cursor-pointer"
                 >
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 overflow-hidden border border-zinc-100">
                          {person.avatar_url ? (
                            <img src={person.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users size={24} />
                          )}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-zinc-900 group-hover:text-brand transition-colors">{person.full_name}</h4>
                             <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">Nouveau Membre</span>
                          </div>
                          <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">
                            Promotion {person.promo_year} • A rejoint le réseau
                          </p>
                       </div>
                       <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <ArrowRight size={20} className="text-brand" />
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
         </div>

         {/* Sidebar widgets */}
         <div className="space-y-8">
            <div className="p-8 bg-zinc-900 rounded-[32px] text-white overflow-hidden relative group">
               <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">Maximisez votre profil</h3>
                  <p className="text-zinc-400 text-sm font-medium mb-6">
                    Un profil complet augmente vos chances d'être contacté par des recruteurs de 80%.
                  </p>
                  <div className="w-full bg-zinc-800 h-2 rounded-full mb-8">
                     <div className="w-2/3 h-full bg-blue-500 rounded-full" />
                  </div>
                  <Link 
                    href="/dashboard/profile"
                    className="block w-full bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 leading-none text-center"
                  >
                     Compléter mon profil
                  </Link>
               </div>
               <Zap className="absolute -bottom-8 -right-8 text-white/5 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="p-8 bg-white border border-zinc-100 rounded-[32px]">
               <h3 className="text-lg font-bold mb-6">Prochains Événements</h3>
               <div className="space-y-6">
                  {[
                    { title: "Webinaire Employabilité", date: "15 Avril" },
                    { title: "Meetup Alumni Tech", date: "22 Mai" }
                  ].map((ev, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-12 h-12 bg-zinc-50 rounded-xl flex flex-col items-center justify-center border border-zinc-100">
                          <span className="text-[10px] font-black text-zinc-400 leading-none mb-1">AVR</span>
                          <span className="text-sm font-bold text-black leading-none">{15+i}</span>
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-zinc-900">{ev.title}</h4>
                          <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">S'inscrire</Link>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: string, desc: string }) {
  return (
    <div className="p-6 bg-white border border-zinc-100 rounded-[32px] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all group">
       <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">{label}</div>
       <div className="text-2xl font-black text-zinc-900 mb-1">{value}</div>
       <div className="text-[10px] font-bold text-zinc-500 leading-tight">{desc}</div>
    </div>
  )
}
