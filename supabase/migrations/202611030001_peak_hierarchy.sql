-- Peak hierarchy for group chats ("peaks").
-- Replaces the flat admin/member model with a xianxia-style chain of command.
-- Role values in group_members.role, ordered by authority (lower level = more power):
--   1  peak_master        Peak Master (creator; sole control of the peak itself)
--   2  grand_elder        Grand Elder / Vice-Peak Master
--   3  hall_elder         Hall Elder
--   4  instructional_elder Core Elder
--   5  outer_elder        Outer Elder
--   6  legacy_disciple    Legacy Disciple (chosen successor; prestige, no powers)
--   7  core_disciple      Core Disciple
--   8  inner_disciple     Inner Disciple (default rank for new members)
--   9  outer_disciple     Outer Disciple
--   10 servant            Handyman Disciple
-- Legacy values: 'admin' is treated as level 1 (peak master), 'member' as level 8.

CREATE OR REPLACE FUNCTION public.peak_role_level(_role TEXT)
RETURNS INT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE _role
    WHEN 'peak_master' THEN 1
    WHEN 'admin' THEN 1
    WHEN 'grand_elder' THEN 2
    WHEN 'hall_elder' THEN 3
    WHEN 'instructional_elder' THEN 4
    WHEN 'outer_elder' THEN 5
    WHEN 'legacy_disciple' THEN 6
    WHEN 'core_disciple' THEN 7
    WHEN 'inner_disciple' THEN 8
    WHEN 'member' THEN 8
    WHEN 'outer_disciple' THEN 9
    WHEN 'servant' THEN 10
    ELSE 8
  END
$$;

-- Level of a user inside a given peak (NULL = not a member)
CREATE OR REPLACE FUNCTION public.peak_level(_user_id UUID, _group_id UUID)
RETURNS INT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT public.peak_role_level(role) FROM public.group_members
          WHERE user_id = _user_id AND group_id = _group_id);
EXCEPTION WHEN undefined_column OR undefined_table THEN
  RETURN NULL;
END;
$$;

-- Backfill existing members onto the new ranks
UPDATE public.group_members SET role = 'peak_master' WHERE role = 'admin';
UPDATE public.group_members SET role = 'inner_disciple' WHERE role = 'member';

-- Peak master only: manage the peak itself (settings, deletion)
CREATE OR REPLACE FUNCTION public.is_peak_master(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.peak_level(_user_id, _group_id) = 1
$$;

-- Grand elders and above: manage disciples below their own rank
CREATE OR REPLACE FUNCTION public.is_peak_manager(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.peak_level(_user_id, _group_id) <= 2
$$;

-- Elders and above (levels 1-5): moderation powers (pin, delete messages)
CREATE OR REPLACE FUNCTION public.is_peak_elder(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.peak_level(_user_id, _group_id) <= 5
$$;

-- Keep is_group_admin working for any other callers: now means peak master
CREATE OR REPLACE FUNCTION public.is_group_admin(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_peak_master(_user_id, _group_id)
$$;

DROP POLICY IF EXISTS "Admins can update groups" ON public.group_chats;
DROP POLICY IF EXISTS "Peak masters can update groups" ON public.group_chats;
CREATE POLICY "Peak masters can update groups" ON public.group_chats FOR UPDATE
  USING (is_peak_master(auth.uid(), id));

DROP POLICY IF EXISTS "Admins can delete groups" ON public.group_chats;
DROP POLICY IF EXISTS "Peak masters can delete groups" ON public.group_chats;
CREATE POLICY "Peak masters can delete groups" ON public.group_chats FOR DELETE
  USING (is_peak_master(auth.uid(), id) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can add members" ON public.group_members;
DROP POLICY IF EXISTS "Managers can add members" ON public.group_members;
CREATE POLICY "Managers can add members" ON public.group_members FOR INSERT
  TO authenticated WITH CHECK (
    is_peak_manager(auth.uid(), group_id) OR
    (SELECT created_by FROM group_chats WHERE id = group_id) = auth.uid()
  );

DROP POLICY IF EXISTS "Admins can remove members" ON public.group_members;
DROP POLICY IF EXISTS "Managers can remove lower disciples" ON public.group_members;
CREATE POLICY "Managers can remove lower disciples" ON public.group_members FOR DELETE
  USING (
    is_peak_manager(auth.uid(), group_id)
    AND public.peak_level(user_id, group_id) > public.peak_level(auth.uid(), group_id)
  );

DROP POLICY IF EXISTS "Admins can update member roles" ON public.group_members;
DROP POLICY IF EXISTS "Managers can assign lower roles" ON public.group_members;
CREATE POLICY "Managers can assign lower roles" ON public.group_members FOR UPDATE
  USING (
    is_peak_manager(auth.uid(), group_id)
    AND public.peak_level(user_id, group_id) > public.peak_level(auth.uid(), group_id)
  )
  WITH CHECK (
    public.peak_role_level(role) > public.peak_level(auth.uid(), group_id)
  );

DROP POLICY IF EXISTS "Senders can delete own messages" ON public.group_messages;
DROP POLICY IF EXISTS "Senders or elders can delete messages" ON public.group_messages;
CREATE POLICY "Senders or elders can delete messages" ON public.group_messages FOR DELETE
  USING (auth.uid() = sender_id OR is_peak_elder(auth.uid(), group_id));

DROP POLICY IF EXISTS "Group members can pin" ON public.pinned_group_messages;
DROP POLICY IF EXISTS "Elders can pin" ON public.pinned_group_messages;
CREATE POLICY "Elders can pin" ON public.pinned_group_messages FOR INSERT
  TO authenticated WITH CHECK (is_peak_elder(auth.uid(), group_id));

DROP POLICY IF EXISTS "Group admins can unpin" ON public.pinned_group_messages;
DROP POLICY IF EXISTS "Elders can unpin" ON public.pinned_group_messages;
CREATE POLICY "Elders can unpin" ON public.pinned_group_messages FOR DELETE
  USING (is_peak_elder(auth.uid(), group_id) OR auth.uid() = pinned_by);

-- Creator is crowned Peak Master when a peak is founded
CREATE OR REPLACE FUNCTION public.auto_add_group_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'peak_master');
  RETURN NEW;
END;
$$;
