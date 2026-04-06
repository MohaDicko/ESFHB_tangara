import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://esfhb-alumni.vercel.app'

  // Static routes
  const staticRoutes = [
    '',
    '/login',
    '/dashboard',
    '/dashboard/directory',
    '/dashboard/profile',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // Dynamic alumni profile routes
  const { data: alumni } = await supabase
    .from('profiles')
    .select('id, updated_at')

  const alumniRoutes = (alumni || []).map((person) => ({
    url: `${baseUrl}/dashboard/directory/${person.id}`,
    lastModified: new Date(person.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...alumniRoutes]
}
