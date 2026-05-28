INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view site-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');