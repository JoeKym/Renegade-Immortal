-- Sect hierarchy for communities.
-- Replaces the flat leader/elder/member model with a xianxia-style chain of command.
-- Role values in community_members.role, ordered by authority (lower level = more power):
--   1  sect_master        Sect Master (creator; sole control of the sect itself)
--   2  deputy_master      Deputy Sect Master
--   3  hall_master        Hall Master (Grand Elder equivalent)
--   4  core_elder         Core / Peak Elder
--   5  inner_elder        Inner Sect Elder
--   6  outer_elder        Outer Sect Elder
--   7  legacy_disciple    Successor / Legacy Disciple (prestige, no powers)
--   8  core_disciple      Core Disciple
--   9  inner_disciple     Inner Sect Disciple (default rank for new members)
--   10 outer_disciple     Outer Sect Disciple
--   11 servant            Labor Disciple
-- Legacy values: 'leader' is treated as level 1, 'elder' as level 4, 'member' as level 9.

ALTER TABLE public.community_members DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE public.community_members ADD CONSTRAINT valid_role CHECK (role IN (
  'sect_master', 'deputy_master', 'hall_master', 'core_elder', 'inner_elder', 'outer_elder',
  'legacy_disciple', 'core_disciple', 'inner_disciple', 'outer_disciple', 'servant',
  'leader', 'elder', 'member' -- legacy, still accepted
));

CREATE OR REPLACE FUNCTION public.sect_role_level(_role TEXT)
RETURNS INT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE _role
    WHEN 'sect_master' THEN 1
    WHEN 'leader' THEN 1
    WHEN 'deputy_master' THEN 2
    WHEN 'hall_master' THEN 3
    WHEN 'core_elder' THEN 4
    WHEN 'elder' THEN 4
    WHEN 'inner_elder' THEN 5
    WHEN 'outer_elder' THEN 6
    WHEN 'legacy_disciple' THEN 7
    WHEN 'core_disciple' THEN 8
    WHEN 'inner_disciple' THEN 9
    WHEN 'member' THEN 9
    WHEN 'outer_disciple' THEN 10
    WHEN 'servant' THEN 11
    ELSE 9
  END
$$;

-- Level of a user inside a given sect (NULL = not a member)
CREATE OR REPLACE FUNCTION public.sect_level(_user_id UUID, _community_id UUID)
RETURNS INT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT public.sect_role_level(role) FROM public.community_members
          WHERE user_id = _user_id AND community_id = _community_id);
EXCEPTION WHEN undefined_column OR undefined_table THEN
  RETURN NULL;
END;
$$;

-- Backfill existing members onto the new ranks
UPDATE public.community_members SET role = 'sect_master' WHERE role = 'leader';
UPDATE public.community_members SET role = 'core_elder' WHERE role = 'elder';
UPDATE public.community_members SET role = 'inner_disciple' WHERE role = 'member';

-- Sect master only: manage the sect itself (settings, guidelines, emblem)
CREATE OR REPLACE FUNCTION public.is_sect_master(_user_id UUID, _community_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.sect_level(_user_id, _community_id) = 1
$$;

-- Deputy masters and above: manage disciples below their own rank
CREATE OR REPLACE FUNCTION public.is_sect_manager(_user_id UUID, _community_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.sect_level(_user_id, _community_id) <= 2
$$;

-- Elders and above (levels 1-6): moderation powers (delete posts/messages)
CREATE OR REPLACE FUNCTION public.is_sect_elder(_user_id UUID, _community_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.sect_level(_user_id, _community_id) <= 6
$$;

DROP POLICY IF EXISTS "Leaders can update their community" ON public.communities;
CREATE POLICY "Sect masters can update their sect" ON public.communities FOR UPDATE TO authenticated USING (
  is_sect_master(auth.uid(), id)
  OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Authenticated users can join communities" ON public.community_members;
CREATE POLICY "Authenticated users can join communities" ON public.community_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role IN ('inner_disciple', 'member'));

DROP POLICY IF EXISTS "Leaders can update member roles" ON public.community_members;
CREATE POLICY "Managers can assign lower roles" ON public.community_members FOR UPDATE TO authenticated USING (
  is_sect_manager(auth.uid(), community_id)
  AND public.sect_level(user_id, community_id) > public.sect_level(auth.uid(), community_id)
)
  WITH CHECK (
    public.sect_role_level(role) > public.sect_level(auth.uid(), community_id)
  );

DROP POLICY IF EXISTS "Leaders can remove members" ON public.community_members;
CREATE POLICY "Managers can remove lower disciples" ON public.community_members FOR DELETE TO authenticated USING (
  is_sect_manager(auth.uid(), community_id)
  AND public.sect_level(user_id, community_id) > public.sect_level(auth.uid(), community_id)
);

DROP POLICY IF EXISTS "Authors can delete own posts" ON public.community_posts;
CREATE POLICY "Authors or elders can delete posts" ON public.community_posts FOR DELETE TO authenticated USING (
  auth.uid() = user_id OR is_sect_elder(auth.uid(), community_id)
);

DROP POLICY IF EXISTS "Authors can delete own messages" ON public.community_messages;
CREATE POLICY "Authors or elders can delete messages" ON public.community_messages FOR DELETE TO authenticated USING (
  auth.uid() = user_id OR is_sect_elder(auth.uid(), community_id)
);

-- Founder is crowned Sect Master when a sect is founded
CREATE OR REPLACE FUNCTION public.auto_add_community_leader()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.community_members (community_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'sect_master');
  RETURN NEW;
END;
$$;

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_user_id uuid DEFAULT NULL;

-- Join notification trigger: recognise the new top rank
CREATE OR REPLACE FUNCTION public.notify_community_join()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _community_name TEXT;
  _joiner_name TEXT;
  _leader_id UUID;
BEGIN
  IF NEW.role = 'sect_master' THEN RETURN NEW; END IF;

  SELECT name, created_by INTO _community_name, _leader_id
  FROM public.communities WHERE id = NEW.community_id;

  SELECT display_name INTO _joiner_name
  FROM public.profiles WHERE user_id = NEW.user_id;

  INSERT INTO public.notifications (title, message, type, page_link, target_user_id)
  VALUES (
    'New Member',
    COALESCE(_joiner_name, 'A cultivator') || ' joined ' || COALESCE(_community_name, 'your sect'),
    'community',
    '/sects/' || NEW.community_id,
    _leader_id
  );

  RETURN NEW;
END;
$$;

-- Reports are reviewed by sect masters and deputy masters (only if the table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'community_reports') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Leaders can view community reports" ON public.community_reports';
    EXECUTE 'CREATE POLICY "Managers can view community reports" ON public.community_reports
      FOR SELECT USING (
        public.is_sect_manager(auth.uid(), community_id)
        OR has_role(auth.uid(), ''admin'')
      )';
  END IF;
END
$$;
