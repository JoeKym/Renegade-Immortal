CREATE TABLE IF NOT EXISTS public.lore_content (
  id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (content_type, id),
  CONSTRAINT lore_content_type_allowed CHECK (
    content_type IN ('character', 'artifact', 'technique')
  ),
  CONSTRAINT lore_content_id_format CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT lore_content_payload_object CHECK (jsonb_typeof(payload) = 'object'),
  CONSTRAINT lore_content_payload_name CHECK (
    NULLIF(BTRIM(payload ->> 'name'), '') IS NOT NULL
  )
);

ALTER TABLE public.lore_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published lore content is readable by everyone"
  ON public.lore_content
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Admins can manage lore content"
  ON public.lore_content
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_lore_content_published_type
  ON public.lore_content (content_type, is_published, id);
