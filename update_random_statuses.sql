UPDATE public.profiles
SET status = (ARRAY['Privé', 'Public', 'Sans emploi', 'Bénévolat', 'Entrepreneur', 'Étudiant'])[floor(random() * 6 + 1)];
