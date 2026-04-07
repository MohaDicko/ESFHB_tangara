import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  User,
  ArrowRight,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const PAGE_SIZE = 24

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, promo?: string, page?: string }>
}) {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-10 pb-24">
       <div className="space-y-6">
          <div>
             <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">Annuaire des Anciens</h1>
             <p className="text-zinc-500 font-bold">Retrouvez vos camarades et développez votre réseau au sein de l&apos;ESFHB Mali.</p>
          </div>
          <Suspense fallback={<div className="h-20 bg-zinc-100 rounded-[32px] animate-pulse" />}>
             <SearchBar searchParams={searchParams} />
          </Suspense>
       </div>

       <Suspense fallback={<DirectorySkeleton />}>
          <AlumniList searchParams={searchParams} />
       </Suspense>
    </div>
  )
}

async function SearchBar({ searchParams }: { searchParams: Promise<{ q?: string, promo?: string }> }) {
  const { q, promo } = await searchParams
  const promoYears = Array.from({ length: 20 }, (_, i) => 2024 - i)

  return (
    <form action="/dashboard/directory" method="GET" className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[32px] border border-zinc-100 shadow-sm">
      <input type="hidden" name="page" value="1" />
      <div className="flex-1 relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input 
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom..."
          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-brand/10 outline-none"
        />
      </div>
      <div className="flex gap-4">
        <select 
          name="promo"
          defaultValue={promo}
          className="px-6 py-4 bg-zinc-50 border-none rounded-2xl font-bold text-zinc-500 focus:ring-2 focus:ring-brand/10 outline-none appearance-none"
        >
          <option value="">Toutes les promos</option>
          {promoYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button type="submit" className="bg-brand text-white px-8 py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-brand/20 active:scale-95">
          Appliquer
        </button>
      </div>
    </form>
  )
}

async function AlumniList({ searchParams }: { searchParams: Promise<{ q?: string, promo?: string, page?: string }> }) {
  const { q, promo, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1'))
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  // ⚠️ Ordre important: filtres D'ABORD, range ENSUITE
  let query = supabase
    .from('profiles')
    .select('id, full_name, promo_year, specialty, city, is_email_public, is_contact_public, avatar_url, status', { count: 'exact' })
    .order('promo_year', { ascending: false })

  if (q && q.trim()) query = query.ilike('full_name', `%${q.trim()}%`)
  if (promo && promo !== '') query = query.eq('promo_year', parseInt(promo))

  // Range APRÈS les filtres
  query = query.range(from, to)

  const { data: alumni, count } = await query

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  if (!alumni || alumni.length === 0) {
    return (
      <div className="p-20 bg-zinc-50 rounded-[48px] text-center space-y-4 border-2 border-dashed border-zinc-200">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-300 mx-auto shadow-sm">
          <Search size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-950">Aucun résultat trouvé</h3>
        <p className="text-zinc-500 font-medium max-w-xs mx-auto">Essayez d&apos;ajuster vos filtres.</p>
      </div>
    )
  }

  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (promo) params.set('promo', promo)

  return (
    <div className="space-y-8">
      {/* Compteur */}
      <div className="text-sm font-bold text-zinc-400">
        <span className="text-zinc-900 font-black">{count}</span> alumni trouvés • Page {currentPage} / {totalPages}
      </div>

      {/* Grille */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {alumni.map((person) => (
          <div key={person.id} className="group p-7 bg-white border border-zinc-100 rounded-[36px] hover:border-brand/20 hover:shadow-2xl hover:shadow-brand/5 transition-all relative overflow-hidden">
            <div className="flex flex-col items-center text-center space-y-5 relative z-10">
              <div className="w-20 h-20 bg-zinc-50 rounded-[28px] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt={person.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-zinc-200" />
                )}
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-zinc-950 truncate max-w-full">{person.full_name}</h3>
                <div className="flex flex-col gap-0.5 items-center">
                  <span className="text-xs font-black text-brand uppercase tracking-widest flex items-center gap-1">
                    <GraduationCap size={11} /> Promo {person.promo_year}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 italic">
                    {person.specialty || 'Spécialité non définie'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-5 text-zinc-400 text-xs font-bold pt-2 border-t border-zinc-50 w-full justify-center">
                <span className="flex items-center gap-1"><MapPin size={12} /> {person.city || 'Mali'}</span>
                <div className="flex gap-1.5">
                  {person.is_email_public && <Mail size={12} className="text-brand" />}
                  {person.is_contact_public && <Phone size={12} className="text-green-500" />}
                </div>
              </div>

              <Link 
                href={`/dashboard/directory/${person.id}`}
                className="w-full py-3.5 bg-zinc-50 rounded-xl text-zinc-900 text-sm font-bold group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Voir le profil
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {currentPage > 1 && (
            <Link 
              href={`?${params.toString()}&page=${currentPage - 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-2xl font-bold text-sm hover:border-brand/30 transition-all"
            >
              <ChevronLeft size={16} /> Précédent
            </Link>
          )}
          
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i
              return (
                <Link
                  key={p}
                  href={`?${params.toString()}&page=${p}`}
                  className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                    p === currentPage 
                      ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:border-brand/30'
                  }`}
                >
                  {p}
                </Link>
              )
            })}
          </div>

          {currentPage < totalPages && (
            <Link 
              href={`?${params.toString()}&page=${currentPage + 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-2xl font-bold text-sm hover:border-brand/30 transition-all"
            >
              Suivant <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function DirectorySkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-6 bg-zinc-100 rounded-xl w-48 animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[300px] bg-zinc-100 rounded-[36px] animate-pulse" />
        ))}
      </div>
    </div>
  )
}
