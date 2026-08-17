import { describe, it, expect } from 'vitest'
import { formatAlumniCsv } from '../../src/lib/csv-exporter'

describe('Unit Tests - CSV Exporter', () => {
  it('should generate CSV headers correctly with UTF-8 BOM', () => {
    const csv = formatAlumniCsv([])
    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain('Nom Complet,Email,Année de Promotion,Spécialité,Ville,Pays,Téléphone,Statut Actuel')
  })

  it('should correctly format alumni rows and escape quotes', () => {
    const mockData = [
      {
        full_name: 'Dr. Tangara "Senior"',
        email: 'tangara@example.com',
        promo_year: 2023,
        specialty: 'Infirmier d\'État',
        city: 'Bamako',
        country: 'Mali',
        phone: '+223 70000000',
        status: 'Public'
      }
    ]

    const csv = formatAlumniCsv(mockData)
    expect(csv).toContain('"Dr. Tangara ""Senior"""')
    expect(csv).toContain('"tangara@example.com"')
    expect(csv).toContain('"2023"')
    expect(csv).toContain('"Public"')
  })
})
