CREATE TABLE IF NOT EXISTS public.donghua_catalog (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT donghua_catalog_id_format CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT donghua_catalog_payload_object CHECK (jsonb_typeof(payload) = 'object'),
  CONSTRAINT donghua_catalog_payload_id CHECK (payload ->> 'id' = id),
  CONSTRAINT donghua_catalog_payload_title CHECK (
    NULLIF(BTRIM(payload ->> 'title'), '') IS NOT NULL
  )
);

ALTER TABLE public.donghua_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published donghua catalog is readable by everyone"
  ON public.donghua_catalog
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Admins can manage donghua catalog"
  ON public.donghua_catalog
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_donghua_catalog_published
  ON public.donghua_catalog (is_published, id);
