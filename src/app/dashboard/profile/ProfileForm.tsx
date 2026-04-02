'use client'

import { useState } from 'react'
import { 
  User, 
  MapPin, 
  Phone, 
  GraduationCap, 
  Save, 
  CheckCircle2, 
  Camera, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { updateProfile } from '../actions'

export default function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const result = await updateProfile(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: result.success || 'Mise à jour réussie !' })
    }
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
       {/* Feedback */}
       {message && (
         <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border ${
           message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
         } animate-bounce-short`}>
           {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
           {message.text}
         </div>
       )}

       {/* Form Section 1 */}
       <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
             <section className="space-y-6">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                   <User size={20} className="text-zinc-400" /> Informations Générales
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                   <ProfileField 
                     label="Nom Complet" 
                     name="full_name" 
                     defaultValue={profile?.full_name} 
                   />
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Statut Actuel</label>
                     <select 
                       name="status"
                       defaultValue={profile?.status || 'En recherche'}
                       className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black appearance-none transition-all"
                     >
                        <option value="En poste">💼 En poste</option>
                        <option value="En recherche">🔍 En recherche</option>
                        <option value="Entrepreneur">🚀 Entrepreneur</option>
                        <option value="Étudiant">🎓 Étudiant</option>
                     </select>
                   </div>
                   <ProfileField 
                     label="Spécialité" 
                     name="specialty" 
                     placeholder="Ex: Informatique, Gestion..." 
                     defaultValue={profile?.specialty} 
                   />
                   <ProfileField 
                     label="Téléphone" 
                     name="phone" 
                     placeholder="+223 00 00 00 00"
                     defaultValue={profile?.phone} 
                   />
                   <ProfileField 
                     label="Ville" 
                     name="city" 
                     placeholder="Bamako"
                     defaultValue={profile?.city} 
                   />
                   <ProfileField 
                     label="Pays" 
                     name="country" 
                     placeholder="Mali"
                     defaultValue={profile?.country} 
                   />
                </div>
             </section>

             <section className="space-y-6">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-zinc-400" /> Bio & Résumé
                </h3>
                <textarea 
                  name="bio"
                  className="w-full p-6 bg-zinc-50 border border-zinc-200 rounded-3xl min-h-[200px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="Parlez-nous de votre parcours..."
                  defaultValue={profile?.bio || ''}
                />
             </section>
          </div>

          <div className="space-y-8">
             <div className="p-8 bg-zinc-900 rounded-[32px] text-white">
                <h4 className="font-bold mb-4 flex items-center gap-2"><GraduationCap size={18} /> Rappel Institution</h4>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                   Votre année de promotion ({profile?.promo_year}) est renseignée lors de l'inscription et ne peut être modifiée que par l'administration.
                </p>
             </div>
             
             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-black text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-xl shadow-black/10 active:scale-95"
             >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer les modifications</>}
             </button>
          </div>
       </div>
    </form>
  )
}

function ProfileField({ label, name, defaultValue, placeholder }: any) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
       <input 
         name={name}
         defaultValue={defaultValue}
         placeholder={placeholder}
         className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
       />
    </div>
  )
}
