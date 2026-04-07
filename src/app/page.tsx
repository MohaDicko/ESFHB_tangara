import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Users, BarChart3, Globe, ShieldCheck, Zap } from "lucide-react";
import LandingMobileMenu from "./LandingMobileMenu";


export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100/50 h-16 md:h-20 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-9 md:h-11">
             <img src="/logo.jpg" alt="ESFHB Logo" className="h-full w-auto object-contain" />
          </div>
          <div>
            <div className="font-display font-black tracking-tighter text-lg md:text-xl leading-none text-zinc-950 uppercase">ESFHB</div>
            <div className="text-[8px] md:text-[9px] font-black text-brand tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap">Portail des Alumni</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">
          <Link href="#features" className="hover:text-brand transition-colors">Savoir-faire</Link>
          <Link href="#stats" className="hover:text-brand transition-colors">Résultats</Link>
          <Link href="#impact" className="hover:text-brand transition-colors">Impact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LandingMobileMenu />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-24 md:pt-32 pb-20">
        <section className="px-6 md:px-12 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-50 text-zinc-500 text-[10px] font-black tracking-[0.25em] uppercase border border-zinc-100 mx-auto md:mx-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Excellence Médicale & Réseau
            </div>
            <h1 className="text-5xl md:text-[88px] font-display font-black tracking-tighter leading-[1] md:leading-[0.9] text-zinc-950">
              Le futur de la <br />
              <span className="text-brand underline decoration-emerald-100 decoration-4 md:decoration-8 underline-offset-8">santé</span> se connecte.
            </h1>
            <p className="text-lg md:text-2xl text-zinc-500 max-w-2xl font-medium leading-relaxed mx-auto md:mx-0">
              La plateforme officielle dédiée aux diplômés de l&apos;ESF F.H.B. Suivez votre carrière et restez connectés à l&apos;institution qui a formé votre expertise.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              <Link href="/register" className="w-full sm:w-auto bg-zinc-950 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-black/20 hover:scale-105 transition-all flex items-center justify-center gap-3 group active:scale-95">
                Rejoindre le Réseau <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-brand hover:bg-brand/5 transition-colors border-2 border-brand/10">
                Accès Portail
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full group">
             {/* Decorative abstract cards */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-50 rounded-[50px] border border-blue-100 rotate-12 shadow-2xl transition-transform group-hover:rotate-6 duration-700" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-zinc-50 rounded-[50px] border border-zinc-100 rotate-6 shadow-2xl transition-transform group-hover:rotate-3 duration-700" />
             
             <div className="relative w-full aspect-square bg-white rounded-[50px] border border-zinc-200 p-10 flex flex-col justify-between shadow-2xl transition-transform group-hover:scale-105 duration-700">
                <div className="space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-[22px] bg-zinc-950 flex items-center justify-center text-white">
                         <Users size={32} />
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black text-zinc-400 tracking-[0.2em]">LIVE TRACKING</div>
                         <div className="flex items-center gap-2 justify-end mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-lg font-black text-zinc-900">EN POSTE</span>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-zinc-100 rounded-full" />
                      <div className="h-4 w-1/2 bg-zinc-50 rounded-full" />
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-zinc-400 font-medium">Expériences</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs">+4</span>
                   </div>
                   <div className="grid grid-cols-4 gap-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-300">
                           <Globe size={18} />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 md:px-12 max-w-7xl mx-auto mt-40 grid md:grid-cols-3 gap-8">
           {[
             { icon: <BarChart3 className="text-blue-600" />, title: "Analytics Avancés", desc: "Tableaux de bord dynamiques pour un suivi en temps réel de vos anciens." },
             { icon: <ShieldCheck className="text-green-600" />, title: "Sécurité Maximale", desc: "Vos données sont protégées par les standards bancaires les plus rigoureux." },
             { icon: <Globe className="text-purple-600" />, title: "Réseau Mondial", desc: "Connectez-vous avec vos diplômés où qu'ils soient dans le monde." }
           ].map((f, i) => (
             <div key={i} className="p-8 rounded-[32px] bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">{f.desc}</p>
             </div>
           ))}
        </section>

        {/* Stats Section */}
        <section id="stats" className="px-6 md:px-12 max-w-7xl mx-auto mt-32">
           <Suspense fallback={<div className="h-[400px] w-full bg-zinc-50 rounded-[40px] animate-pulse" />}>
              <DashboardPreview />
           </Suspense>
        </section>
      </main>

      <footer className="py-24 border-t border-zinc-100 px-6 md:px-12 bg-white relative overflow-hidden">
        {/* Subtle deco */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-24 relative z-10">
           <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-brand rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand/20">
                   <Zap size={26} fill="white" />
                </div>
                <div>
                   <div className="font-display font-black tracking-tighter text-2xl leading-none text-zinc-900">ESFHB</div>
                   <div className="text-[10px] font-black text-brand tracking-[0.2em] uppercase mt-1">Félix Houphouët Boigny</div>
                </div>
              </div>
              <p className="text-zinc-600 max-w-sm font-medium leading-relaxed">
                 L&apos;institution de référence pour la formation des professionnels de santé d&apos;excellence. Un réseau uni pour le futur de la médecine.
              </p>
           </div>
           <div>
              <h4 className="text-xs font-black text-zinc-400 tracking-[0.2em] uppercase mb-8">Plateforme</h4>
              <ul className="space-y-4 text-zinc-600 text-sm font-bold">
                 <li><Link href="#features" className="hover:text-brand transition-colors">Savoir-faire</Link></li>
                 <li><Link href="#stats" className="hover:text-brand transition-colors">Analytiques</Link></li>
                 <li><Link href="/register" className="text-brand">Rejoindre</Link></li>
              </ul>
           </div>
           <div>
              <h4 className="text-xs font-black text-zinc-400 tracking-[0.2em] uppercase mb-8">L&apos;institution</h4>
              <ul className="space-y-4 text-zinc-600 text-sm font-bold">
                 <li><Link href="#" className="hover:text-brand transition-colors">L&apos;école</Link></li>
                 <li><Link href="#" className="hover:text-brand transition-colors">Actualités</Link></li>
                 <li><Link href="#" className="hover:text-brand transition-colors">Contact</Link></li>
              </ul>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-zinc-100 pt-10 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
           <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              <span>© {new Date().getFullYear()} École de Santé F.H.B.</span>
              <span className="hidden md:block text-zinc-200">|</span>
              <Link href="https://sahelmultiservice.com" target="_blank" className="flex items-center gap-2 group">
                 Propulsé par 
                 <span className="text-zinc-900 font-black group-hover:text-brand transition-colors">Sahel Multiservice</span>
                 <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           <div className="flex gap-8 mt-8 md:mt-0">
             <Link href="#" className="hover:text-black transition-colors">Conditions</Link>
             <Link href="#" className="hover:text-black transition-colors">Confidentialité</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}

async function DashboardPreview() {
  // Simulating small data fetch or static content
  return (
    <div className="bg-zinc-950 text-white rounded-[40px] p-12 overflow-hidden relative">
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Analytique de pointe</h2>
          <p className="text-zinc-400 text-lg mb-8">
            Visualisez instantanément le taux d'emploi, les secteurs d'activité et la répartition géographique de vos diplômés.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-4xl font-bold">87%</div>
              <div className="text-sm text-zinc-500">Taux d'insertion rapide</div>
            </div>
            <div>
              <div className="text-4xl font-bold">420</div>
              <div className="text-sm text-zinc-500">Entreprises partenaires</div>
            </div>
          </div>
        </div>
        <div className="h-64 bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 flex items-end gap-2">
           {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
             <div 
               key={i} 
               style={{ height: `${h}%` }} 
               className="flex-1 bg-blue-500/20 rounded-t-lg hover:bg-blue-500 transition-all cursor-pointer group relative"
             >
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Promo {2018+i}
               </div>
             </div>
           ))}
        </div>
      </div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20" />
    </div>
  )
}
