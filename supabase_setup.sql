-- ---------------------------------------------------------
-- ALUMNI TRACKING SYSTEM - BASE DE DONNÉES
-- ---------------------------------------------------------

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Table: profiles
-- Contient les informations personnelles des alumni
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  promo_year INTEGER NOT NULL,
  specialty TEXT,
  phone TEXT,
  city TEXT,
  country TEXT DEFAULT 'MA', -- Par défaut Maroc (ou adapter au contexte)
  status TEXT DEFAULT 'En recherche', -- 'En poste', 'En recherche', 'Entrepreneur', 'Étudiant'
  avatar_url TEXT,
  bio TEXT,
  email TEXT,
  is_contact_public BOOLEAN DEFAULT false,
  is_email_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: experiences
-- Relation 1-N : un profile peut avoir plusieurs expériences
CREATE TABLE experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  sector TEXT, -- 'IT', 'Finance', 'Industrie', 'Santé', etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_roles
-- Pour la gestion des droits (admin / alumni)
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'alumni', -- 'admin', 'alumni'
  UNIQUE(user_id)
);

-- 3. ROW LEVEL SECURITY (RLS)

-- Activer la sécurité sur les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- POLITIQUES POUR PROFILES
-- Tout le monde (connecté) peut voir tous les profils
CREATE POLICY "Les profils sont visibles par les utilisateurs connectés" 
ON profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Un utilisateur ne peut modifier que son propre profil
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Insertion automatique au signup (via trigger plus bas)
CREATE POLICY "Insertion automatique au signup" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- POLITIQUES POUR EXPERIENCES
-- Visible par tous les connectés
CREATE POLICY "Les expériences sont visibles par tous les connectés" 
ON experiences FOR SELECT USING (auth.role() = 'authenticated');

-- Un utilisateur ne peut modifier/supprimer que ses propres expériences
CREATE POLICY "Les utilisateurs gèrent leurs propres expériences" 
ON experiences FOR ALL USING (
  profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
);

-- 4. FONCTIONS ET TRIGGERS

-- Trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, promo_year, email, specialty)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', (new.raw_user_meta_data->>'promo_year')::integer, new.email, new.raw_user_meta_data->>'specialty');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'alumni');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  -- 5. STORAGE CONFIGURATION (AVATARS)
-- Note: Ce bloc doit être exécuté dans l'éditeur SQL de Supabase

-- Création du bucket 'avatars' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques de sécurité pour le stockage
-- Tout le monde peut voir les avatars (public = true)
CREATE POLICY "Avatars sont publics" 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Un utilisateur ne peut uploader que dans son propre dossier (nommé par son ID)
CREATE POLICY "Les utilisateurs peuvent uploader leurs propres photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Un utilisateur peut modifier/supprimer ses propres photos
CREATE POLICY "Les utilisateurs gèrent leurs propres photos" 
ON storage.objects FOR UPDATE OR DELETE 
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
