-- Migration script for Job Offers
CREATE TABLE IF NOT EXISTS job_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'CDI',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  author_id UUID REFERENCES auth.users ON DELETE CASCADE
);

ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Offres visibles par tous" ON job_offers;
CREATE POLICY "Offres visibles par tous" 
ON job_offers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins gèrent les offres" ON job_offers;
CREATE POLICY "Admins gèrent les offres" 
ON job_offers FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND role = 'admin')
);
