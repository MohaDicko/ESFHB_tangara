UPDATE public.profiles
SET specialty = (ARRAY['SMI', 'SP', 'TLP', 'BM', 'SF', 'IDE'])[floor(random() * 6 + 1)]
WHERE specialty IS NULL OR specialty = '' OR specialty NOT IN ('SMI', 'SP', 'TLP', 'BM', 'SF', 'IDE');
