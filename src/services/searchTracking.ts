import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export interface SearchTrackData {
  query: string;
  searchType?: "global" | "page" | "filter";
  category?: string;
  resultTitle?: string;
  resultPath?: string;
  action: "search" | "click" | "suggestion_click";
  resultPosition?: number;
  totalResults?: number;
}

// Generate a session ID for anonymous tracking
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("search_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("search_session_id", sessionId);
  }
  return sessionId;
};

// Track search action
export const trackSearch = async (data: SearchTrackData): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("search_analytics").insert({
      user_id: user?.id || null,
      session_id: sessionId,
      query: data.query,
      search_type: data.searchType || "global",
      category: data.category || null,
      result_title: data.resultTitle || null,
      result_path: data.resultPath || null,
      action: data.action,
      result_position: data.resultPosition || null,
      total_results: data.totalResults || null,
      user_agent: userAgent,
    });
  } catch (error) {
    // Silently fail - don't break user experience for analytics
    console.error("Failed to track search:", error);
  }
};

// React hook for search tracking
export const useSearchTracking = () => {
  const { user } = useAuth();

  const track = async (data: SearchTrackData): Promise<void> => {
    await trackSearch(data);
  };

  // Track a search query being entered
  const trackSearchQuery = async (
    query: string,
    totalResults: number,
    searchType: "global" | "page" | "filter" = "global"
  ): Promise<void> => {
    await track({
      query,
      searchType,
      action: "search",
      totalResults,
    });
  };

  // Track a click on a search result
  const trackResultClick = async (
    query: string,
    result: { title: string; path: string; category: string },
    position: number,
    totalResults: number,
    actionType: "click" | "suggestion_click" = "click"
  ): Promise<void> => {
    await track({
      query,
      category: result.category,
      resultTitle: result.title,
      resultPath: result.path,
      action: actionType,
      resultPosition: position,
      totalResults,
    });
  };

  return {
    track,
    trackSearchQuery,
    trackResultClick,
    isAuthenticated: !!user,
  };
};

// Get popular searches (for admin/analytics)
export const getPopularSearches = async (days: number = 7, limit: number = 10) => {
  const { data, error } = await supabase.rpc("get_popular_searches", {
    days,
    limit_count: limit,
  });

  if (error) {
    console.error("Failed to get popular searches:", error);
    return [];
  }

  return data || [];
};

// Get trending items (for admin/analytics)
export const getTrendingItems = async (days: number = 7, limit: number = 10) => {
  const { data, error } = await supabase.rpc("get_trending_items", {
    days,
    limit_count: limit,
  });

  if (error) {
    console.error("Failed to get trending items:", error);
    return [];
  }

  return data || [];
};

// Get search conversion rate (for admin/analytics)
export const getSearchConversionRate = async (days: number = 7) => {
  const { data, error } = await supabase.rpc("get_search_conversion_rate", {
    days,
  });

  if (error) {
    console.error("Failed to get conversion rate:", error);
    return { total_searches: 0, total_clicks: 0, conversion_rate: 0 };
  }

  return data?.[0] || { total_searches: 0, total_clicks: 0, conversion_rate: 0 };
};
