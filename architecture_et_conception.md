# Spécifications Techniques : Alumni Tracking System

## 1. Vision du Produit
Un système de gestion centralisé pour maintenir le lien entre l'institution et ses diplômés, tout en fournissant des indicateurs clés sur leur employabilité.

## 2. Fonctionnalités Détaillées

### A. Espace Alumni (Utilisateur)
- **Mon Profil :** Mise à jour des coordonnées et de la situation actuelle (En poste, En recherche, Entrepreneur).
- **Parcours Pro :** Historique chronologique des expériences professionnelles (1-N).
- **Annuaire :** Recherche simplifiée des autres anciens (optionnel selon confidentialité).

### B. Espace Administration
- **Dashboard Analytique :** KPI sur le taux d'insertion, les secteurs d'activité dominants par promotion.
- **Gestion des Membres :** Validation des comptes, modification ou suppression de profils.
- **Reporting & Export :** Génération de listes filtrées (Excel/PDF) pour les rapports de performance institutionnelle.

## 3. Architecture Technique (Optimisée)
- **Framework :** Next.js 14+ (App Router) pour une navigation fluide et un SEO performant.
- **Base de Données & API :** Supabase (PostgreSQL + PostgREST) pour une interaction directe et sécurisée.
- **Sécurité :** Row Level Security (RLS) pour isoler les données personnelles par utilisateur.
- **UI/UX :** TailwindCSS + Shadcn/UI pour un design moderne, réactif et accessible.

## 4. Schéma de Base de Données

```sql
-- Table: profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  promo_year INTEGER NOT NULL,
  specialty TEXT,
  phone TEXT,
  city TEXT,
  country TEXT,
  status TEXT DEFAULT 'En recherche', -- En poste, En recherche, Entrepreneur, Étudiant
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: experiences
CREATE TABLE experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  sector TEXT, -- IT, Finance, Industrie, Santé, etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_roles
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'alumni' -- admin, alumni
);
```

## 5. Roadmap de Développement (4 Semaines)

| Semaine | Phase | Livrables |
| :--- | :--- | :--- |
| **Semaine 1** | Fondation | Setup Supabase, Authentification (Magic Link/Email), Dashboard de base, Layout. |
| **Semaine 2** | Profils & Données | Gestion complète du profil alumni, ajout/edition d'expériences, uploads d'images. |
| **Semaine 3** | Admin & Stats | Interface administrateur, graphiques (Recharts), filtres avancés, exports CSV. |
| **Semaine 4** | Polissage & Déploiement | Optimisation mobile, PWA, tests de sécurité, déploiement sur Vercel. |

## 6. Conseils pour le Contexte Africain
- **Poids des pages :** Minimiser l'usage de bibliothèques lourdes pour accélérer le chargement sur réseau 3G/4G.
- **Mode hors-ligne :** Mise en cache des données essentielles via `react-query` pour permettre la lecture sans connexion stable.
- **Simplicité :** Formulaires en étapes (Stepper) pour ne pas décourager les utilisateurs sur mobile.
