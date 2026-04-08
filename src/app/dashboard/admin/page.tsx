import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import MemberActionsMenu from './MemberActionsMenu'

const PAGE_SIZE = 20

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, page?: string, status?: string }>
}) {
  const { q, page, status } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1'))
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check Admin Role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch Statistics
  const { count: totalAlumni } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: enPoste } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Privé', 'Public'])

  // Fetch all profiles for the management table (paginated & filtered)
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (q && q.trim()) query = query.ilike('full_name', `%${q.trim()}%`)
  if (status && status !== '') query = query.eq('status', status)

  query = query.range(from, to)

  const { data: alumni, count: membersCount } = await query
  const totalPages = Math.ceil((membersCount || 0) / PAGE_SIZE)


  const placementRate = totalAlumni ? Math.round((enPoste || 0) / totalAlumni * 100) : 0

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2 italic">Administration</h1>
          <p className="text-zinc-500 font-bold">Gestion globale de l'annuaire et statistiques de l'école.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/jobs" className="bg-brand text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:brightness-110 transition-all leading-none shadow-xl shadow-brand/20">
            <Briefcase size={18} />
            Gérer les offres
          </Link>
          <a href="/api/export-csv" className="bg-zinc-100 text-zinc-900 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all leading-none border border-zinc-200">
            <Download size={18} />
            Exporter CSV
          </a>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-black rounded-[40px] text-white space-y-2">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <Users size={24} className="text-white" />
          </div>
          <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Total Alumni</div>
          <div className="text-5xl font-black">{totalAlumni || 0}</div>
        </div>
        
        <div className="p-8 bg-white border border-zinc-100 rounded-[40px] space-y-2 shadow-sm">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
            <UserCheck size={24} className="text-green-600" />
          </div>
          <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Taux d'Insertion</div>
          <div className="text-5xl font-black text-zinc-900">{placementRate}%</div>
        </div>

        <div className="p-8 bg-white border border-zinc-100 rounded-[40px] space-y-2 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <ShieldAlert size={24} className="text-blue-600" />
          </div>
          <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Signalements</div>
          <div className="text-5xl font-black text-zinc-900">0</div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-zinc-100 rounded-[48px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row justify-between gap-6 items-center flex-wrap">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Gestion des Membres</h2>
            <p className="text-sm text-zinc-500 font-bold">{membersCount || 0} membres trouvés</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
            <form action="/dashboard/admin" method="GET" className="flex gap-4 w-full md:w-auto">
              <input type="hidden" name="page" value="1" />
              <div className="relative flex-1 md:w-48 flex">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  name="q"
                  defaultValue={q}
                  type="text" 
                  placeholder="Nom..." 
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none"
                />
              </div>
              <select name="status" defaultValue={status} className="px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none appearance-none cursor-pointer">
                <option value="">Tous les statuts</option>
                <option value="Privé">Secteur Privé</option>
                <option value="Public">Secteur Public</option>
                <option value="Sans emploi">Sans emploi</option>
                <option value="Bénévolat">Bénévolat</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Étudiant">Étudiant</option>
              </select>
              <button type="submit" className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shrink-0 shadow-lg shadow-black/10 active:scale-95">
                Filtrer
              </button>
            </form>
            
            <a 
              href={`/api/admin/export${status ? `?status=${status}` : ''}`} 
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 bg-brand/10 text-brand rounded-xl text-sm font-black hover:bg-brand hover:text-white transition-all shrink-0 w-full md:w-auto justify-center active:scale-95"
            >
              <Download size={16} /> Exporter CSV
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50">Alumni</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50">Promotion</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50">Statut</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50">Action</th>
              </tr>
            </thead>
            <tbody>
              {alumni?.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-6 border-b border-zinc-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-200">
                        {member.avatar_url ? (
                          <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold">
                            {member.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 group-hover:text-brand transition-colors">{member.full_name}</div>
                        <div className="text-xs font-medium text-zinc-400">{member.email || 'Email non renseigné'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 border-b border-zinc-50">
                    <span className="px-3 py-1 bg-zinc-100 rounded-lg text-xs font-black text-zinc-600">
                      Promo {member.promo_year}
                    </span>
                  </td>
                  <td className="px-8 py-6 border-b border-zinc-50">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      member.status === 'En poste' ? 'bg-green-50 text-green-600' : 'bg-brand/5 text-brand'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'En poste' ? 'bg-green-600' : 'bg-brand animate-pulse'}`} />
                      {member.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 border-b border-zinc-50">
                    <div className="flex items-center gap-2">
                      <MemberActionsMenu
                        memberId={member.id}
                        memberName={member.full_name}
                        currentStatus={member.status || ''}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-8 border-t border-zinc-50 bg-zinc-50/30 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link 
                href={`/dashboard/admin?q=${q || ''}&page=${currentPage - 1}`}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-black transition-colors"
                title="Page précédente"
              >
                <ChevronLeft size={18} />
              </Link>
            )}
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i
                return (
                  <Link
                    key={p}
                    href={`/dashboard/admin?q=${q || ''}&page=${p}`}
                    className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                      p === currentPage 
                        ? 'bg-black text-white shadow-lg shadow-black/10' 
                        : 'bg-white border border-zinc-200 text-zinc-500 hover:border-black/20'
                    }`}
                  >
                    {p}
                  </Link>
                )
              })}
            </div>

            {currentPage < totalPages && (
              <Link 
                href={`/dashboard/admin?q=${q || ''}&page=${currentPage + 1}`}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-black transition-colors"
                title="Page suivante"
              >
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
