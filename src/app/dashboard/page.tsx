import { createClient } from '@/lib/supabase/server'
import { 
  TrendingUp, 
  Users as UsersIcon, 
  MapPin, 
  Building2, 
  ArrowRight,
  Search,
  PlusCircle,
  Sparkles
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
    <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      <DashboardHeader />

      <KpiSection />

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <StatusChartSection />
        <SectorChartSection />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
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
    <div className="relative p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#0b0f17] via-[#0f172a] to-[#06241b] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            <Sparkles size={14} className="animate-pulse" />
            Espace Professionnel ESFHB
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
              Bonjour, <span className="gradient-text-emerald">{profile?.full_name?.split(' ')[0] || 'Diplômé'}</span>
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-md mt-2">
              Bienvenue sur votre portail de suivi et de réseautage {profile?.specialty ? `— ${profile.specialty}` : ''}.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/dashboard/experiences" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all">
            <PlusCircle size={16} />
            Parcours Pro
          </Link>
          <Link href="/dashboard/directory" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/10 px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
            <Search size={16} />
            Annuaire
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <KpiCard icon={<TrendingUp size={22} className="text-emerald-400" />} label="Engagement Promo" value="Top 10%" desc="Visibilité réseau" />
      <KpiCard icon={<UsersIcon size={22} className="text-sky-400" />} label="Réseau Alumni" value="1 240+" desc="Membres enregistrés" />
      <KpiCard icon={<MapPin size={22} className="text-teal-400" />} label="Opportunités" value="14" desc="Offres en cours" />
      <KpiCard icon={<Building2 size={22} className="text-amber-400" />} label="Statut Actuel" value={profile?.status || 'Non renseigné'} desc="Mise à jour récente" />
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
    <div className="p-6 sm:p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Répartition par Statut</h3>
        <span className="text-xs font-semibold text-emerald-400">Total : {statusFallback?.length || 0} Membres</span>
      </div>
      <EmploymentChart data={chartData} />
    </div>
  )
}

async function SectorChartSection() {
  return (
    <div className="p-6 sm:p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Top Secteurs d'Activité</h3>
        <span className="text-xs font-semibold text-slate-400">Santé & Pharmacie</span>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Dernières Inscriptions</h2>
        <Link href="/dashboard/directory" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
          Voir l'annuaire <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {recentAlumni?.map((person) => (
          <Link href={`/dashboard/directory/${person.id}`} key={person.id} className="block p-4 bg-slate-900/60 border border-white/10 rounded-2xl hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                {person.avatar_url ? <img src={person.avatar_url} alt="" className="w-full h-full object-cover" /> : <UsersIcon size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors truncate">{person.full_name}</h4>
                <p className="text-xs text-slate-400 truncate">Promotion {person.promo_year} • {person.status || 'Alumnus'}</p>
              </div>
              <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SidebarWidgets() {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/20 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-2">Maximisez votre profil</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-6">
          Un profil renseigné avec précision facilite le réseautage et les opportunités professionnelles.
        </p>
        <Link href="/dashboard/profile" className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs text-center transition-all shadow-lg shadow-emerald-500/20">
          Compléter mon Profil
        </Link>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: string, desc: string }) {
  return (
    <div className="p-6 bg-slate-900/60 border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-black text-white mb-1 truncate">{value}</div>
      <div className="text-xs text-slate-400">{desc}</div>
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <div className="h-32 bg-slate-900/50 rounded-2xl animate-pulse" />
      <div className="h-32 bg-slate-900/50 rounded-2xl animate-pulse" />
      <div className="h-32 bg-slate-900/50 rounded-2xl animate-pulse" />
      <div className="h-32 bg-slate-900/50 rounded-2xl animate-pulse" />
    </div>
  )
}
