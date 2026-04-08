import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Check Admin Role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const q = searchParams.get('q')
  const promo = searchParams.get('promo')
  const specialty = searchParams.get('specialty')

  let query = supabase
    .from('profiles')
    .select('full_name, email, promo_year, specialty, city, country, phone, status')
    .order('created_at', { ascending: false })

  if (q && q.trim()) {
    query = query.ilike('full_name', `%${q.trim()}%`)
  }
  if (status && status !== '') {
    query = query.eq('status', status)
  }
  if (promo && promo !== '') {
    query = query.eq('promo_year', parseInt(promo, 10))
  }
  if (specialty && specialty !== '') {
    query = query.eq('specialty', specialty)
  }

  const { data: alumni, error } = await query

  if (error) {
    return new NextResponse('Database Error', { status: 500 })
  }

  // Generate CSV
  const headers = ['Nom Complet', 'Email', 'Année de Promotion', 'Spécialité', 'Ville', 'Pays', 'Téléphone', 'Statut Actuel']
  const csvRows = []
  
  // Add Header
  csvRows.push(headers.join(','))

  // Add Data
  for (const person of alumni || []) {
    const row = [
      `"${(person.full_name || '').replace(/"/g, '""')}"`,
      `"${(person.email || '').replace(/"/g, '""')}"`,
      `"${(person.promo_year || '')}"`,
      `"${(person.specialty || '').replace(/"/g, '""')}"`,
      `"${(person.city || '').replace(/"/g, '""')}"`,
      `"${(person.country || '').replace(/"/g, '""')}"`,
      `"${(person.phone || '').replace(/"/g, '""')}"`,
      `"${(person.status || '').replace(/"/g, '""')}"`
    ]
    csvRows.push(row.join(','))
  }

  // Add UTF-8 BOM so Excel opens it with the correct encoding immediately
  const csvContent = "\uFEFF" + csvRows.join('\n')

  const paramsStr = Array.from(searchParams.values()).filter(Boolean).join('_')
  const filename = `esfhb_alumni${paramsStr ? `_${paramsStr.toLowerCase().replace(/\s+/g, '_')}` : '_complet'}.csv`

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  })
}
