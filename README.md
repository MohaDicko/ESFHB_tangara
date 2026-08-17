# ÉCOLE DE SANTÉ FÉLIX HOUPHOUËT-BOIGNY (ESFHB)
## Système d'Information et de Suivi de l'Insertion Professionnelle (SISIP)
### Manuel d'Architecture, Déploiement et Gouvernance Système

---

## 1. Vue d'Ensemble Exécutive

Le **Système d'Information et de Suivi de l'Insertion Professionnelle (SISIP)** est la plateforme officielle de l'École de Santé Félix Houphouët-Boigny (ESFHB). Elle a été conçue pour centraliser, analyser et optimiser l'orientation, le suivi de carrière et le réseau des diplômés professionnels du secteur de la santé au Mali.

### Objectifs Stratégiques :
* **Cartographie Professionnelle** : Suivi en temps réel des statuts professionnels des alumni (Secteur public, privé, ONG, entrepreneuriat, formation continue).
* **Indicateurs d'Employabilité** : Production d'analyses statistiques de haut niveau pour l'accréditation académique et la gouvernance institutionnelle.
* **Dynamisation du Réseau Alumni** : Annuaire sécurisé, interconnexion des diplômés et portail d'opportunités de carrière.
* **Sécurité & Conformité** : Contrôle strict de l'accès aux données personnelles selon la réglementation en vigueur.

---

## 2. Architecture Technique et Stack Technologique

Le système repose sur une architecture moderne de niveau entreprise, garantissant performance, haut niveau de sécurité et scalabilité.

```
+-----------------------------------------------------------------------+
|                            FRONTEND / UX                              |
|          Next.js 16 (App Router) - React 19 - Tailwind CSS            |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    COUCHE SERVEUR / PROXY / RLS                       |
|               Next.js Server Actions & API Routes (Edge/Node)        |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                         BASE DE DONNÉES / AUTH                        |
|           Supabase PostgreSQL - Auth Engine - Storage Objects         |
+-----------------------------------------------------------------------+
```

### Composants Clés :
* **Framework Web** : Next.js 16.2 (App Router & Server Actions)
* **Base de Données & Authentification** : Supabase PostgreSQL avec Row Level Security (RLS)
* **Design & UI System** : Tailwind CSS v4, Lucide Icons, Recharts (Visualisation de données)
* **Typographie & Charte** : Plus Jakarta Sans (Standard Institutionnel)
* **Assurance Qualité & Tests** : Vitest, Suite de tests unitaires et d'intégration automatisés

---

## 3. Modèle de Sécurité et Contrôle d'Accès (RBAC & RLS)

La plateforme met en œuvre un modèle de sécurité multicouche :

1. **Row Level Security (RLS)** :
   * Chaque diplômé ne peut modifier que son propre profil et ses expériences.
   * La visibilité des coordonnées directes (téléphone, email) est strictement soumise au consentement explicite de l'utilisateur (`is_contact_public`, `is_email_public`).
2. **Contrôle d'Accès Basé sur les Rôles (RBAC)** :
   * Rôle `alumni` : Accès à l'annuaire, gestion du profil personnel, consultation des opportunités.
   * Rôle `admin` : Gestion des membres, modération des offres, export des données stratégiques (CSV/Excel).

---

## 4. Guide d'Installation et d'Exploitation

### 4.1 Prérequis
* Node.js v20.x LTS ou supérieur
* npm v10.x ou supérieur
* Une instance Supabase configurée (PostgreSQL 15+)

### 4.2 Installation de l'Environnement de Développement
```bash
# Cloner le dépôt et installer les dépendances
npm install

# Configurer les variables d'environnement (.env.local)
# NEXT_PUBLIC_SUPABASE_URL=https://<votre-instance>.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre-cle-anon>
# SUPABASE_SERVICE_ROLE_KEY=<cle-service-role>

# Lancer le serveur de développement
npm run dev
```

### 4.3 Execution des Tests d'Assurance Qualité
```bash
# Exécuter l'ensemble des tests unitaires et d'intégration
npm test
```

### 4.4 Compilation et Lancement en Production
```bash
# Compiler l'application optimisée pour la production
npm run build

# Démarrer le serveur de production
npm run start
```

---

## 5. Matrice des Endpoints & API

| Endpoint | Méthode | Rôle | Description |
| :--- | :--- | :--- | :--- |
| `/dashboard` | `GET` | Authentifié | Vue d'ensemble personnelle et métriques |
| `/dashboard/directory` | `GET` | Authentifié | Annuaire des diplômés (Paginé & Filtré) |
| `/dashboard/jobs` | `GET` | Authentifié | Consulter les opportunités professionnelles |
| `/dashboard/admin` | `GET` | Admin | Console d'administration et gouvernance |
| `/api/export-csv` | `GET` | Admin | Export sécurisé des données au format CSV |

---

## 6. Gouvernance et Maintenance

Le dossier d'architecture technique complet et les procédures de migration sont documentés dans le fichier [`architecture_et_conception.md`](file:///c:/Users/tinkpad/Desktop/Mes%20Nouveaux%20Projets/projet%20souleymane%20tangara/architecture_et_conception.md). Le rapport de livraison opérationnelle est consultable dans [`TAF.md`](file:///c:/Users/tinkpad/Desktop/Mes%20Nouveaux%20Projets/projet%20souleymane%20tangara/TAF.md).
