// Génération de 300 alumni réalistes pour l'ESFHB (Démo Client)
// node scripts/seed-demo.mjs

import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = new Client({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false }
})

// ─── Données réalistes Maliennes ──────────────────────────────────────────────
const prenomsH = ['Moussa','Bakary','Oumar','Sekou','Ibrahim','Mamadou','Abdoulaye','Amadou','Boubacar','Cheick','Drissa','Fousseyni','Hamidou','Issiaka','Karim','Lassana','Modibo','Nanan','Ousmane','Pathé','Salif','Tidiane','Adama','Brehima','Souleymane','Yacouba','Lamine','Tiémoko','Seydou','Mahamadou']
const prenomsF = ['Fatoumata','Mariam','Aminata','Awa','Djeneba','Kadiatou','Rokiatou','Sitan','Tenin','Yah','Aissata','Bintou','Coumba','Fanta','Gnagna','Hawa','Kadija','Lalla','Mama','Nana','Oumou','Penda','Ramata','Salimata','Tene','Yacine','Zeinab','Adja','Binta','Assétou']
const noms = ['Coulibaly','Traoré','Diallo','Sidibé','Keïta','Sangaré','Touré','Koné','Cissé','Dembélé','Doumbia','Fofana','Goïta','Haïdara','Kanté','Maïga','Ndiaye','Ongoïba','Sissoko','Ouédraogo','Diarra','Bagayoko','Ballo','Camara','Daou','Diabaté','Guindo','Togola','Sacko','Sow']

const specialites = [
  'Infirmier d\'Etat','Sage-Femme','Biologie Médicale','Odontostomatologie',
  'Auxiliaire de Santé','Technicien de Santé','Kinésithérapie','Laboratoire Médical',
  'Radiologie','Pharmacie','Santé Publique','Nutrition','Épidémiologie'
]

const statuts = ['En poste','En poste','En poste','En poste','Entrepreneur','Entrepreneur','En recherche','En recherche', 'Étudiant']
const villes = ['Bamako','Ségou','Mopti','Sikasso','Koutiala','Gao','Tombouctou','Kayes','Kidal','San','Niono','Bougouni','Koulikoro','Kati']
const entreprises = ['CHU Gabriel Touré','Hôpital du Point G','Hôpital du Mali','CSREF Commune I','CSREF Commune IV','Clinique Pasteur','Clinique Farako','Polyclinique de Bamako','MSF Mali','OMS Mali','UNICEF Mali','Pharmacie Populaire','Laboratoire Diarra','Institut National de Santé Publique']
const postes = ['Infirmier Chef','Sage-Femme','Technicien Labo','Médecin','Pharmacien','Kinésithérapeute','Chargé de Santé','Coordinateur Médical','Superviseur']

const bios = [
  'Passionné(e) par la santé communautaire et la prévention.',
  'Engagé(e) dans l\'amélioration des soins primaires.',
  'Spécialiste des soins urgents et hospitaliers.',
  'Expérimenté(e) dans la prise en charge maternelle et infantile.',
  'Dédié(e) à la lutte contre les maladies endémiques au Mali.',
  'Professionnel(le) rigoureux(se) avec une forte éthique médicale.'
]

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randBool(prob = 0.5) { return Math.random() < prob }

async function seed() {
  await client.connect()
  console.log('🚀 Démarrage du seed pour la démo client...')

  // Désactiver temporairement la contrainte FK pour insérer des profils sans auth.users
  await client.query('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey')

  let count = 0
  for (let i = 0; i < 300; i++) {
    const isFemale = randBool(0.5)
    const prenom = isFemale ? rand(prenomsF) : rand(prenomsH)
    const nom = rand(noms)
    const fullName = `${prenom} ${nom}`
    const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}${randInt(10,999)}@example.com`
    const phone = `+223 ${rand(['6','7','9'])}${randInt(0,9)} ${randInt(10,99)} ${randInt(10,99)} ${randInt(10,99)}`
    const promoYear = randInt(2015, 2024)
    const specialty = rand(specialites)
    const status = rand(statuts)
    const bio = rand(bios).replace('(e)', isFemale ? 'e' : '').replace('(se)', isFemale ? 'se' : '').replace('(le)', isFemale ? 'le' : '')

    try {
      const res = await client.query(`
        INSERT INTO profiles (
          id, full_name, email, phone, promo_year, specialty, status,
          city, country, bio, is_email_public, is_contact_public, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'Mali', $8, $9, $10, 
          NOW() - (random() * interval '365 days'), NOW()
        ) RETURNING id
      `, [fullName, email, phone, promoYear, specialty, status, rand(villes), bio, randBool(0.7), randBool(0.5)])

      const profileId = res.rows[0].id

      // Ajouter 1-2 expériences pour certains
      if (randBool(0.7)) {
        const numExp = randInt(1, 2)
        for (let j = 0; j < numExp; j++) {
          const isCurrent = j === 0
          await client.query(`
            INSERT INTO experiences (
              id, profile_id, company_name, job_title, start_date, end_date, is_current, sector, description
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8
            )
          `, [
            profileId, rand(entreprises), rand(postes), 
            `${randInt(2010, 2022)}-01-01`, 
            isCurrent ? null : `${randInt(2023, 2024)}-01-01`, 
            isCurrent, rand(['Santé','Public','Privé','ONG']), 'Expérience professionnelle au sein d\'une structure de santé Malienne.'
          ])
        }
      }
      count++
      if (count % 50 === 0) console.log(`✅ ${count} diplômés insérés...`)
    } catch (e) {
      console.error('❌ Erreur insertion:', e.message)
    }
  }

  console.log(`\n✨ Succès ! 300 diplômés ajoutés pour la démo.`)
  await client.end()
}

seed().catch(console.error)
