-- COMBINED MIGRATIONS - Run this in Supabase SQL Editor in order
-- All 36 migrations combined into one file with correct dependencies

-- 1. comments.sql (first - no dependencies)
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous Cultivator',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are publicly readable" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can post comments" ON public.comments FOR INSERT WITH CHECK (
  length(content) > 0 AND length(content) <= 1000 AND
  length(author_name) > 0 AND length(author_name) <= 50
);

CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'lore',
  page_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications are publicly readable" ON public.notifications FOR SELECT USING (true);

CREATE TABLE public.active_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  current_page TEXT NOT NULL DEFAULT '/',
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.active_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors are publicly readable" ON public.active_visitors FOR SELECT USING (true);
CREATE POLICY "Anyone can register as visitor" ON public.active_visitors FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.cleanup_stale_visitors()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.active_visitors WHERE last_seen < now() - interval '5 minutes';
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_visitors;

-- 2. profiles.sql (depends on comments for user_id column)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Cultivator'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.comments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- 3. roles.sql (creates has_role function)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL DEFAULT '/',
  session_id TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (length(session_id) > 0 AND length(page_path) > 0);
CREATE POLICY "Admins can read page views" ON public.page_views FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete comments" ON public.comments FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete notifications" ON public.notifications FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;

-- 4. admin_policies.sql (depends on has_role function)
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 5. suspensions.sql
CREATE TABLE public.user_suspensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('suspended', 'banned')),
  reason text NOT NULL DEFAULT '',
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage suspensions" ON public.user_suspensions FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
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
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_suspensions;

-- 6. reviews.sql
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  author_name text NOT NULL DEFAULT 'Anonymous Cultivator',
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  page_path text NOT NULL DEFAULT '/',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post reviews" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND length(content) > 0 AND length(content) <= 500 AND length(author_name) > 0 AND length(author_name) <= 50);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- 7. appeals.sql
CREATE TABLE public.appeals (
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
CREATE POLICY "Anyone can submit appeals" ON public.appeals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND length(message) > 0 AND length(message) <= 2000);
CREATE POLICY "Users can read own appeals" ON public.appeals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all appeals" ON public.appeals FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update appeals" ON public.appeals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete appeals" ON public.appeals FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
ALTER PUBLICATION supabase_realtime ADD TABLE public.appeals;

-- 8. seed_admin.sql (replace with your admin user ID)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR-USER-ID-HERE', 'admin') ON CONFLICT DO NOTHING;

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
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- 12. conversation_policies.sql
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid()));
CREATE POLICY "Users can view participants" ON public.conversation_participants FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));

-- 13. messages.sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid()));
CREATE POLICY "Senders can update messages" ON public.messages FOR UPDATE
  USING (sender_id = auth.uid()) WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Senders can delete messages" ON public.messages FOR DELETE
  USING (sender_id = auth.uid());
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 14. communities.sql
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  avatar_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities are publicly readable" ON public.communities FOR SELECT USING (true);

-- 15. community_members.sql
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(community_id, user_id)
);
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members are viewable by community members" ON public.community_members FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_id AND user_id = auth.uid()));

-- 16. community_posts.sql
CREATE TABLE public.community_posts (
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

CREATE POLICY "Members can read posts" ON public.community_posts FOR SELECT
  USING (is_community_member(auth.uid(), community_id));
CREATE POLICY "Members can create posts" ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id AND is_community_member(auth.uid(), community_id));
CREATE POLICY "Authors can update posts" ON public.community_posts FOR UPDATE
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can delete posts" ON public.community_posts FOR DELETE
  USING (auth.uid() = author_id OR is_community_member(auth.uid(), community_id));
CREATE POLICY "Admins can manage communities" ON public.communities FOR ALL
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage members" ON public.community_members FOR ALL
  USING (has_role(auth.uid(), 'admin'));
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;

-- 19. watch_history.sql
CREATE TABLE public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, episode_number)
);
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own watch history" ON public.watch_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own watch history" ON public.watch_history FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 20-21. likes_votes.sql and saved_posts.sql
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can save posts" ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave posts" ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);

-- 22-25. news tables combined
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News is publicly readable" ON public.news FOR SELECT USING (true);
CREATE POLICY "Admins can create news" ON public.news FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update news" ON public.news FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete news" ON public.news FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 26. search_analytics.sql
CREATE TABLE public.search_analytics (
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
CREATE POLICY "Users can insert own search analytics" ON public.search_analytics FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anonymous users can insert search analytics" ON public.search_analytics FOR INSERT
  TO anon WITH CHECK (true);
CREATE POLICY "Only admins can read search analytics" ON public.search_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
CREATE INDEX idx_search_analytics_user_id ON public.search_analytics(user_id);
CREATE INDEX idx_search_analytics_query ON public.search_analytics(query);
CREATE INDEX idx_search_analytics_created_at ON public.search_analytics(created_at);
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
