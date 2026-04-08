'use client'

import { useState } from 'react'
import { Camera, Loader2, Save, CheckCircle2, AlertCircle, User, MapPin, Phone, GraduationCap } from 'lucide-react'
import { updateProfile } from '../actions'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      // Chemin plat sans sous-dossier — évite les problèmes RLS de dossier
      const fileName = `avatar_${profile.id}_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setAvatarUrl(publicUrl)
      
      // Mettre à jour en base avec les champs requis
      const formData = new FormData()
      formData.append('avatar_url', publicUrl)
      formData.append('full_name', profile?.full_name || 'Alumni')
      formData.append('status', profile?.status || 'En recherche')
      if (profile?.is_email_public) formData.append('is_email_public', 'on')
      if (profile?.is_contact_public) formData.append('is_contact_public', 'on')
      await updateProfile(formData)
      
      setMessage({ type: 'success', text: 'Photo de profil mise à jour !' })
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Echec de l\'upload : ' + error.message })
    } finally {
      setUploading(false)
    }
  }

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
                       defaultValue={profile?.status || 'Sans emploi'}
                       className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black appearance-none transition-all"
                     >
                        <option value="Privé">🏢 Secteur Privé</option>
                        <option value="Public">🏛️ Secteur Public</option>
                        <option value="Sans emploi">🔍 Sans emploi</option>
                        <option value="Bénévolat">🤝 Bénévolat</option>
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

             <section className="p-8 bg-zinc-50 border border-zinc-200 rounded-[32px] space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                      <h4 className="font-bold text-zinc-900">Visibilité des Coordonnées</h4>
                      <p className="text-xs text-zinc-500 font-medium">Choisissez ce que vous partagez avec le réseau.</p>
                   </div>
                </div>
                <div className="space-y-4 pt-4">
                   <PrivacyToggle 
                      label="Afficher mon adresse email" 
                      name="is_email_public" 
                      defaultChecked={profile?.is_email_public} 
                   />
                   <PrivacyToggle 
                      label="Afficher mon numéro de téléphone" 
                      name="is_contact_public" 
                      defaultChecked={profile?.is_contact_public} 
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
              {/* Photo de Profil */}
              <div className="p-8 bg-white border border-zinc-100 rounded-[40px] shadow-sm text-center">
                 <div className="relative w-32 h-32 mx-auto mb-6 group">
                    <div className="w-full h-full rounded-full overflow-hidden bg-zinc-100 border-4 border-white shadow-xl">
                       {avatarUrl ? (
                         <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            <User size={48} />
                         </div>
                       )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all">
                       {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                       <input 
                         type="file" 
                         className="hidden" 
                         accept="image/*" 
                         onChange={handleAvatarUpload}
                         disabled={uploading} 
                       />
                    </label>
                 </div>
                 <h4 className="font-bold text-zinc-900">Photo de Profil</h4>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Cliquez pour changer</p>
              </div>

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

function PrivacyToggle({ label, name, defaultChecked }: { label: string, name: string, defaultChecked: boolean }) {
  return (
    <label className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl cursor-pointer hover:border-blue-200 transition-colors">
       <span className="text-sm font-bold text-zinc-700">{label}</span>
       <input 
         type="checkbox" 
         name={name} 
         defaultChecked={defaultChecked}
         className="w-5 h-5 rounded-md border-zinc-300 text-blue-600 focus:ring-blue-500" 
       />
    </label>
  )
}
