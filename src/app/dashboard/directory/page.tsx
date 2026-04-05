import { createClient } from '@/lib/supabase/server'
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  User,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const unstable_instant = { prefetch: 'static' }

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, promo?: string, status?: string }>
}) {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 pb-24">
       {/* Header is static shell friendly */}
       <div className="space-y-6">
          <div>
             <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">Annuaire des Anciens</h1>
             <p className="text-zinc-500 font-bold">Retrouvez vos camarades et développez votre réseau au sein de l'ESFé Mali.</p>
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

async function SearchBar({ searchParams }: { searchParams: Promise<{ q?: string, promo?: string, status?: string }> }) {
  const { q, promo } = await searchParams
  
  return (
    <form className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[32px] border border-zinc-100 shadow-sm">
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
          {[2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button type="submit" className="bg-brand text-white px-8 py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-brand/20 active:scale-95">
          Appliquer
        </button>
      </div>
    </form>
  )
}

async function AlumniList({ searchParams }: { searchParams: Promise<{ q?: string, promo?: string, status?: string }> }) {
  const { q, promo, status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')
    .order('promo_year', { ascending: false })

  if (q) query = query.ilike('full_name', `%${q}%`)
  if (promo) query = query.eq('promo_year', promo)
  if (status) query = query.eq('status', status)

  const { data: alumni } = await query

  if (!alumni || alumni.length === 0) {
    return (
      <div className="p-20 bg-zinc-50 rounded-[48px] text-center space-y-4 border-2 border-dashed border-zinc-200">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-300 mx-auto shadow-sm">
          <Search size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-950">Aucun résultat trouvé</h3>
        <p className="text-zinc-500 font-medium max-w-xs mx-auto">Essayez d'ajuster vos filtres de recherche ou l'orthographe du nom.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {alumni.map((person) => (
        <div key={person.id} className="group p-8 bg-white border border-zinc-100 rounded-[40px] hover:border-brand/20 hover:shadow-2xl hover:shadow-brand/5 transition-all relative overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="w-24 h-24 bg-zinc-50 rounded-[32px] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
              {person.avatar_url ? (
                <img src={person.avatar_url} alt={person.full_name} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-zinc-200" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-950 truncate max-w-full">{person.full_name}</h3>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-xs font-black text-brand uppercase tracking-widest flex items-center gap-1">
                  <GraduationCap size={12} /> Promo {person.promo_year}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 italic">
                  {person.specialty || 'Spécialité non définie'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-zinc-400 text-sm font-bold pt-2 border-t border-zinc-50 w-full justify-center">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {person.city || 'Mali'}</span>
            </div>

            <Link 
              href={`/dashboard/directory/${person.id}`}
              className="w-full py-4 bg-zinc-50 rounded-2xl text-zinc-900 font-bold group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Voir le profil
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

function DirectorySkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-[350px] bg-zinc-100 rounded-[40px] animate-pulse" />
      ))}
    </div>
  )
}
