import { describe, it, expect } from 'vitest'
import { profileSchema, experienceSchema } from '../../src/lib/validation'

describe('Unit Tests - Validation Schemas', () => {
  describe('profileSchema', () => {
    it('should validate a valid alumni profile', () => {
      const input = {
        full_name: 'Souleymane Tangara',
        status: 'Privé',
        city: 'Bamako',
        country: 'Mali',
        is_email_public: true,
        is_contact_public: false
      }
      const result = profileSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should fail when full_name is too short', () => {
      const input = {
        full_name: 'A',
        status: 'Privé'
      }
      const result = profileSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should fail when status is invalid', () => {
      const input = {
        full_name: 'Dr. Keita',
        status: 'StatutInconnu'
      }
      const result = profileSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  describe('experienceSchema', () => {
    it('should validate a valid current professional experience', () => {
      const input = {
        company_name: 'Hôpital Gabriel Touré',
        job_title: 'Médecin Généraliste',
        start_date: '2022-01-15',
        is_current: true,
        sector: 'Santé'
      }
      const result = experienceSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should fail when end_date is before start_date', () => {
      const input = {
        company_name: 'Clinique Pasteur',
        job_title: 'Infirmier',
        start_date: '2023-05-01',
        end_date: '2022-01-01',
        is_current: false
      }
      const result = experienceSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('antérieure')
      }
    })
  })
})
