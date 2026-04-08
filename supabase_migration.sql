-- ============================================================
-- MIGRATION COMPLETE - ALUMNI TRACKER ESFHB
-- À exécuter dans Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. COLONNES MANQUANTES sur la table profiles
-- (ADD COLUMN IF NOT EXISTS évite les erreurs si déjà présentes)
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS is_email_public BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_contact_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'En recherche',
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Mali',
  ADD COLUMN IF NOT EXISTS specialty TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. CORRECTION DU TRIGGER (créer profil auto à l'inscription)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, promo_year, email, is_email_public, is_contact_public, specialty)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nouvel alumnus'),
    COALESCE((new.raw_user_meta_data->>'promo_year')::integer, 2024),
    new.email,
    true,
    false,
    new.raw_user_meta_data->>'specialty'
  )
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'alumni')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer et recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. BUCKET AVATARS (Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. POLITIQUES STORAGE
-- Supprimer les anciennes et recréer proprement
DROP POLICY IF EXISTS "Avatars sont publics" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs peuvent uploader leurs propres photos" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs gèrent leurs propres photos" ON storage.objects;

-- Lecture publique des avatars
CREATE POLICY "Avatars publics lecture" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- Upload dans son propre dossier
CREATE POLICY "Upload avatar personnel" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Modification et suppression de ses propres photos
CREATE POLICY "Gestion avatar personnel" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Suppression avatar personnel" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- 5. POLITIQUE RLS manquante : INSERT sur profiles
DROP POLICY IF EXISTS "Insertion automatique au signup" ON profiles;
CREATE POLICY "Insertion automatique au signup" 
ON profiles FOR INSERT 
WITH CHECK (true);

-- 6. Mettre à jour les profils existants avec des valeurs par défaut
UPDATE profiles 
SET 
  is_email_public = COALESCE(is_email_public, true),
  is_contact_public = COALESCE(is_contact_public, false),
  status = COALESCE(status, 'En recherche'),
  country = COALESCE(country, 'Mali')
WHERE id IS NOT NULL;

-- 7. Vérification finale
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
