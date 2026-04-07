'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Security: Define strict schemas for input validation
const profileSchema = z.object({
  full_name: z.string().min(2, "Nom trop court").max(100),
  specialty: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  avatar_url: z.string().url().or(z.literal("")).optional(),
  status: z.enum(['En poste', 'En recherche', 'Entrepreneur', 'Étudiant']),
  is_email_public: z.boolean().default(false),
  is_contact_public: z.boolean().default(false)
})

const experienceSchema = z.object({
  company_name: z.string().min(1, "Nom d'entreprise requis").max(100),
  job_title: z.string().min(1, "Intitulé du poste requis").max(100),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide").or(z.literal("")).optional(),
  is_current: z.boolean().default(false),
  sector: z.string().max(50).optional(),
  description: z.string().max(1000).optional()
})

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Security: Parse and validate data
  const rawData = {
    ...Object.fromEntries(formData.entries()),
    is_email_public: formData.get('is_email_public') === 'on',
    is_contact_public: formData.get('is_contact_public') === 'on',
  }
  const validation = profileSchema.safeParse(rawData)

  if (!validation.success) {
    return { error: "Données invalides : " + validation.error.issues[0].message }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/profile')
  return { success: 'Profil mis à jour avec succès !' }
}

export async function addExperience(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Security: Parse and validate data
  const isCurrent = formData.get('is_current') === 'on'
  const rawData = {
    ...Object.fromEntries(formData.entries()),
    is_current: isCurrent
  }
  
  const validation = experienceSchema.safeParse(rawData)

  if (!validation.success) {
    return { error: "Données invalides : " + validation.error.issues[0].message }
  }

  const { error } = await supabase
    .from('experiences')
    .insert({
      ...validation.data,
      profile_id: user.id,
      end_date: validation.data.is_current ? null : validation.data.end_date || null,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/experiences')
  revalidatePath('/dashboard')
  return { success: 'Expérience ajoutée !' }
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id) // Security check

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/experiences')
  return { success: 'Expérience supprimée' }
}

// ─── Actions Admin ────────────────────────────────────────────────────────────

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return data?.role === 'admin'
}

export async function adminDeleteMember(memberId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }
  if (!(await assertAdmin(supabase, user.id))) return { error: 'Accès refusé' }
  if (memberId === user.id) return { error: 'Impossible de se supprimer soi-même' }

  // La suppression dans auth.users cascade sur profiles et experiences (via FK ON DELETE CASCADE)
  const { error } = await supabase.rpc('admin_delete_user', { target_user_id: memberId })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin')
  return { success: 'Membre supprimé avec succès.' }
}

export async function adminToggleBlock(memberId: string, currentStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }
  if (!(await assertAdmin(supabase, user.id))) return { error: 'Accès refusé' }
  if (memberId === user.id) return { error: 'Impossible de se bloquer soi-même' }

  const newStatus = currentStatus === 'Bloqué' ? 'En recherche' : 'Bloqué'

  const { error } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', memberId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin')
  return { success: newStatus === 'Bloqué' ? 'Membre bloqué.' : 'Membre débloqué.' }
}

