export function formatAlumniCsv(alumni: any[]): string {
  const headers = ['Nom Complet', 'Email', 'Année de Promotion', 'Spécialité', 'Ville', 'Pays', 'Téléphone', 'Statut Actuel']
  const csvRows = [headers.join(',')]

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

  // Prepend UTF-8 BOM for Excel compatibility
  return "\uFEFF" + csvRows.join('\n')
}
