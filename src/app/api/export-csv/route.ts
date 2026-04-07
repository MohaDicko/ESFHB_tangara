import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Check auth and role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
    
  if (roleData?.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return new NextResponse('Error fetching data', { status: 500 })
  }

  // Generate CSV
  const headers = ['Nom Complet', 'Promotion', 'Specialite', 'Telephone', 'Ville', 'Pays', 'Statut', 'Date Inscription']
  
  const csvRows = []
  csvRows.push(headers.join(','))
  
  for (const profile of profiles || []) {
    const row = [
      `"${(profile.full_name || '').replace(/"/g, '""')}"`,
      `"${profile.promo_year || ''}"`,
      `"${(profile.specialty || '').replace(/"/g, '""')}"`,
      `"${(profile.phone || '').replace(/"/g, '""')}"`,
      `"${(profile.city || '').replace(/"/g, '""')}"`,
      `"${(profile.country || '').replace(/"/g, '""')}"`,
      `"${(profile.status || '').replace(/"/g, '""')}"`,
      `"${new Date(profile.created_at).toLocaleDateString()}"`
    ]
    csvRows.push(row.join(','))
  }
  
  const csvContent = "\uFEFF" + csvRows.join('\n') // BOM for Excel

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="alumni_esfhb.csv"',
    },
  })
}
