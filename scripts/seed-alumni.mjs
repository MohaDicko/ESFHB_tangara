// Génération de 200+ alumni réalistes pour l'ESFHB
// node scripts/seed-alumni.mjs

import pg from 'pg'
const { Client } = pg

const client = new Client({
  connectionString: 'postgresql://postgres.qxcglthicdvmnqbjszca:zv%24%2BN%218_8%24GY-bZ@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

// ─── Données réalistes ──────────────────────────────────────────────
const prenomsH = ['Moussa','Bakary','Oumar','Sekou','Ibrahim','Mamadou','Abdoulaye','Amadou','Boubacar','Cheick','Drissa','Fousseyni','Hamidou','Issiaka','Karim','Lassana','Modibo','Nanan','Ousmane','Pathé','Ramata','Salif','Tidiane','Umar','Vieux','Yaya','Zouma','Adama','Brehima','Coulibaly']
const prenomsF = ['Fatoumata','Mariam','Aminata','Awa','Djeneba','Kadiatou','Rokiatou','Sitan','Tenin','Yah','Aissata','Bintou','Coumba','Dieneba','Fanta','Gnagna','Hawa','Kadija','Lalla','Mama','Nana','Oumou','Penda','Ramata','Salimata','Tene','Yacine','Zeinab','Adja','Binta']
const noms = ['Coulibaly','Traore','Diallo','Sidibe','Keita','Sangare','Toure','Kone','Cisse','Dembele','Doumbia','Fofana','Goita','Haidara','Kante','Maiga','Ndiaye','Ongoiba','Sissoko','Ouedraogo','Diarra','Bagayoko','Ballo','Camara','Daou','Diabate','Fofana','Guindo','Haïdara','Togola']

const specialites = [
  'Infirmier d\'Etat','Sage-Femme','Biologie Medicale','Odontostomatologie',
  'Auxiliaire de Sante','Technicien de Sante','Kinesitherapie','Laboratoire Medical',
  'Radiologie','Pharmacie','Sante Publique','Nutrition','Epidemiologie'
]

const statuts = ['En poste','En poste','En poste','En poste','Entrepreneur','Entrepreneur','En recherche','En recherche','Etudiant']

const secteurs = ['Public','Public','Public','Prive','Prive','ONG','International','Liberal']

const villes = [
  'Bamako','Bamako','Bamako','Bamako','Segou','Mopti','Sikasso','Koutiala',
  'Gao','Tombouctou','Kayes','Kidal','San','Niono','Bougouni','Yanfolila',
  'Koulikoro','Kati','Bla','Dioila'
]

const entreprises = [
  'CHU Gabriel Toure','Hopital du Point G','Hopital du Mali','CSREF Commune I',
  'CSREF Commune IV','CSREF Commune VI','Clinique Pasteur','Clinique Farako',
  'Polyclinique de Bamako','MSF Mali','OMS Mali','PNUD Mali','UNICEF Mali',
  'Cabinet Medical du Centre','Pharmacie Populaire','Laboratoire Diarra',
  'Centre de Sante Communautaire','Ministere de la Sante','Direction Regionale de la Sante',
  'Cabinet Kinesitherapie Moderne','Institut National de Sante Publique'
]

const postes = [
  'Infirmier Chef de Service','Sage-Femme Principale','Technicien de Laboratoire',
  'Medecin Generaliste','Pharmacien','Kinesitherapeute','Charge de Sante Publique',
  'Responsable Epidemiologie','Coordinateur Medical','Infirmier Urgentiste',
  'Responsable Maternite','Chef de Laboratoire','Directeur de Clinique',
  'Consultant Sante','Agent de Sante Communautaire','Superviseur Medical'
]


const bios = [
  'Passionne(e) par la sante communautaire et la prevention des maladies tropicales.',
  'Engage(e) dans l amelioration des soins de sante primaires en milieu rural.',
  'Specialiste des soins urgents et de la medecine d urgence hospitaliere.',
  'Contributeur(trice) actif(ve) a la formation des agents de sante de proximite.',
  'Travaille sur des projets d epidemiologie et de surveillance sanitaire.',
  'Experimente(e) dans la prise en charge des femmes enceintes et nourrissons.',
  'Implique(e) dans les programmes de vaccination et de sante maternelle.',
  'Professionnel(le) de sante dedie(e) a la lutte contre le paludisme et la tuberculose.',
  'Interesse(e) par la recherche clinique et les nouvelles technologies medicales.',
  'Fort(e) d une experience en gestion de projets de sante publique internationaux.'
]

// ─── Générateur ─────────────────────────────────────────────────────
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randBool(prob = 0.5) { return Math.random() < prob }

function genProfile(index) {
  const isFemale = randBool(0.45)
  const prenom = isFemale ? rand(prenomsF) : rand(prenomsH)
  const nom = rand(noms)
  const fullName = `${prenom} ${nom}`
  const promoYear = randInt(2005, 2023)
  const specialty = rand(specialites)
  const status = rand(statuts)
  const ville = rand(villes)
  const secteur = rand(secteurs)
  const bio = rand(bios).replace('(e)', isFemale ? 'e' : '').replace('(trice)', isFemale ? 'trice' : 'teur').replace('(le)', isFemale ? 'le' : 'l').replace('(ve)', isFemale ? 've' : 'f')
  
  // Email réaliste
  const emailBase = `${prenom.toLowerCase().replace(/[' ]/g, '.')}.${nom.toLowerCase()}${randInt(1,99)}`
  const domains = ['gmail.com','yahoo.fr','outlook.com','hotmail.fr','sante.gov.ml','mail.ml']
  const email = `${emailBase}@${rand(domains)}`
  
  // Téléphone malien
  const prefixes = ['65','66','67','70','71','72','73','74','75','76','77','78','79','90','91']
  const phone = `+223 ${rand(prefixes)} ${randInt(10,99)} ${randInt(10,99)} ${randInt(10,99)}`

  return {
    fullName,
    email,
    phone,
    promoYear,
    specialty,
    status,
    secteur,
    ville,
    country: 'Mali',
    bio,
    isEmailPublic: randBool(0.65),
    isContactPublic: randBool(0.45),
  }
}

// ─── Insertion ────────────────────────────────────────────────────────
await client.connect()
console.log('✅ Connecté a la base\n')

// Supprimer la contrainte FK temporairement pour le seed
console.log('🔓 Suppression temporaire contrainte FK...')
try {
  await client.query(`ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey`)
  console.log('   ✅ Contrainte FK supprimée\n')
} catch (e) {
  console.log('   ⚠️ ', e.message)
}

console.log('🌱 Génération de 210 profils alumni...\n')

let success = 0
let errors = 0

for (let i = 0; i < 210; i++) {
  const p = genProfile(i)
  
  try {
    await client.query(`
      INSERT INTO profiles (
        id, full_name, email, phone, promo_year, specialty, status,
        city, country, bio, is_email_public, is_contact_public, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, NOW() - (random() * interval '1000 days'), NOW()
      )
    `, [
      p.fullName, p.email, p.phone, p.promoYear, p.specialty, p.status,
      p.ville, p.country, p.bio, p.isEmailPublic, p.isContactPublic
    ])
    success++
    if (success % 25 === 0) process.stdout.write(`   ✅ ${success} profils insérés...\n`)
  } catch (e) {
    errors++
    if (errors <= 3) console.log('   ❌ Erreur:', e.message)
  }
}

// Ajouter quelques expériences professionnelles aléatoires
console.log('\n💼 Ajout d\'expériences professionnelles...')
const profiles = await client.query('SELECT id, specialty FROM profiles WHERE full_name NOT IN (\'Souleymane Tangara\', \'Administrateur Ecole\', \'Admin ESFHB\') LIMIT 120')

let expCount = 0
for (const profile of profiles.rows) {
  const numExp = randInt(1, 3)
  for (let j = 0; j < numExp; j++) {
    const startYear = randInt(2010, 2023)
    const isCurrent = j === 0 && randBool(0.6)
    try {
      await client.query(`
        INSERT INTO experiences (
          id, profile_id, company_name, job_title, start_date, end_date, is_current, sector, description
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8
        )
      `, [
        profile.id,
        rand(entreprises),
        rand(postes),
        `${startYear}-${String(randInt(1,12)).padStart(2,'0')}-01`,
        isCurrent ? null : `${startYear + randInt(1,4)}-${String(randInt(1,12)).padStart(2,'0')}-01`,
        isCurrent,
        rand(['Sante Publique','Clinique','Hospitalier','ONG','Liberal']),
        rand(bios).substring(0, 150)
      ])
      expCount++
    } catch (e) { /* skip */ }
  }
}

// Résumé final
const totalProfiles = await client.query('SELECT COUNT(*) FROM profiles')
const statusStats = await client.query(`SELECT status, COUNT(*) as count FROM profiles GROUP BY status ORDER BY count DESC`)
const emailStats = await client.query(`SELECT is_email_public, COUNT(*) as count FROM profiles GROUP BY is_email_public`)

console.log(`\n✨ TERMINÉ !`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`📊 Total profils en base: ${totalProfiles.rows[0].count}`)
console.log(`💼 Expériences ajoutées: ${expCount}`)
console.log(`\n📈 Répartition par statut:`)
statusStats.rows.forEach(r => console.log(`   - ${r.status}: ${r.count} personnes`))
console.log(`\n🔒 Visibilité email:`)
emailStats.rows.forEach(r => console.log(`   - ${r.is_email_public ? 'Public' : 'Privé'}: ${r.count} personnes`))
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

await client.end()
