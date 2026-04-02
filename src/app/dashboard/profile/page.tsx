import { createClient } from '@/lib/supabase/server'
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Camera
} from 'lucide-react'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-20">
       {/* UI Header - Still Server rendered for instant visibility */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-zinc-200">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-100 rounded-[40px] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden">
                   {profile?.avatar_url ? (
                     <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                   ) : (
                     <User size={64} className="text-zinc-300" />
                   )}
                </div>
                <button className="absolute bottom-2 right-2 p-3 bg-black text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                   <Camera size={18} />
                </button>
             </div>
             <div className="text-center md:text-left space-y-2">
                <h1 className="text-4xl font-black tracking-tight">{profile?.full_name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-500 font-bold text-sm">
                   <span className="flex items-center gap-1.5 font-bold"><GraduationCap size={16} /> Promo {profile?.promo_year}</span>
                   <span className="flex items-center gap-1.5 font-bold"><MapPin size={16} /> {profile?.city || 'Localisation...'}</span>
                </div>
             </div>
          </div>
       </div>

       {/* Interactive Form - Client Side functionality */}
       <ProfileForm profile={profile} />
    </div>
  )
}
