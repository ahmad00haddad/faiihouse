
-- Site content singleton table
CREATE TABLE public.site_content (
  id integer PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read content (site is public)
CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  USING (true);

-- No public write policy. Writes go through server functions with service-role key.

INSERT INTO public.site_content (id, data) VALUES (1, '{}'::jsonb);

-- Admin sessions: opaque tokens issued after password login
CREATE TABLE public.admin_sessions (
  token text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
-- No policies → service role only.

-- Helper to clean expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_admin_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.admin_sessions WHERE expires_at < now();
$$;
