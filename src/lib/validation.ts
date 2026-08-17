import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().min(2, "Nom trop court").max(100),
  specialty: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  avatar_url: z.string().url().or(z.literal("")).optional(),
  status: z.enum(['Privé', 'Public', 'Sans emploi', 'Bénévolat', 'Entrepreneur', 'Étudiant']),
  is_email_public: z.boolean().default(false),
  is_contact_public: z.boolean().default(false)
})

export const experienceSchema = z.object({
  company_name: z.string().min(1, "Nom d'entreprise requis").max(100),
  job_title: z.string().min(1, "Intitulé du poste requis").max(100),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide").or(z.literal("")).optional(),
  is_current: z.boolean().default(false),
  sector: z.string().max(50).optional(),
  description: z.string().max(1000).optional()
}).refine(data => {
  if (!data.is_current && data.end_date && data.start_date) {
    return new Date(data.end_date) >= new Date(data.start_date)
  }
  return true
}, {
  message: "La date de fin ne peut pas être antérieure à la date de début",
  path: ["end_date"]
})
