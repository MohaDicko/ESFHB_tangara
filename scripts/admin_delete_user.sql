-- Fonction RPC pour supprimer un utilisateur auth depuis le client anon (via service_role interne)
-- À exécuter dans Supabase > SQL Editor

CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- S'exécute avec les droits du propriétaire (service_role)
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Vérifier que l'appelant est bien admin
  SELECT role INTO caller_role
  FROM public.user_roles
  WHERE user_id = auth.uid();

  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Accès refusé : vous devez être administrateur.';
  END IF;

  -- Empêcher l'auto-suppression
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Impossible de supprimer son propre compte.';
  END IF;

  -- Supprimer l'utilisateur (cascade sur profiles et experiences via FK)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Donner accès à la fonction aux utilisateurs authentifiés (la vérif admin est dans la fonction)
GRANT EXECUTE ON FUNCTION admin_delete_user(UUID) TO authenticated;
