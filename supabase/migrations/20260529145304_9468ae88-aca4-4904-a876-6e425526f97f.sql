-- 1. Remove permissive deny policy on admin_sessions; RLS enabled + no policies = deny by default
DROP POLICY IF EXISTS "Deny all public access to admin_sessions" ON public.admin_sessions;

-- 2. Restrict site-images bucket: no write access for anon/authenticated (only service_role bypasses RLS)
-- Also drop the broad SELECT to prevent listing; public bucket URLs still work via getPublicUrl
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (qual LIKE '%site-images%' OR with_check LIKE '%site-images%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Explicit deny-write restrictive policies for site-images
CREATE POLICY "site-images deny insert"
ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id <> 'site-images');

CREATE POLICY "site-images deny update"
ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (bucket_id <> 'site-images');

CREATE POLICY "site-images deny delete"
ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (bucket_id <> 'site-images');