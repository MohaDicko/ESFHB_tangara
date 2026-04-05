'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères")
})

const signupSchema = authSchema.extend({
  fullName: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  promoYear: z.string().regex(/^\d{4}$/, "Année de promotion invalide (ex: 2024)")
})

/**
 * Handle user login with email and password
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  const rawData = Object.fromEntries(formData.entries())
  const validation = authSchema.safeParse(rawData)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { email, password } = validation.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Handle user registration
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const rawData = Object.fromEntries(formData.entries())
  const validation = signupSchema.safeParse(rawData)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { email, password, fullName, promoYear } = validation.data

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        promo_year: parseInt(promoYear),
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  // We don't redirect to dashboard directly to avoid middleware kick-back if email confirmation is required
  return { success: "Inscription réussie ! Vérifiez vos emails pour confirmer votre compte." }
}

/**
 * Handle user logout
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
