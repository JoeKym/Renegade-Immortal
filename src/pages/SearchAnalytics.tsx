import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getPopularSearches,
  getTrendingItems,
  getSearchConversionRate,
} from "@/services/searchTracking";
import { Search, TrendingUp, MousePointer, BarChart3 } from "lucide-react";

interface PopularSearch {
  query: string;
  search_count: number;
  click_count: number;
}

interface TrendingItem {
  item_title: string;
  item_path: string;
  item_category: string;
  click_count: number;
}

interface ConversionRate {
  total_searches: number;
  total_clicks: number;
  conversion_rate: number;
}

export default function SearchAnalytics() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [conversionRate, setConversionRate] = useState<ConversionRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }

    loadAnalytics();
  }, [user, isAdmin, navigate]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [searches, items, conversion] = await Promise.all([
        getPopularSearches(7, 10),
        getTrendingItems(7, 10),
        getSearchConversionRate(7),
      ]);
      setPopularSearches(searches);
      setTrendingItems(items);
      setConversionRate(conversion);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      toast.error("Failed to load search analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Loading analytics...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="font-heading text-3xl text-primary mb-8 tracking-wider">
          Search Analytics
        </h1>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Searches (7d)</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionRate?.total_searches.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks (7d)</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionRate?.total_clicks.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionRate?.conversion_rate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Clicks per search
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Popular Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Popular Searches (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {popularSearches.length === 0 ? (
                <p className="text-muted-foreground text-sm">No search data yet</p>
              ) : (
                <div className="space-y-3">
                  {popularSearches.map((search, index) => (
                    <div
                      key={search.query}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <span className="font-medium">{search.query}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {search.search_count} searches
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {search.click_count} clicks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trending Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Items (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trendingItems.length === 0 ? (
                <p className="text-muted-foreground text-sm">No click data yet</p>
              ) : (
                <div className="space-y-3">
                  {trendingItems.map((item, index) => (
                    <div
                      key={`${item.item_title}-${index}`}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-medium">{item.item_title}</div>
                          <div className="text-xs text-primary">{item.item_category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {item.click_count} clicks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
