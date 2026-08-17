-- ==============================================================================
-- SCHÉMA DE BASE DE DONNÉES ET MIGRATIONS - ESFHB ALUMNI TRACKER
-- École de Santé Félix Houphouët-Boigny
-- Système d'Information et de Suivi de l'Insertion Professionnelle (SISIP)
-- Document d'Architecture & Script SQL Consolidation
-- ==============================================================================

-- 1. EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SCHÉMA DES TABLES PRINCIPALES

-- Table: profiles (Informations des diplômés)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  promo_year INTEGER NOT NULL,
  specialty TEXT,
  phone TEXT,
  city TEXT,
  country TEXT DEFAULT 'ML', -- Mali (ESFHB Bamako)
  status TEXT DEFAULT 'En recherche', -- 'En poste', 'En recherche', 'Entrepreneur', 'Étudiant'
  avatar_url TEXT,
  bio TEXT,
  email TEXT,
  is_contact_public BOOLEAN DEFAULT false,
  is_email_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: experiences (Parcours professionnel 1-N)
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  sector TEXT, -- 'Santé', 'Pharmacie', 'Recherche', 'Humanitaire', 'Autre'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_roles (Contrôle d'accès RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT DEFAULT 'alumni', -- 'admin', 'alumni'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: job_offers (Portail d'offres d'emploi & opportunités)
CREATE TABLE IF NOT EXISTS public.job_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'CDI',
  contact_email TEXT,
  target_specialty TEXT,
  salary_range TEXT,
  is_active BOOLEAN DEFAULT true,
  author_id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- Politiques Profiles
DROP POLICY IF EXISTS "Les profils sont visibles par les utilisateurs connectés" ON public.profiles;
CREATE POLICY "Les profils sont visibles par les utilisateurs connectés" 
ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Insertion automatique au signup" ON public.profiles;
CREATE POLICY "Insertion automatique au signup" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques Experiences
DROP POLICY IF EXISTS "Les expériences sont visibles par tous les connectés" ON public.experiences;
CREATE POLICY "Les expériences sont visibles par tous les connectés" 
ON public.experiences FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Les utilisateurs gèrent leurs propres expériences" ON public.experiences;
CREATE POLICY "Les utilisateurs gèrent leurs propres expériences" 
ON public.experiences FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())
);

-- Politiques User Roles
DROP POLICY IF EXISTS "Roles visibles par authentifiés" ON public.user_roles;
CREATE POLICY "Roles visibles par authentifiés" 
ON public.user_roles FOR SELECT USING (auth.role() = 'authenticated');

-- Politiques Job Offers
DROP POLICY IF EXISTS "Offres visibles par tous" ON public.job_offers;
CREATE POLICY "Offres visibles par tous" 
ON public.job_offers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins gèrent les offres" ON public.job_offers;
CREATE POLICY "Admins gèrent les offres" 
ON public.job_offers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND role = 'admin')
);

-- 4. AUTOMATISATION DES UTILISATEURS (TRIGGER SIGNUP)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, promo_year, email, specialty)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Diplômé ESFHB'), 
    COALESCE((new.raw_user_meta_data->>'promo_year')::integer, EXTRACT(YEAR FROM CURRENT_DATE)::integer), 
    new.email, 
    new.raw_user_meta_data->>'specialty'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'alumni')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. BUCKET STORAGE (AVATARS)

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatars sont publics" ON storage.objects;
CREATE POLICY "Avatars sont publics" 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Les utilisateurs peuvent uploader leurs propres photos" ON storage.objects;
CREATE POLICY "Les utilisateurs peuvent uploader leurs propres photos" 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Les utilisateurs gèrent leurs propres photos" ON storage.objects;
CREATE POLICY "Les utilisateurs gèrent leurs propres photos" 
ON storage.objects FOR UPDATE OR DELETE USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. INDEX DE PERFORMANCE

CREATE INDEX IF NOT EXISTS idx_profiles_promo_year ON public.profiles(promo_year);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_experiences_profile_id ON public.experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
