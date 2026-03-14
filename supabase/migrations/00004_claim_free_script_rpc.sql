-- Atomic function to claim a free script slot.
-- For pro users, returns the user row without modification.
-- For free users, increments free_scripts_used only if under the limit (3).
-- Raises an exception if the limit is reached.
CREATE OR REPLACE FUNCTION claim_free_script(user_id UUID)
RETURNS SETOF users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result users;
BEGIN
  -- Try to atomically increment for free users, or just select for pro users
  UPDATE users
    SET free_scripts_used = CASE
      WHEN is_pro THEN free_scripts_used
      ELSE free_scripts_used + 1
    END
  WHERE id = user_id
    AND (is_pro = true OR free_scripts_used < 3)
  RETURNING * INTO result;

  IF NOT FOUND THEN
    -- Check if user exists at all
    PERFORM 1 FROM users WHERE id = user_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User profile not found';
    ELSE
      RAISE EXCEPTION 'Free script limit reached';
    END IF;
  END IF;

  RETURN NEXT result;
END;
$$;
