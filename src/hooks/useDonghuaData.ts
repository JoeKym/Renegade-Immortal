import { useState, useEffect, useMemo } from "react";
import { DONGHUA_SERIES, DonghuaSeries } from "@/data/donghuaData";

export interface AniListData {
  id: number;
  title: { romaji: string; english: string | null; native: string };
  episodes: number | null;
  nextAiringEpisode: { airingAt: number; episode: number; timeUntilAiring: number } | null;
  status: string;
  averageScore: number | null;
  meanScore: number | null;
  coverImage: { extraLarge: string; large: string; medium: string };
  bannerImage: string | null;
  description: string | null;
  genres: string[];
  streamingEpisodes: { title: string; thumbnail: string; url: string; site: string }[] | null;
  studios: { nodes: { name: string }[] };
  trailer?: { id: string; site: string } | null;
}

const ANILIST_QUERY = `
  query ($search: String) {
    Page(perPage: 10) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
        id
        title { romaji english native }
        episodes
        nextAiringEpisode { airingAt episode timeUntilAiring }
        status
        averageScore
        meanScore
        description(asHtml: false)
        coverImage { extraLarge large medium }
        bannerImage
        genres
        studios { nodes { name } }
        streamingEpisodes { title thumbnail url site }
        trailer { id site }
      }
    }
  }
`;

function formatTimeUntil(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function useDonghuaData(seriesId: string | undefined) {
  const [aniData, setAniData] = useState<AniListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  const series = useMemo(() => 
    DONGHUA_SERIES.find(d => d.id === seriesId), 
    [seriesId]
  );

  useEffect(() => {
    if (!series) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let aniRes = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ 
            query: ANILIST_QUERY,
            variables: { search: series?.anilistSearch }
          }),
        });
        let aniJson = aniRes.ok ? await aniRes.json() : null;
        let mediaList: AniListData[] = aniJson?.data?.Page?.media || [];

        // Fallback search if pinyin title returns no results
        if (mediaList.length === 0 && series?.title) {
            aniRes = await fetch("https://graphql.anilist.co", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ 
                    query: ANILIST_QUERY,
                    variables: { search: series.title }
                }),
            });
            aniJson = aniRes.ok ? await aniRes.json() : null;
            mediaList = aniJson?.data?.Page?.media || [];
        }
        
        // Improved matching logic
        let primary: AniListData | null = null;
        
        if (series?.id === "renegade-immortal") {
            primary = mediaList.find(m => {
                const names = [m.title?.romaji, m.title?.english, m.title?.native].filter(Boolean).join(" ").toLowerCase();
                return names.includes("xian ni") || names.includes("renegade immortal") || names.includes("仙逆");
            }) || mediaList[0];
        } else if (series) {
            // Find the best match by comparing search query or titles
            primary = mediaList.find(m => {
                const searchLower = series.anilistSearch.toLowerCase();
                const titleLower = series.title.toLowerCase();
                const names = [m.title?.romaji, m.title?.english, m.title?.native].filter(Boolean).map(n => n.toLowerCase());
                return names.some(n => n.includes(searchLower)) || 
                       names.some(n => n.includes(titleLower)) ||
                       searchLower.includes(m.title.romaji.toLowerCase()) ||
                       titleLower.includes(m.title.romaji.toLowerCase());
            }) || mediaList[0];
        }

        if (!primary) {
          setError(`Could not find data for "${series.title}".`);
          return;
        }

        // Fetch additional data from Jikan with better query
        let jikanTotal = 0;
        try {
          const jRes = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(series?.jikanSearch || "")}&limit=10`
          );
          if (jRes.ok) {
            const jData = await jRes.json();
            const jList = jData?.data || [];
            // Find best Jikan match
            const jBest = jList.find((a: any) => {
                const searchLower = series.jikanSearch.toLowerCase();
                const names = [a.title, a.title_english, ...a.titles.map((t: any) => t.title)].filter(Boolean).map(n => n.toLowerCase());
                return names.some(n => n.includes(searchLower));
            }) || jList[0];
            jikanTotal = jBest?.episodes || 0;
          }
        } catch (_) {}

        // Episode count logic
        let bestTotal = Math.max(primary.episodes || 0, jikanTotal);
        let bestNextAiring = primary.nextAiringEpisode;

        // Special logic for RELEASING series to estimate total count
        if (primary.status === "RELEASING" && primary.nextAiringEpisode) {
            bestTotal = Math.max(bestTotal, primary.nextAiringEpisode.episode - 1);
        }

        // Special logic for Renegade Immortal release cycles
        if (series?.id === "renegade-immortal") {
            const now = Date.now();
            // EP 131 was released around March 2, 2026 based on previous context, let's adjust
            const EP_131_RELEASE = new Date("2026-03-02T03:00:00Z").getTime(); 
            const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
            const weeksSince131 = Math.floor((now - EP_131_RELEASE) / ONE_WEEK);
            const mostRecentReleaseTime = EP_131_RELEASE + (weeksSince131 * ONE_WEEK);
            
            let KNOWN_RELEASED = now >= mostRecentReleaseTime ? 131 + weeksSince131 : 131 + weeksSince131 - 1;
            let nextReleaseTime = now >= mostRecentReleaseTime ? mostRecentReleaseTime + ONE_WEEK : mostRecentReleaseTime;
            
            bestTotal = Math.max(bestTotal, KNOWN_RELEASED);
            if (!bestNextAiring || Math.abs(bestNextAiring.airingAt * 1000 - nextReleaseTime) > ONE_WEEK) {
                bestNextAiring = {
                    airingAt: Math.floor(nextReleaseTime / 1000),
                    episode: KNOWN_RELEASED + 1,
                    timeUntilAiring: Math.max(0, Math.floor((nextReleaseTime - now) / 1000))
                };
            }
        } else if (primary.status === "RELEASING") {
            // For other releasing series, if AniList count is 26 but it's clearly more
            // we can try to use the nextAiringEpisode as the source of truth for count
            if (primary.nextAiringEpisode) {
                bestTotal = Math.max(bestTotal, primary.nextAiringEpisode.episode - 1);
            }
        }

        setAniData({
          ...primary,
          episodes: bestTotal || primary.episodes,
          nextAiringEpisode: bestNextAiring,
        });
      } catch (e) {
        console.error("Data fetch failed:", e);
        setError("Failed to load show data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [series]);

  // Countdown timer
  useEffect(() => {
    if (!aniData?.nextAiringEpisode) return;
    
    const updateCountdown = () => {
      const now = Date.now();
      const airingAt = aniData.nextAiringEpisode!.airingAt * 1000;
      const timeUntil = Math.max(0, Math.floor((airingAt - now) / 1000));
      setCountdown(formatTimeUntil(timeUntil));
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [aniData?.nextAiringEpisode]);

  const releasedCount = useMemo(() => {
    if (!aniData) return 0;
    if (aniData.nextAiringEpisode) return aniData.nextAiringEpisode.episode - 1;
    return aniData.episodes || 0;
  }, [aniData]);

  const allEpisodes = useMemo(() => {
    if (releasedCount === 0) return [];
    // Use series.thumbnail as the ultimate fallback if AniList images are broken
    const fallbackThumbnail = aniData?.coverImage?.large || aniData?.coverImage?.medium || series?.thumbnail;
    
    // Map existing streaming thumbnails if available
    const thumbMap = new Map<number, string>();
    aniData?.streamingEpisodes?.forEach(se => {
        const match = se.title?.match(/Episode\s+(\d+)/i);
        if (match) thumbMap.set(parseInt(match[1]), se.thumbnail);
    });

    return Array.from({ length: releasedCount }, (_, i) => {
      const num = i + 1;
      return {
        number: num,
        thumbnail: thumbMap.get(num) || fallbackThumbnail || "",
        description: `Episode ${num}`
      };
    });
  }, [releasedCount, aniData, series]);

  return { series, aniData, loading, error, countdown, releasedCount, allEpisodes };
}
