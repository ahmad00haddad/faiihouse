
DROP POLICY IF EXISTS "anyone can submit contact" ON public.contact_messages;
DROP POLICY IF EXISTS "anyone can submit application" ON public.job_applications;
REVOKE INSERT ON public.contact_messages FROM anon, authenticated;
REVOKE INSERT ON public.job_applications FROM anon, authenticated;
