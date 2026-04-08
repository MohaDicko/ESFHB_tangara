'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const jobSchema = z.object({
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères"),
  company: z.string().min(2, "Le nom de l'entreprise est requis"),
  location: z.string().optional(),
  contact_email: z.string().email("L'adresse email de contact est invalide"),
  target_specialty: z.string().optional(),
  salary_range: z.string().optional(),
  description: z.string().min(10, "La description est trop courte"),
  type: z.enum(['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance']),
})

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return data?.role === 'admin'
}

export async function createJobOffer(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !(await assertAdmin(supabase, user.id))) {
    return { error: 'Accès refusé' }
  }

  const rawData = Object.fromEntries(formData.entries())
  const validation = jobSchema.safeParse(rawData)

  if (!validation.success) {
    return { error: "Données invalides : " + validation.error.issues[0].message }
  }

  const { error } = await supabase.from('job_offers').insert({
    ...validation.data,
    author_id: user.id
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/jobs')
  revalidatePath('/')
  return { success: 'Offre d\'emploi publiée avec succès !' }
}

export async function deleteJobOffer(jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !(await assertAdmin(supabase, user.id))) {
    return { error: 'Accès refusé' }
  }

  const { error } = await supabase.from('job_offers').delete().eq('id', jobId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/jobs')
  revalidatePath('/')
  return { success: 'Offre supprimée.' }
}
