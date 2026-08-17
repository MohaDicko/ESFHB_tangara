# DOSSIER D'ARCHITECTURE TECHNIQUE (DAT)
## Système d'Information et de Suivi de l'Insertion Professionnelle (SISIP)
### École de Santé Félix Houphouët-Boigny (ESFHB)

---

## 1. Cadre Général et Alignement Stratégique

Le Dossier d'Architecture Technique (DAT) définit la structure logicielle, les mécanismes de sécurité, la gouvernance de données et les normes d'ingénierie applicables à la plateforme **ESFHB Alumni Tracker**.

### 1.1 Exigences Fonctionnelles Métier
* **Système d'Information Diplômés** : Gestion unifiée des profils académiques et professionnels des étudiants et diplômés.
* **Analytique de Direction** : Tableaux de bord stratégiques sur le taux d'insertion par filière et promotion.
* **Portail Entreprises & Recrutement** : Diffusion contrôlée d'offres de santé ciblées.

---

## 2. Modèle Conceptuel et Relationnel de Données

La base de données relationnelle s'appuie sur le moteur PostgreSQL de Supabase.

### 2.1 Entités Principales
1. **`profiles`** : Identité, spécialité médicale/paramédicale, coordonnées, statut d'emploi, visibilité des données.
2. **`experiences`** : Établissements employeurs, intitulés de poste, durées d'exercice, secteurs (Santé publique/privée, ONG, Recherche).
3. **`user_roles`** : Affectation des autorisations système (`admin`, `alumni`).
4. **`job_offers`** : Annonces d'emploi, exigences de qualification, contacts recruteurs.

---

## 3. Matrice de Sécurité & ISO 27001 / GDPR / Réglementation Nationale

### 3.1 Partitionnement des Politiques RLS (Row Level Security)

```sql
-- RLS Profile Read Isolation
CREATE POLICY "Strict Authenticated Read Profiles"
ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Profile Self Management
CREATE POLICY "Self Profile Update Only"
ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

---

## 4. Stratégie de Performance et Téléphonie/Mobile (Afrique de l'Ouest)

1. **Optimisation Réseau 3G/4G** : Chargement ciblé des composants, pas de dépendances réseau inutiles, polices système optimisées.
2. **Pagination Côté Serveur** : Annuaire paginé par blocs optimisés de 24 éléments pour garantir un temps de réponse sous les 300 ms.
3. **PWA & Cash** : Support des manifestes web pour l'installation sur smartphone Android/iOS.
