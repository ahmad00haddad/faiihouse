
REVOKE EXECUTE ON FUNCTION public.cleanup_admin_sessions() FROM PUBLIC, anon, authenticated;

-- Explicit deny policy on admin_sessions for clarity (service role bypasses RLS anyway)
CREATE POLICY "Deny all public access to admin_sessions"
  ON public.admin_sessions FOR ALL
  USING (false)
  WITH CHECK (false);
