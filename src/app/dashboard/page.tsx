import { createClient } from '@/lib/supabase/server'
import { 
  TrendingUp, 
  Users as UsersIcon, 
  MapPin, 
  Building2, 
  ArrowRight,
  Search,
  PlusCircle,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { EmploymentChart, SectorChart } from './DashboardCharts'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  return (
    <Suspense fallback={<KpiSkeleton />}>
       <DashboardView />
    </Suspense>
  )
}

async function DashboardView() {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <DashboardHeader />

      <KpiSection />

      <div className="grid lg:grid-cols-2 gap-8">
        <StatusChartSection />
        <SectorChartSection />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2">
            <ActivitySection />
         </div>
         <SidebarWidgets />
      </div>
    </div>
  )
}

async function DashboardHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, specialty')
    .eq('id', user?.id)
    .single()

  return (
    <div className="relative p-7 md:p-14 bg-zinc-900 rounded-[32px] md:rounded-[48px] overflow-hidden group shadow-2xl shadow-blue-900/10">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-brand/20 to-transparent z-0" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-medical/10 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none z-0 overflow-hidden">
         <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 Q 100 100 200 200 T 400 200 T 600 200 T 800 200" fill="none" stroke="white" strokeWidth="2" className="animate-[pulse_4s_infinite]" />
            <circle cx="200" cy="200" r="4" fill="white" />
            <circle cx="400" cy="200" r="4" fill="white" />
            <circle cx="600" cy="200" r="4" fill="white" />
         </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-medical animate-pulse" />
              <span className="text-[10px] font-black text-zinc-100 uppercase tracking-widest">Portail Alumni Officiel</span>
           </div>
           <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2 leading-[0.9]">
                Bonjour, <br />
                <span className="text-brand italic">{profile?.full_name?.split(' ')[0] || 'Alumni'}</span>
              </h1>
              <p className="text-zinc-400 font-bold text-base md:text-xl max-w-md leading-relaxed mt-4">
                Heureux de vous revoir sur votre espace professionnel {profile?.specialty ? `en ${profile.specialty}` : ''}.
              </p>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <Link href="/dashboard/experiences" className="w-full sm:w-auto bg-brand text-white px-7 py-4 md:px-8 md:py-5 rounded-[20px] md:rounded-[24px] font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-brand/20 active:scale-95 leading-none">
              <PlusCircle size={18} />
              Ma Carrière
           </Link>
           <Link href="/dashboard/directory" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/10 px-7 py-4 md:px-8 md:py-5 rounded-[20px] md:rounded-[24px] font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-95 leading-none">
              <Search size={18} />
              Recherche
           </Link>
        </div>
      </div>
    </div>
  )
}

async function KpiSection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('status').eq('id', user?.id).single()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       <KpiCard icon={<TrendingUp size={24} className="text-green-600" />} label="Ma Visibilité" value="Top 15%" desc="Parmis les alumni de votre promotion" />
       <KpiCard icon={<UsersIcon size={24} className="text-blue-600" />} label="Réseau Promo" value="124" desc="Membres actifs cette semaine" />
       <KpiCard icon={<MapPin size={24} className="text-purple-600" />} label="Opportunités" value="12" desc="Offres proches de vous" />
       <KpiCard icon={<Building2 size={24} className="text-orange-600" />} label="Statut Actuel" value={profile?.status || 'Sans emploi'} desc="Mise à jour il y a 2j" />
    </div>
  )
}

async function StatusChartSection() {
  const supabase = await createClient()
  const { data: statusFallback } = await supabase.from('profiles').select('status')
  
  const statusCounts = (statusFallback || []).reduce((acc: Record<string, number>, curr: { status: string }) => {
    const s = curr.status || 'Sans emploi'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  return (
    <div className="p-8 bg-white border border-zinc-100 rounded-[40px] shadow-sm">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-xl font-black text-zinc-900">Répartition par Statut</h3>
         <span className="text-xs font-bold text-zinc-400">Total: 100%</span>
      </div>
      <EmploymentChart data={chartData} />
      <div className="grid grid-cols-2 gap-4 mt-4">
         {chartData.map((item, i) => (
           <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'][i % 4] }} />
              <span className="text-xs font-bold text-zinc-500">{item.name}: <span className="text-black">{item.value as number}</span></span>
           </div>
         ))}
      </div>
    </div>
  )
}

async function SectorChartSection() {
  return (
    <div className="p-8 bg-white border border-zinc-100 rounded-[40px] shadow-sm">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-xl font-black text-zinc-900">Top Secteurs d'Activité</h3>
         <span className="text-xs font-bold text-zinc-400">Derniers 12 mois</span>
      </div>
      <SectorChart data={[]} />
    </div>
  )
}

async function ActivitySection() {
  const supabase = await createClient()
  const { data: recentAlumni } = await supabase.from('profiles')
    .select('id, full_name, promo_year, status, avatar_url, created_at')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
         <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Dernières Actualités</h2>
         <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input type="text" placeholder="Rechercher..." className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/5" />
         </div>
      </div>

      <div className="space-y-4">
         {recentAlumni?.map((person) => (
           <Link href={`/dashboard/directory/${person.id}`} key={person.id} className="block p-6 bg-white border border-zinc-100 rounded-[28px] hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all group cursor-pointer" >
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 overflow-hidden border border-zinc-100">
                    {person.avatar_url ? <img src={person.avatar_url} alt="" className="w-full h-full object-cover" /> : <UsersIcon size={24} />}
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="font-bold text-zinc-900 group-hover:text-brand transition-colors">{person.full_name}</h4>
                       <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">Nouveau Membre</span>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">Promotion {person.promo_year} • A rejoint le réseau</p>
                 </div>
                 <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <ArrowRight size={20} className="text-brand" />
                 </div>
              </div>
           </Link>
         ))}
      </div>
    </div>
  )
}

function SidebarWidgets() {
  return (
    <div className="space-y-8">
      <div className="p-8 bg-zinc-900 rounded-[32px] text-white overflow-hidden relative group">
         <div className="relative z-10">
            <h3 className="text-xl font-bold mb-3">Maximisez votre profil</h3>
            <p className="text-zinc-400 text-sm font-medium mb-6">Un profil complet augmente vos chances d'être contacté par des recruteurs de 80%.</p>
            <div className="w-full bg-zinc-800 h-2 rounded-full mb-8"><div className="w-2/3 h-full bg-blue-500 rounded-full" /></div>
            <Link href="/dashboard/profile" className="block w-full bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 leading-none text-center" >Compléter mon profil</Link>
         </div>
         <Zap className="absolute -bottom-8 -right-8 text-white/5 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      <div className="p-8 bg-white border border-zinc-100 rounded-[32px]">
         <h3 className="text-lg font-bold mb-6">Prochains Événements</h3>
         <div className="space-y-6">
            {[{ title: "Webinaire Employabilité", date: "15 Avril" }, { title: "Meetup Alumni Tech", date: "22 Mai" }].map((ev, i) => (
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
  )
}

function KpiCard({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: string, desc: string }) {
  return (
    <div className="p-8 bg-white border border-zinc-100 rounded-[40px] hover:shadow-2xl hover:shadow-brand/5 hover:border-brand/20 hover:-translate-y-2 transition-all group relative overflow-hidden gradient-border">
       <div className="absolute -right-8 -top-8 w-24 h-24 bg-zinc-50 rounded-full group-hover:bg-brand/5 transition-colors" />
       <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg transition-all border border-zinc-100/50">{icon}</div>
       <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">{label}</div>
       <div className="text-3xl font-black text-zinc-900 mb-2 truncate">{value}</div>
       <div className="text-xs font-bold text-zinc-500 leading-relaxed max-w-[140px]">{desc}</div>
    </div>
  )
}

function DashboardHeaderSkeleton() { return <div className="h-24 bg-zinc-100 rounded-3xl animate-pulse" /> }
function KpiSkeleton() { return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div className="h-40 bg-zinc-100 rounded-[32px] animate-pulse" /><div className="h-40 bg-zinc-100 rounded-[32px] animate-pulse" /><div className="h-40 bg-zinc-100 rounded-[32px] animate-pulse" /><div className="h-40 bg-zinc-100 rounded-[32px] animate-pulse" /></div> }
function ChartSkeleton() { return <div className="h-[400px] bg-zinc-100 rounded-[40px] animate-pulse" /> }
function ActivitySkeleton() { return <div className="space-y-4 pt-10"><div className="h-20 bg-zinc-100 rounded-2xl animate-pulse" /><div className="h-20 bg-zinc-100 rounded-2xl animate-pulse" /><div className="h-20 bg-zinc-100 rounded-2xl animate-pulse" /></div> }
