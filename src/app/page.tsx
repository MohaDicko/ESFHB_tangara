import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Users, BarChart3, Globe, ShieldCheck, Zap, Briefcase, MapPin, Building2, Banknote, Sparkles, Activity, CheckCircle2 } from "lucide-react";
import LandingMobileMenu from "./LandingMobileMenu";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Background Glowing Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/10 h-16 md:h-20 flex items-center px-4 sm:px-8 lg:px-12 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="h-full w-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
              <img src="/logo.jpg" alt="ESFHB Logo" className="h-7 w-auto object-contain rounded-md" />
            </div>
          </div>
          <div>
            <div className="font-display font-black tracking-tighter text-base md:text-xl text-white uppercase leading-none">ESFHB</div>
            <div className="text-[9px] md:text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap">Alumni Tracker</div>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.15em] text-slate-300">
          <Link href="#features" className="hover:text-emerald-400 transition-colors">Savoir-faire</Link>
          <Link href="#stats" className="hover:text-emerald-400 transition-colors">Analytiques</Link>
          <Link href="#jobs" className="hover:text-emerald-400 transition-colors">Opportunités</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2.5">
            <Link href="/register" className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-bold text-slate-200 hover:bg-white/5 hover:border-white/30 transition-all uppercase tracking-wider">
              S&apos;inscrire
            </Link>
            <Link href="/login" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all">
              Connexion
            </Link>
          </div>
          
          {/* Compact Mobile Action Buttons */}
          <div className="sm:hidden flex items-center gap-1.5">
            <Link href="/register" className="px-2.5 py-1.5 border border-white/15 text-[10px] font-bold text-slate-200 rounded-lg whitespace-nowrap">
              S&apos;inscrire
            </Link>
            <Link href="/login" className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md shadow-emerald-500/30 whitespace-nowrap">
              Accès
            </Link>
          </div>
          
          <LandingMobileMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 sm:pt-28 md:pt-36 pb-20">
        
        {/* Hero Section */}
        <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Text Block */}
          <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border border-emerald-500/20 backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" />
              Plateforme Officielle ESFHB Mali
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] text-white">
              Le réseau des <br />
              <span className="gradient-text-emerald">professionnels de santé</span> de demain.
            </h1>
            
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              L&apos;application officielle dédiée au suivi de carrière, au maillage institutionnel et aux opportunités de l&apos;École de Santé Félix Houphouët-Boigny.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2.5 active:scale-95">
                Rejoindre le Réseau <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center">
                Espace Membre
              </Link>
            </div>

            {/* Quick Metrics Pills */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium">Diplômés Qualifiés</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">+1 200</div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium">Alumni Actifs</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-sky-400">92%</div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium">Taux d'Insertion</div>
              </div>
            </div>
          </div>

          {/* Right Floating Card Graphic */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] sm:aspect-square rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-emerald-950/30 overflow-hidden animate-float">
              
              {/* Glass Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Activity size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Suivi d'Insertion en Temps Réel</div>
                    <div className="text-[10px] text-slate-400">Gouvernance ESFHB</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  En Direct
                </span>
              </div>

              {/* Central Status List */}
              <div className="space-y-3 my-4">
                {[
                  { role: "Infirmier d'État - CHU Gabriel Touré", status: "En poste", color: "bg-emerald-500" },
                  { role: "Sage-Femme - Clinique Pasteur", status: "En poste", color: "bg-emerald-500" },
                  { role: "Technicien de Santé - NGO Health", status: "Entrepreneur", color: "bg-sky-500" }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-none">{item.role}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[10px] font-bold text-slate-300">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Données Vérifiées par l'Institution</span>
                </div>
                <span className="font-bold text-slate-300">2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto mt-28 sm:mt-36">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
              Une Plateforme Conçue pour l&apos;Excellence
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Des outils modernes pour dynamiser le suivi académique et l&apos;insertion professionnelle des diplômés.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <BarChart3 className="text-emerald-400" />, title: "Analytique Institutionnelle", desc: "Suivi statistique détaillé de l'employabilité par promotion et spécialité." },
              { icon: <ShieldCheck className="text-sky-400" />, title: "Sécurité & RLS Strict", desc: "Données personnelles scellées et protégées par Row Level Security." },
              { icon: <Globe className="text-teal-400" />, title: "Annuaire Centralisé", desc: "Recherche filtrée des professionnels de santé sur tout le territoire." }
            ].map((f, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Live Preview */}
        <section id="stats" className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto mt-28">
          <Suspense fallback={<div className="h-64 w-full bg-slate-900/50 rounded-3xl animate-pulse" />}>
            <DashboardPreview />
          </Suspense>
        </section>

        {/* Opportunities / Jobs Section */}
        <section id="jobs" className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase border border-sky-500/20 mb-3">
                <Briefcase size={12} />
                Opportunités Médicales
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white">
                Offres d&apos;Emploi & Stages
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Accédez aux postes publiés par les établissements de santé partenaires.
            </p>
          </div>

          <Suspense fallback={<div className="h-64 bg-slate-900/50 rounded-3xl animate-pulse" />}>
            <JobOffers />
          </Suspense>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-8 lg:px-12 bg-[#05080e]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              E
            </div>
            <div>
              <div className="font-bold text-white">École de Santé Félix Houphouët-Boigny</div>
              <div className="text-[10px] text-slate-500">© {new Date().getFullYear()} Tous droits réservés.</div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-emerald-400 transition-colors">Portail Membre</Link>
            <Link href="/register" className="hover:text-emerald-400 transition-colors">Inscription</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

async function DashboardPreview() {
  return (
    <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-10 relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Analytique & Suivi des Promotions</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Tableau de bord institutionnel permettant de mesurer l'insertion des diplômés par filières médicales et paramédicales.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-2xl font-black text-emerald-400">87.4%</div>
              <div className="text-xs text-slate-400">Insertion Professionnelle</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-2xl font-black text-sky-400">45+</div>
              <div className="text-xs text-slate-400">Centres Partenaires</div>
            </div>
          </div>
        </div>

        {/* Interactive Chart Visual */}
        <div className="h-48 sm:h-56 bg-slate-950/60 rounded-2xl border border-white/10 p-5 flex items-end gap-3">
          {[45, 75, 50, 95, 70, 85, 60].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div 
                style={{ height: `${height}%` }}
                className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md group-hover:brightness-125 transition-all"
              />
              <span className="text-[10px] font-bold text-slate-400">P{2019+i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function JobOffers() {
  const supabase = await createClient()
  const { data: jobs, error } = await supabase
    .from('job_offers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error || !jobs || jobs.length === 0) {
    return (
      <div className="p-8 sm:p-12 border border-white/10 bg-slate-900/50 backdrop-blur-xl rounded-2xl text-center">
        <Briefcase size={28} className="text-slate-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white mb-1">Aucune offre récente</h4>
        <p className="text-slate-400 text-xs">Les offres d'emploi transmises par les établissements partenaires s'afficheront ici.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div key={job.id} className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                {job.type || 'CDI'}
              </span>
              <span className="text-xs text-slate-400">{job.location || 'Bamako'}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{job.title}</h3>
            <div className="text-xs font-semibold text-slate-300 mb-2">{job.company}</div>
            <p className="text-slate-400 text-xs line-clamp-2">{job.description}</p>
          </div>

          <Link href="/dashboard/jobs" className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-white text-slate-200 text-xs font-bold text-center transition-all flex items-center justify-center gap-2">
            Consulter l'offre <ArrowRight size={14} />
          </Link>
        </div>
      ))}
    </div>
  )
}
