import { useState, useEffect, useMemo } from "react";
import { DONGHUA_SERIES, DonghuaSeries } from "@/data/donghuaData";
import { proxyImageUrl } from "@/lib/utils";

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

interface JikanTitleEntry {
  title?: string;
}

interface JikanAnimeEntry {
  episodes?: number;
  title?: string;
  title_english?: string;
  titles?: JikanTitleEntry[];
  airing?: boolean;
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
        const canonicalTerms = [
          series?.title,
          series?.searchQuery,
          series?.anilistSearch,
          ...(series?.aliases || []),
        ]
          .filter(Boolean)
          .map((term) => String(term).toLowerCase());

        const titleMatchScore = (names: string[]) => {
          const lowered = names.map((n) => n.toLowerCase());
          let score = 0;
          for (const name of lowered) {
            for (const term of canonicalTerms) {
              if (name === term) score += 6;
              else if (name.includes(term)) score += 3;
              else if (term.includes(name)) score += 1;
            }
          }
          return score;
        };

        const releasedFromAni = (m: AniListData) => {
          if (m.nextAiringEpisode?.episode) return Math.max(0, m.nextAiringEpisode.episode - 1);
          return m.episodes || 0;
        };

        const pickBestAniMatch = (items: AniListData[]) => {
          return items
            .map((item) => {
              const names = [item.title?.romaji, item.title?.english, item.title?.native].filter(Boolean) as string[];
              const score = titleMatchScore(names);
              const released = releasedFromAni(item);
              const isReleasing = item.status === "RELEASING" ? 1 : 0;
              return { item, score, released, isReleasing };
            })
            .sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score;
              if (b.isReleasing !== a.isReleasing) return b.isReleasing - a.isReleasing;
              return b.released - a.released;
            })[0]?.item || null;
        };

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
        
        const primary = pickBestAniMatch(mediaList);

        if (!primary) {
          setError(`Could not find data for "${series.title}".`);
          return;
        }

        let jikanTotal = 0;
        try {
          const jRes = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(series?.jikanSearch || "")}&limit=10`
          );
          if (jRes.ok) {
            const jData = await jRes.json();
            const jList = jData?.data || [];
            const jBest = jList
              .map((entry: JikanAnimeEntry) => {
                const altTitles = (entry.titles || []).map((t: JikanTitleEntry) => t.title).filter(Boolean) as string[];
                const names = [entry.title, entry.title_english, ...altTitles].filter(Boolean) as string[];
                const score = titleMatchScore(names);
                const releasingBonus = entry.airing ? 1 : 0;
                return { entry, score, releasingBonus, episodes: entry.episodes || 0 };
              })
              .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                if (b.releasingBonus !== a.releasingBonus) return b.releasingBonus - a.releasingBonus;
                return b.episodes - a.episodes;
              })[0]?.entry;
            jikanTotal = jBest?.episodes || 0;
          }
        } catch (_err) {
        }

        // --- Next-Episode.net integration for authoritative episode count & release dates
        let nextEpTotal = 0;
        let nextEpNextAiring: { airingAt: number; episode: number } | null = null;
        if (series.nextEpisodeSlug) {
            try {
                const nextEpRes = await fetch(
                    `https://next-episode.net/anime/${encodeURIComponent(series.nextEpisodeSlug)}`,
                    { headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                    }
                });
                if (nextEpRes.ok) {
                    const html = await nextEpRes.text();
                    const totalEpMatch =
                      html.match(/Total.*?(\d+)\s*episodes/i) ||
                      html.match(/<span[^>]*total.*?<\/span>.*?(\d+)\s*episodes?/is) ||
                      html.match(/(\d+)\s*episodes?\s*(?:\(.*?\))?\s*Total/is);
                    if (totalEpMatch) nextEpTotal = parseInt(totalEpMatch[1], 10) || 0;

                    const nextRowStart = html.match(/Next.*?Episode/i);
                    let nextHtmlSlice = nextRowStart
                      ? html.slice(nextRowStart.index || 0, Math.min(html.length, (nextRowStart.index || 0) + 2500))
                      : html.slice(0, 3000);

                    const epMatch =
                      nextHtmlSlice.match(/(?:Next.*?Episode|Episode)\s*(?:Nr\.?|#)?\s*(\d+)/i) ||
                      nextHtmlSlice.match(/Next.*?(\d+)/is);
                    const dateMatch =
                      nextHtmlSlice.match(/(\d{4}-\d{2}-\d{2})/) ||
                      nextHtmlSlice.match(/((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})/i);

                    if (epMatch && dateMatch) {
                        const candidateDate = new Date(dateMatch[0]);
                        if (Number.isFinite(candidateDate.getTime())) {
                            nextEpNextAiring = {
                                episode: parseInt(epMatch[1], 10),
                                airingAt: Math.floor(candidateDate.getTime() / 1000),
                            };
                        }
                    }
                }
            } catch (_neErr) {
            }
        }

        const bestTotal = Math.max(
            series?.knownTotalEpisodes || 0,
            primary.episodes || 0,
            jikanTotal,
            nextEpTotal
        );
        let bestNextAiring = primary.nextAiringEpisode;
        if (nextEpNextAiring) {
            bestNextAiring = {
                ...nextEpNextAiring,
                timeUntilAiring: Math.max(0, Math.floor((nextEpNextAiring.airingAt * 1000 - Date.now()) / 1000)),
            };
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
    const known = series?.knownTotalEpisodes || 0;
    if (!aniData) return known;
    const aniCount = aniData.nextAiringEpisode
      ? Math.max(0, aniData.nextAiringEpisode.episode - 1)
      : aniData.episodes || 0;
    return Math.max(known, aniCount);
  }, [aniData, series]);

  const allEpisodes = useMemo(() => {
    if (releasedCount === 0) return [];
    const fallbackThumbnail = aniData?.coverImage?.large || aniData?.coverImage?.medium || series?.thumbnail || "";
    
    const thumbMap = new Map<number, string>();
    aniData?.streamingEpisodes?.forEach(se => {
        const match = se.title?.match(/Episode\s+(\d+)/i);
        if (match) thumbMap.set(parseInt(match[1]), se.thumbnail);
    });

    return Array.from({ length: releasedCount }, (_, i) => {
      const num = i + 1;
      let thumbUrl = thumbMap.get(num) || fallbackThumbnail;
      return {
        number: num,
        thumbnail: proxyImageUrl(thumbUrl),
        description: `Episode ${num}`
      };
    });
  }, [releasedCount, aniData, series]);

  return { series, aniData, loading, error, countdown, releasedCount, allEpisodes };
}
