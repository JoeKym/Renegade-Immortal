-- COMBINED MIGRATIONS - Run this in Supabase SQL Editor in order
-- All 36 migrations combined into one file with correct dependencies

-- 1. comments.sql (first - no dependencies)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous Cultivator',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comments are publicly readable" ON public.comments;
CREATE POLICY "Comments are publicly readable" ON public.comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can post comments" ON public.comments;
CREATE POLICY "Anyone can post comments" ON public.comments FOR INSERT WITH CHECK (
  length(content) > 0 AND length(content) <= 1000 AND
  length(author_name) > 0 AND length(author_name) <= 50
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'lore',
  page_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Notifications are publicly readable" ON public.notifications;
CREATE POLICY "Notifications are publicly readable" ON public.notifications FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.active_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  current_page TEXT NOT NULL DEFAULT '/',
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.active_visitors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Visitors are publicly readable" ON public.active_visitors;
CREATE POLICY "Visitors are publicly readable" ON public.active_visitors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can register as visitor" ON public.active_visitors;
CREATE POLICY "Anyone can register as visitor" ON public.active_visitors FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.cleanup_stale_visitors()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.active_visitors WHERE last_seen < now() - interval '5 minutes';
$$;

DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'comments';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.comments;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'notifications';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.notifications;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'active_visitors';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.active_visitors;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_visitors;

-- 2. profiles.sql (depends on comments for user_id column)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  display_name TEXT NOT NULL DEFAULT 'Cultivator',
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  favorite_characters TEXT[] DEFAULT '{}',
  reading_progress TEXT DEFAULT 'Not started',
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Cultivator'));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 2.5 AVATARS STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'user_id') THEN
    ALTER TABLE public.comments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- 3. roles.sql (creates has_role function)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL DEFAULT '/',
  session_id TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (length(session_id) > 0 AND length(page_path) > 0);
DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;
CREATE POLICY "Admins can read page views" ON public.page_views FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete comments" ON public.comments;
CREATE POLICY "Admins can delete comments" ON public.comments FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete notifications" ON public.notifications;
CREATE POLICY "Admins can delete notifications" ON public.notifications FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'page_views';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.page_views;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;

-- 4. admin_policies.sql (depends on has_role function)
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 5. suspensions.sql
CREATE TABLE IF NOT EXISTS public.user_suspensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('suspended', 'banned')),
  reason text NOT NULL DEFAULT '',
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage suspensions" ON public.user_suspensions;
CREATE POLICY "Admins can manage suspensions" ON public.user_suspensions FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Users can read own suspensions" ON public.user_suspensions;
CREATE POLICY "Users can read own suspensions" ON public.user_suspensions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.is_user_suspended(_user_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object('is_suspended', true, 'type', type, 'reason', reason, 'expires_at', expires_at)
     FROM public.user_suspensions WHERE user_id = _user_id AND (type = 'banned' OR (type = 'suspended' AND expires_at > now()))
     ORDER BY created_at DESC LIMIT 1),
    '{"is_suspended": false}'::jsonb
  );
$$;
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_suspensions';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.user_suspensions;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_suspensions;

-- 6. reviews.sql
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  author_name text NOT NULL DEFAULT 'Anonymous Cultivator',
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  page_path text NOT NULL DEFAULT '/',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.reviews;
CREATE POLICY "Reviews are publicly readable" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can post reviews" ON public.reviews;
CREATE POLICY "Authenticated users can post reviews" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND length(content) > 0 AND length(content) <= 500 AND length(author_name) > 0 AND length(author_name) <= 50);
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'reviews';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.reviews;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- 7. appeals.sql
CREATE TABLE IF NOT EXISTS public.appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit appeals" ON public.appeals;
CREATE POLICY "Anyone can submit appeals" ON public.appeals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND length(message) > 0 AND length(message) <= 2000);
DROP POLICY IF EXISTS "Users can read own appeals" ON public.appeals;
CREATE POLICY "Users can read own appeals" ON public.appeals FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can read all appeals" ON public.appeals;
CREATE POLICY "Admins can read all appeals" ON public.appeals FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update appeals" ON public.appeals;
CREATE POLICY "Admins can update appeals" ON public.appeals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete appeals" ON public.appeals;
CREATE POLICY "Admins can delete appeals" ON public.appeals FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'appeals';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.appeals;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appeals;

-- 8. seed_admin.sql (Admin user: mail.jkyme@gmail.com)
INSERT INTO public.user_roles (user_id, role) VALUES ('fe0d506b-4e3a-4346-b4d3-5c7026eb234f', 'admin') ON CONFLICT DO NOTHING;

-- 9. visitor_policies.sql (fixes)
DROP POLICY IF EXISTS "Anyone can register as visitor" ON public.active_visitors;
DROP POLICY IF EXISTS "Visitors can update their own session" ON public.active_visitors;
DROP POLICY IF EXISTS "Visitors can remove their session" ON public.active_visitors;
CREATE POLICY "Anyone can register as visitor" ON public.active_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Visitors can update their own session" ON public.active_visitors FOR UPDATE
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Visitors can remove their session" ON public.active_visitors FOR DELETE
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id' OR has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (length(session_id) > 0 AND length(page_path) > 0);

-- 10. comments_trigger.sql
-- (Add your comments trigger code here if needed)

-- 11. conversations.sql
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- 12. conversation_policies.sql
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can view participants" ON public.conversation_participants;
CREATE POLICY "Users can view participants" ON public.conversation_participants FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));

-- 13. messages.sql
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
CREATE POLICY "Users can view messages" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));
DROP POLICY IF EXISTS "Senders can update messages" ON public.messages;
CREATE POLICY "Senders can update messages" ON public.messages FOR UPDATE
  USING (sender_id = auth.uid()) WITH CHECK (sender_id = auth.uid());
DROP POLICY IF EXISTS "Senders can delete messages" ON public.messages;
CREATE POLICY "Senders can delete messages" ON public.messages FOR DELETE
  USING (sender_id = auth.uid());
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.messages;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 14. communities.sql
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  avatar_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Communities are publicly readable" ON public.communities;
CREATE POLICY "Communities are publicly readable" ON public.communities FOR SELECT USING (true);

-- 15. community_members.sql
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(community_id, user_id)
);
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members are viewable by community members" ON public.community_members;
CREATE POLICY "Members are viewable by community members" ON public.community_members FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_id AND user_id = auth.uid()));

-- 16. community_posts.sql
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- 17. community_full.sql and 18. community_fix.sql combined
CREATE OR REPLACE FUNCTION public.is_community_member(_user_id UUID, _community_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_members WHERE user_id = _user_id AND community_id = _community_id);
$$;

DROP POLICY IF EXISTS "Members can read posts" ON public.community_posts;
CREATE POLICY "Members can read posts" ON public.community_posts FOR SELECT
  USING (is_community_member(auth.uid(), community_id));
DROP POLICY IF EXISTS "Members can create posts" ON public.community_posts;
CREATE POLICY "Members can create posts" ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id AND is_community_member(auth.uid(), community_id));
DROP POLICY IF EXISTS "Authors can update posts" ON public.community_posts;
CREATE POLICY "Authors can update posts" ON public.community_posts FOR UPDATE
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Authors can delete posts" ON public.community_posts;
CREATE POLICY "Authors can delete posts" ON public.community_posts FOR DELETE
  USING (auth.uid() = author_id OR is_community_member(auth.uid(), community_id));
DROP POLICY IF EXISTS "Admins can manage communities" ON public.communities;
CREATE POLICY "Admins can manage communities" ON public.communities FOR ALL
  USING (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can manage members" ON public.community_members;
CREATE POLICY "Admins can manage members" ON public.community_members FOR ALL
  USING (has_role(auth.uid(), 'admin'));
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'community_posts';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.community_posts;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;

-- 19. watch_history.sql
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, episode_number)
);
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own watch history" ON public.watch_history;
CREATE POLICY "Users can view own watch history" ON public.watch_history FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own watch history" ON public.watch_history;
CREATE POLICY "Users can update own watch history" ON public.watch_history FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 20-21. likes_votes.sql and saved_posts.sql
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can like posts" ON public.post_likes;
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can unlike posts" ON public.post_likes;
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
CREATE POLICY "Users can save posts" ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can unsave posts" ON public.saved_posts;
CREATE POLICY "Users can unsave posts" ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);

-- 22-25. news tables combined
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "News is publicly readable" ON public.news;
CREATE POLICY "News is publicly readable" ON public.news FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can create news" ON public.news;
CREATE POLICY "Admins can create news" ON public.news FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
CREATE POLICY "Admins can update news" ON public.news FOR UPDATE USING (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;
CREATE POLICY "Admins can delete news" ON public.news FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 26. search_analytics.sql
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  query TEXT NOT NULL,
  search_type TEXT NOT NULL DEFAULT 'global',
  category TEXT,
  result_title TEXT,
  result_path TEXT,
  action TEXT NOT NULL DEFAULT 'search',
  result_position INTEGER,
  total_results INTEGER,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own search analytics" ON public.search_analytics;
CREATE POLICY "Users can insert own search analytics" ON public.search_analytics FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anonymous users can insert search analytics" ON public.search_analytics;
CREATE POLICY "Anonymous users can insert search analytics" ON public.search_analytics FOR INSERT
  TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Only admins can read search analytics" ON public.search_analytics;
CREATE POLICY "Only admins can read search analytics" ON public.search_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
DROP INDEX IF EXISTS idx_search_analytics_user_id;
CREATE INDEX idx_search_analytics_user_id ON public.search_analytics(user_id);
DROP INDEX IF EXISTS idx_search_analytics_query;
CREATE INDEX idx_search_analytics_query ON public.search_analytics(query);
DROP INDEX IF EXISTS idx_search_analytics_created_at;
CREATE INDEX idx_search_analytics_created_at ON public.search_analytics(created_at);
DROP INDEX IF EXISTS idx_search_analytics_category;
CREATE INDEX idx_search_analytics_category ON public.search_analytics(category);

CREATE OR REPLACE FUNCTION public.get_popular_searches(days INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (query TEXT, search_count BIGINT, click_count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT sa.query,
    COUNT(*) FILTER (WHERE sa.action = 'search') as search_count,
    COUNT(*) FILTER (WHERE sa.action = 'click') as click_count
  FROM public.search_analytics sa
  WHERE sa.created_at >= now() - (days || ' days')::INTERVAL
  GROUP BY sa.query ORDER BY search_count DESC LIMIT limit_count;
$$;

CREATE OR REPLACE FUNCTION public.get_trending_items(days INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (item_title TEXT, item_path TEXT, item_category TEXT, click_count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT sa.result_title as item_title, sa.result_path as item_path, sa.category as item_category,
    COUNT(*) as click_count
  FROM public.search_analytics sa
  WHERE sa.action = 'click' AND sa.created_at >= now() - (days || ' days')::INTERVAL AND sa.result_title IS NOT NULL
  GROUP BY sa.result_title, sa.result_path, sa.category ORDER BY click_count DESC LIMIT limit_count;
$$;

CREATE OR REPLACE FUNCTION public.get_search_conversion_rate(days INTEGER DEFAULT 7)
RETURNS TABLE (total_searches BIGINT, total_clicks BIGINT, conversion_rate NUMERIC)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*) FILTER (WHERE action = 'search') as total_searches,
    COUNT(*) FILTER (WHERE action = 'click') as total_clicks,
    CASE WHEN COUNT(*) FILTER (WHERE action = 'search') > 0
      THEN ROUND((COUNT(*) FILTER (WHERE action = 'click')::NUMERIC / COUNT(*) FILTER (WHERE action = 'search')::NUMERIC) * 100, 2)
      ELSE 0 END as conversion_rate
  FROM public.search_analytics WHERE created_at >= now() - (days || ' days')::INTERVAL;
$$;

-- ============================================================================
-- 27. GROUP_CHATS.SQL - Group chat system (COMPLETE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.group_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  avatar_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  reply_to_id UUID REFERENCES public.group_messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.group_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS public.group_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_reads ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_group_member(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE user_id = _user_id AND group_id = _group_id);
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE user_id = _user_id AND group_id = _group_id AND role = 'admin');
$$;

-- Group policies
DROP POLICY IF EXISTS "Group chats readable by members" ON public.group_chats;
CREATE POLICY "Group chats readable by members" ON public.group_chats FOR SELECT USING (is_group_member(auth.uid(), id));
DROP POLICY IF EXISTS "Users can create groups" ON public.group_chats;
CREATE POLICY "Users can create groups" ON public.group_chats FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Group admins can update" ON public.group_chats;
CREATE POLICY "Group admins can update" ON public.group_chats FOR UPDATE USING (is_group_admin(auth.uid(), id));
DROP POLICY IF EXISTS "Group admins can delete" ON public.group_chats;
CREATE POLICY "Group admins can delete" ON public.group_chats FOR DELETE USING (is_group_admin(auth.uid(), id) OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Group members readable by members" ON public.group_members;
CREATE POLICY "Group members readable by members" ON public.group_members FOR SELECT USING (is_group_member(auth.uid(), group_id));
DROP POLICY IF EXISTS "Admins can add members" ON public.group_members;
CREATE POLICY "Admins can add members" ON public.group_members FOR INSERT TO authenticated WITH CHECK (is_group_admin(auth.uid(), group_id) OR (SELECT created_by FROM group_chats WHERE id = group_id) = auth.uid());
DROP POLICY IF EXISTS "Members can leave" ON public.group_members;
CREATE POLICY "Members can leave" ON public.group_members FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can remove members" ON public.group_members;
CREATE POLICY "Admins can remove members" ON public.group_members FOR DELETE USING (is_group_admin(auth.uid(), group_id));

DROP POLICY IF EXISTS "Group messages readable by members" ON public.group_messages;
CREATE POLICY "Group messages readable by members" ON public.group_messages FOR SELECT USING (is_group_member(auth.uid(), group_id));
DROP POLICY IF EXISTS "Members can send messages" ON public.group_messages;
CREATE POLICY "Members can send messages" ON public.group_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND is_group_member(auth.uid(), group_id));
DROP POLICY IF EXISTS "Senders can update messages" ON public.group_messages;
CREATE POLICY "Senders can update messages" ON public.group_messages FOR UPDATE USING (auth.uid() = sender_id);
DROP POLICY IF EXISTS "Senders can delete messages" ON public.group_messages;
CREATE POLICY "Senders can delete messages" ON public.group_messages FOR DELETE USING (auth.uid() = sender_id OR is_group_admin(auth.uid(), group_id));

DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'group_messages';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.group_messages;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'group_members';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.group_members;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;

-- Auto-add creator as admin
CREATE OR REPLACE FUNCTION public.auto_add_group_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role) VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_group_created ON public.group_chats;
CREATE TRIGGER on_group_created AFTER INSERT ON public.group_chats FOR EACH ROW EXECUTE FUNCTION public.auto_add_group_admin();

-- ============================================================================
-- 27.5 DIRECT_MESSAGES TABLE (Missing - needs to be before DM_ADDITIONS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE,
  audio_url TEXT,
  image_url TEXT
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view DMs in their conversations" ON public.direct_messages;
CREATE POLICY "Users can view DMs in their conversations" ON public.direct_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can send DMs" ON public.direct_messages;
CREATE POLICY "Users can send DMs" ON public.direct_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Senders can delete DMs" ON public.direct_messages;
CREATE POLICY "Senders can delete DMs" ON public.direct_messages FOR DELETE
  USING (sender_id = auth.uid());

DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'direct_messages';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.direct_messages;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- 11.5 is_conversation_member function (needed before DM_ADDITIONS)
CREATE OR REPLACE FUNCTION public.is_conversation_member(_user_id UUID, _conversation_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = _conversation_id AND user_id = _user_id
  );
$$;

-- ============================================================================
-- 28. DM_ADDITIONS.SQL - Direct messages extras
-- ============================================================================

ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS audio_url text;
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS edited_at timestamptz;
ALTER TABLE public.direct_messages ADD COLUMN IF NOT EXISTS image_url text DEFAULT NULL;

DROP POLICY IF EXISTS "Senders can update own DM" ON public.direct_messages;
CREATE POLICY "Senders can update own DM" ON public.direct_messages FOR UPDATE TO authenticated USING (auth.uid() = sender_id) WITH CHECK (auth.uid() = sender_id);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-messages', 'voice-messages', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('dm-media', 'dm-media', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload voice" ON storage.objects;
CREATE POLICY "Users can upload voice" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'voice-messages' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Voice publicly readable" ON storage.objects;
CREATE POLICY "Voice publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'voice-messages');
DROP POLICY IF EXISTS "Users can delete voice" ON storage.objects;
CREATE POLICY "Users can delete voice" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'voice-messages' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can upload dm media" ON storage.objects;
CREATE POLICY "Users can upload dm media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'dm-media' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "DM media publicly readable" ON storage.objects;
CREATE POLICY "DM media publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'dm-media');
DROP POLICY IF EXISTS "Users can delete dm media" ON storage.objects;
CREATE POLICY "Users can delete dm media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'dm-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================================
-- 29-32. WATCH, LIKES, SAVED TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.watch_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL DEFAULT 'episode',
  item_id TEXT NOT NULL,
  progress_seconds INTEGER NOT NULL DEFAULT 0,
  total_seconds INTEGER,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE public.watch_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own watch progress" ON public.watch_progress;
CREATE POLICY "Users manage own watch progress" ON public.watch_progress FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, episode_number)
);

ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own watch history" ON public.watch_history;
CREATE POLICY "Users manage own watch history" ON public.watch_history FOR ALL USING (auth.uid() = user_id);

-- Post likes (FIXED with FK)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes readable" ON public.post_likes;
CREATE POLICY "Likes readable" ON public.post_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can like" ON public.post_likes;
CREATE POLICY "Users can like" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can unlike" ON public.post_likes;
CREATE POLICY "Users can unlike" ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'post_likes';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.post_likes;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;

-- Saved posts (FIXED with FK)
CREATE TABLE IF NOT EXISTS public.saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can save" ON public.saved_posts;
CREATE POLICY "Users can save" ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can unsave" ON public.saved_posts;
CREATE POLICY "Users can unsave" ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 33. NEWS_IMAGES STORAGE
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "News images readable" ON storage.objects;
CREATE POLICY "News images readable" ON storage.objects FOR SELECT USING (bucket_id = 'news-images');
DROP POLICY IF EXISTS "Admins upload news images" ON storage.objects;
CREATE POLICY "Admins upload news images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'news-images' AND has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins delete news images" ON storage.objects;
CREATE POLICY "Admins delete news images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'news-images' AND has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 34-35. COMMUNITY_INVITES & REPORTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.community_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL,
  invited_user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(community_id, invited_user_id)
);

ALTER TABLE public.community_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Invites viewable by involved" ON public.community_invites;
CREATE POLICY "Invites viewable by involved" ON public.community_invites FOR SELECT USING (auth.uid() = invited_by OR auth.uid() = invited_user_id OR has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Members can create invites" ON public.community_invites;
CREATE POLICY "Members can create invites" ON public.community_invites FOR INSERT WITH CHECK (auth.uid() = invited_by AND EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_invites.community_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL,
  reported_by UUID NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage reports" ON public.community_reports;
CREATE POLICY "Admins manage reports" ON public.community_reports FOR ALL USING (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Members can submit reports" ON public.community_reports;
CREATE POLICY "Members can submit reports" ON public.community_reports FOR INSERT WITH CHECK (auth.uid() = reported_by AND EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_reports.community_id AND user_id = auth.uid()));

-- ============================================================================
-- 36. FOLLOWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Follows readable" ON public.follows;
CREATE POLICY "Follows readable" ON public.follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can follow" ON public.follows;
CREATE POLICY "Users can follow" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'follows';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.follows;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.follows;

-- ============================================================================
-- 37. MESSAGE_REACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view reactions" ON public.message_reactions;
CREATE POLICY "Users view reactions" ON public.message_reactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.direct_messages dm WHERE dm.id = message_reactions.message_id AND is_conversation_member(auth.uid(), dm.conversation_id)));
DROP POLICY IF EXISTS "Users add reactions" ON public.message_reactions;
CREATE POLICY "Users add reactions" ON public.message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.direct_messages dm WHERE dm.id = message_reactions.message_id AND is_conversation_member(auth.uid(), dm.conversation_id)));
DROP POLICY IF EXISTS "Users remove reactions" ON public.message_reactions;
CREATE POLICY "Users remove reactions" ON public.message_reactions FOR DELETE USING (auth.uid() = user_id);
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'message_reactions';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.message_reactions;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;

-- ============================================================================
-- 38. PINNED_MESSAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pinned_dm_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  pinned_by UUID NOT NULL,
  pinned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, message_id)
);

CREATE TABLE IF NOT EXISTS public.pinned_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES public.group_messages(id) ON DELETE CASCADE,
  pinned_by UUID NOT NULL,
  pinned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, message_id)
);

ALTER TABLE public.pinned_dm_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pinned_group_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Conversation members view DM pins" ON public.pinned_dm_messages;
CREATE POLICY "Conversation members view DM pins" ON public.pinned_dm_messages FOR SELECT USING (is_conversation_member(auth.uid(), conversation_id));
DROP POLICY IF EXISTS "Conversation members pin DM" ON public.pinned_dm_messages;
CREATE POLICY "Conversation members pin DM" ON public.pinned_dm_messages FOR INSERT WITH CHECK (auth.uid() = pinned_by AND is_conversation_member(auth.uid(), conversation_id));
DROP POLICY IF EXISTS "Conversation members unpin DM" ON public.pinned_dm_messages;
CREATE POLICY "Conversation members unpin DM" ON public.pinned_dm_messages FOR DELETE USING (is_conversation_member(auth.uid(), conversation_id));

DROP POLICY IF EXISTS "Group members view pins" ON public.pinned_group_messages;
CREATE POLICY "Group members view pins" ON public.pinned_group_messages FOR SELECT USING (is_group_member(auth.uid(), group_id));
DROP POLICY IF EXISTS "Group members pin" ON public.pinned_group_messages;
CREATE POLICY "Group members pin" ON public.pinned_group_messages FOR INSERT WITH CHECK (auth.uid() = pinned_by AND is_group_member(auth.uid(), group_id));
DROP POLICY IF EXISTS "Group admins unpin" ON public.pinned_group_messages;
CREATE POLICY "Group admins unpin" ON public.pinned_group_messages FOR DELETE USING (is_group_admin(auth.uid(), group_id) OR auth.uid() = pinned_by);

-- ============================================================================
-- 39-44. NOTIFICATION TRIGGERS
-- ============================================================================

-- Add target_user_id
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_user_id UUID;

-- Community join notification
CREATE OR REPLACE FUNCTION public.notify_community_join()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _community_name TEXT;
  _joiner_name TEXT;
  _leader_id UUID;
BEGIN
  IF NEW.role = 'leader' THEN RETURN NEW; END IF;
  SELECT name, created_by INTO _community_name, _leader_id FROM public.communities WHERE id = NEW.community_id;
  SELECT display_name INTO _joiner_name FROM public.profiles WHERE user_id = NEW.user_id;
  INSERT INTO public.notifications (title, message, type, page_link, target_user_id)
  VALUES ('New Member', COALESCE(_joiner_name, 'Someone') || ' joined ' || COALESCE(_community_name, 'your community'), 'community', '/communities/' || NEW.community_id, _leader_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_community_member_join ON public.community_members;
CREATE TRIGGER on_community_member_join AFTER INSERT ON public.community_members FOR EACH ROW EXECUTE FUNCTION public.notify_community_join();

-- Follow notification
CREATE OR REPLACE FUNCTION public.notify_follow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _follower_name TEXT;
BEGIN
  SELECT display_name INTO _follower_name FROM public.profiles WHERE user_id = NEW.follower_id;
  INSERT INTO public.notifications (title, message, type, page_link, target_user_id)
  VALUES ('New Follower', COALESCE(_follower_name, 'Someone') || ' started following you', 'follow', '/u/' || NEW.follower_id::text, NEW.following_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_follow ON public.follows;
CREATE TRIGGER on_user_follow AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.notify_follow();

-- Community invite notification
CREATE OR REPLACE FUNCTION public.notify_community_invite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _community_name TEXT;
  _inviter_name TEXT;
BEGIN
  SELECT name INTO _community_name FROM public.communities WHERE id = NEW.community_id;
  SELECT display_name INTO _inviter_name FROM public.profiles WHERE user_id = NEW.invited_by;
  INSERT INTO public.notifications (title, message, type, page_link, target_user_id)
  VALUES ('Community Invite', COALESCE(_inviter_name, 'Someone') || ' invited you to ' || COALESCE(_community_name, 'a community'), 'invite', '/communities/' || NEW.community_id, NEW.invited_user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_community_invite ON public.community_invites;
CREATE TRIGGER on_community_invite AFTER INSERT ON public.community_invites FOR EACH ROW EXECUTE FUNCTION public.notify_community_invite();

-- Post like notification
CREATE OR REPLACE FUNCTION public.notify_post_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _post_author_id UUID;
  _liker_name TEXT;
BEGIN
  SELECT author_id INTO _post_author_id FROM public.community_posts WHERE id = NEW.post_id;
  IF _post_author_id = NEW.user_id THEN RETURN NEW; END IF;
  SELECT display_name INTO _liker_name FROM public.profiles WHERE user_id = NEW.user_id;
  INSERT INTO public.notifications (title, message, type, page_link, target_user_id)
  VALUES ('New Like', COALESCE(_liker_name, 'Someone') || ' liked your post', 'like', '/communities', _post_author_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_post_like ON public.post_likes;
CREATE TRIGGER on_post_like AFTER INSERT ON public.post_likes FOR EACH ROW EXECUTE FUNCTION public.notify_post_like();

-- ============================================================================
-- FINAL FIXES
-- ============================================================================

ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS guidelines TEXT DEFAULT '';
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

DROP POLICY IF EXISTS "Service functions can insert notifications" ON public.notifications;

-- ============================================================================
-- END OF COMPLETE COMBINED MIGRATIONS
-- ============================================================================
