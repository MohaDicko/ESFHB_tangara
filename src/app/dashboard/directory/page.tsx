import { createClient } from '@/lib/supabase/server'
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  User,
  ArrowRight,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
const PAGE_SIZE = 24

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, promo?: string, specialty?: string, status?: string, page?: string }>
}) {
  return (
    <Suspense fallback={<DirectorySkeleton />}>
      <DirectoryView searchParams={searchParams} />
    </Suspense>
  )
}

async function DirectoryView({ searchParams }: { searchParams: Promise<{ q?: string, promo?: string, specialty?: string, status?: string, page?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single()
    isAdmin = roleData?.role === 'admin'
  }
  const { q, promo, specialty, status } = await searchParams

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white">Annuaire des Diplômés</h1>
            <p className="text-slate-400 text-xs sm:text-sm">Réseau officiel des alumni de l'ESFHB Mali.</p>
          </div>
          {isAdmin && (
            <a 
              href={`/api/admin/export?${new URLSearchParams([ ...(q ? [['q', q]] : []), ...(status ? [['status', status]] : []), ...(promo ? [['promo', promo]] : []), ...(specialty ? [['specialty', specialty]] : []) ]).toString()}`} 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl text-xs font-bold transition-all shrink-0 w-fit"
            >
              <Download size={14} /> Export CSV
            </a>
          )}
        </div>
        <SearchBar searchParams={searchParams} />
      </div>
      <AlumniList searchParams={searchParams} />
    </div>
  )
}

async function SearchBar({ searchParams }: { searchParams: Promise<{ q?: string, promo?: string, specialty?: string, status?: string }> }) {
  const { q, promo, specialty, status } = await searchParams
  const promoYears = Array.from({ length: 25 }, (_, i) => 2025 - i)

  return (
    <form action="/dashboard/directory" method="GET" className="flex flex-col lg:flex-row gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-white/10 shadow-xl">
      <input type="hidden" name="page" value="1" />
      
      <div className="flex-1 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom..."
          className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl font-medium text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2">
        <select 
          name="promo"
          defaultValue={promo}
          className="px-3 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-emerald-500 transition-all appearance-none"
        >
          <option value="">Toutes promos</option>
          {promoYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select 
          name="specialty"
          defaultValue={specialty}
          className="px-3 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-emerald-500 transition-all appearance-none"
        >
          <option value="">Spécialité</option>
          <option value="SMI">SMI</option>
          <option value="SP">SP</option>
          <option value="TLP">TLP</option>
          <option value="BM">BM</option>
          <option value="SF">SF</option>
          <option value="IDE">IDE</option>
        </select>

        <select 
          name="status"
          defaultValue={status}
          className="col-span-2 sm:col-span-1 px-3 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-emerald-500 transition-all appearance-none"
        >
          <option value="">Tous statuts</option>
          <option value="En poste">En poste</option>
          <option value="En recherche">En recherche</option>
          <option value="Entrepreneur">Entrepreneur</option>
          <option value="Étudiant">Étudiant</option>
        </select>

        <button type="submit" className="col-span-2 sm:col-span-3 lg:col-span-none bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:brightness-110 transition-all shadow-md">
          Filtrer
        </button>
      </div>
    </form>
  )
}

async function AlumniList({ searchParams }: { searchParams: Promise<{ q?: string, promo?: string, specialty?: string, status?: string, page?: string }> }) {
  const { q, promo, specialty, status, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1'))
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('id, full_name, promo_year, specialty, city, is_email_public, is_contact_public, avatar_url, status', { count: 'exact' })
    .order('promo_year', { ascending: false })

  if (q && q.trim()) query = query.ilike('full_name', `%${q.trim()}%`)
  if (promo && promo !== '') query = query.eq('promo_year', parseInt(promo))
  if (specialty && specialty !== '') query = query.eq('specialty', specialty)
  if (status && status !== '') query = query.eq('status', status)

  query = query.range(from, to)

  const { data: alumni, count } = await query
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  if (!alumni || alumni.length === 0) {
    return (
      <div className="p-12 bg-slate-900/40 border border-white/10 rounded-2xl text-center space-y-3">
        <Search size={28} className="text-slate-500 mx-auto" />
        <h3 className="text-base font-bold text-white">Aucun profil ne correspond</h3>
        <p className="text-slate-400 text-xs">Modifiez vos filtres de recherche.</p>
      </div>
    )
  }

  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (promo) params.set('promo', promo)
  if (specialty) params.set('specialty', specialty)
  if (status) params.set('status', status)

  return (
    <div className="space-y-6">
      <div className="text-xs font-semibold text-slate-400">
        <span className="text-white font-bold">{count}</span> membres • Page {currentPage} / {totalPages}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {alumni.map((person) => (
          <div key={person.id} className="p-6 bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 rounded-2xl transition-all group flex flex-col justify-between space-y-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt={person.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-slate-500" />
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{person.full_name}</h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-1">
                  <GraduationCap size={13} className="text-emerald-400" />
                  <span>Promo {person.promo_year}</span>
                  {person.specialty && <span className="text-slate-500">• {person.specialty}</span>}
                </div>
              </div>

              {person.status && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {person.status}
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin size={12} /> {person.city || 'Mali'}</span>
                <div className="flex items-center gap-1.5">
                  {person.is_email_public && <Mail size={12} className="text-emerald-400" />}
                  {person.is_contact_public && <Phone size={12} className="text-sky-400" />}
                </div>
              </div>

              <Link 
                href={`/dashboard/directory/${person.id}`}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white text-slate-200 text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
              >
                Voir le Profil <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {currentPage > 1 && (
            <Link href={`?${params.toString()}&page=${currentPage - 1}`} className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1">
              <ChevronLeft size={14} /> Précédent
            </Link>
          )}

          <div className="text-xs font-bold text-slate-400 px-3">
            {currentPage} / {totalPages}
          </div>

          {currentPage < totalPages && (
            <Link href={`?${params.toString()}&page=${currentPage + 1}`} className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1">
              Suivant <ChevronRight size={14} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function DirectorySkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-10 bg-slate-900/50 rounded-xl w-64 animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-slate-900/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
