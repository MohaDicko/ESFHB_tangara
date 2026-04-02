'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe min. 6 caractères"),
  fullName: z.string().min(2, "Nom trop court"),
  promoYear: z.string().regex(/^\d{4}$/, "Année de promotion invalide")
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

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

export async function signup(formData: FormData) {
  const supabase = await createClient()

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
  redirect('/dashboard?message=Vérifiez vos emails pour confirmer votre compte')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
