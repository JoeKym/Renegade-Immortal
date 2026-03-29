-- Search analytics table to track user searches and clicks
CREATE TABLE public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  query TEXT NOT NULL,
  search_type TEXT NOT NULL DEFAULT 'global', -- 'global', 'page', 'filter'
  category TEXT,
  result_title TEXT,
  result_path TEXT,
  action TEXT NOT NULL DEFAULT 'search', -- 'search', 'click', 'suggestion_click'
  result_position INTEGER,
  total_results INTEGER,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow authenticated users to insert their own search data
CREATE POLICY "Users can insert own search analytics" ON public.search_analytics FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to insert search data (for tracking without login)
CREATE POLICY "Anonymous users can insert search analytics" ON public.search_analytics FOR INSERT
  TO anon WITH CHECK (true);

-- Only admins can read search analytics
CREATE POLICY "Only admins can read search analytics" ON public.search_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for common queries
CREATE INDEX idx_search_analytics_user_id ON public.search_analytics(user_id);
CREATE INDEX idx_search_analytics_query ON public.search_analytics(query);
CREATE INDEX idx_search_analytics_created_at ON public.search_analytics(created_at);
CREATE INDEX idx_search_analytics_category ON public.search_analytics(category);

-- Function to get popular searches (last 7 days)
CREATE OR REPLACE FUNCTION public.get_popular_searches(days INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  query TEXT,
  search_count BIGINT,
  click_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    sa.query,
    COUNT(*) FILTER (WHERE sa.action = 'search') as search_count,
    COUNT(*) FILTER (WHERE sa.action = 'click') as click_count
  FROM public.search_analytics sa
  WHERE sa.created_at >= now() - (days || ' days')::INTERVAL
  GROUP BY sa.query
  ORDER BY search_count DESC
  LIMIT limit_count;
$$;

-- Function to get trending items (last 7 days)
CREATE OR REPLACE FUNCTION public.get_trending_items(days INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  item_title TEXT,
  item_path TEXT,
  item_category TEXT,
  click_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    sa.result_title as item_title,
    sa.result_path as item_path,
    sa.category as item_category,
    COUNT(*) as click_count
  FROM public.search_analytics sa
  WHERE sa.action = 'click'
    AND sa.created_at >= now() - (days || ' days')::INTERVAL
    AND sa.result_title IS NOT NULL
  GROUP BY sa.result_title, sa.result_path, sa.category
  ORDER BY click_count DESC
  LIMIT limit_count;
$$;

-- Function to get search conversion rate (searches vs clicks)
CREATE OR REPLACE FUNCTION public.get_search_conversion_rate(days INTEGER DEFAULT 7)
RETURNS TABLE (
  total_searches BIGINT,
  total_clicks BIGINT,
  conversion_rate NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) FILTER (WHERE action = 'search') as total_searches,
    COUNT(*) FILTER (WHERE action = 'click') as total_clicks,
    CASE 
      WHEN COUNT(*) FILTER (WHERE action = 'search') > 0 
      THEN ROUND(
        (COUNT(*) FILTER (WHERE action = 'click')::NUMERIC / 
         COUNT(*) FILTER (WHERE action = 'search')::NUMERIC) * 100, 2
      )
      ELSE 0
    END as conversion_rate
  FROM public.search_analytics
  WHERE created_at >= now() - (days || ' days')::INTERVAL;
$$;
