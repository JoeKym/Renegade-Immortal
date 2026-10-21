import { useState, useEffect, useMemo } from "react";
import { DONGHUA_SERIES, DonghuaSeries } from "@/data/donghuaData";
import { proxyImageUrl } from "@/lib/utils";
import { shouldShowReleaseCountdown } from "@/lib/donghuaStatus";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

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

interface JikanAnimeEntry {
  episodes?: number | null;
  title?: string;
  title_english?: string | null;
  titles?: { title?: string }[];
  airing?: boolean;
}

interface NextAiring {
  episode: number;
  airingAt: number; // unix seconds
}

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const ANILIST_URL = "https://graphql.anilist.co";
const JIKAN_URL = "https://api.jikan.moe/v4/anime";
const NEXT_EPISODE_URL = "https://next-episode.net";
const FALLBACK_TOTAL_EPISODES = 52;
const COUNTDOWN_TICK_MS = 60_000;

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

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";

/* -------------------------------------------------------------------------- */
/*                               Pure utilities                               */
/* -------------------------------------------------------------------------- */

export function formatTimeUntil(seconds: number): string {
  const d = Math.floor(seconds / 86_400);
  const h = Math.floor((seconds % 86_400) / 3_600);
  const m = Math.floor((seconds % 3_600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const isAbortError = (err: unknown) => err instanceof DOMException && err.name === "AbortError";

const isNonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

/** Lower-cased search terms that identify a series. */
function buildCanonicalTerms(series: DonghuaSeries): string[] {
  return [series.title, series.searchQuery, series.anilistSearch, ...(series.aliases ?? [])]
    .filter(isNonEmpty)
    .map((t) => t.toLowerCase());
}

/** How well a list of candidate names matches the series' canonical terms. */
function scoreTitleMatch(names: (string | null | undefined)[], terms: string[]): number {
  let score = 0;
  for (const raw of names) {
    if (!isNonEmpty(raw)) continue;
    const name = raw.toLowerCase();
    for (const term of terms) {
      if (name === term) score += 6;
      else if (name.includes(term)) score += 3;
      else if (term.includes(name)) score += 1;
    }
  }
  return score;
}

/** Item with the highest score; ties are broken by `tieBreak` values (higher wins, in order). */
function pickBest<T>(
  items: T[],
  getScore: (item: T) => number,
  tieBreak: (item: T) => number[]
): T | null {
  const compare = (a: number[], b: number[]) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  };

  let best: T | null = null;
  let bestKey: number[] = [];

  for (const item of items) {
    const key = [getScore(item), ...tieBreak(item)];
    if (best === null || compare(key, bestKey) > 0) {
      best = item;
      bestKey = key;
    }
  }
  return best;
}

/** Episodes already released according to AniList. */
function releasedFromAni(m: Pick<AniListData, "nextAiringEpisode" | "episodes">): number {
  if (m.nextAiringEpisode?.episode) return Math.max(0, m.nextAiringEpisode.episode - 1);
  return m.episodes ?? 0;
}

/** Local placeholder used when every external source fails. */
function buildFallbackProfile(series: DonghuaSeries): AniListData {
  return {
    id: 0,
    title: { romaji: series.title, english: series.title, native: "" },
    episodes: series.knownTotalEpisodes || FALLBACK_TOTAL_EPISODES,
    nextAiringEpisode: null,
    status: "FINISHED",
    averageScore: null,
    meanScore: null,
    coverImage: {
      extraLarge: series.thumbnail,
      large: series.thumbnail,
      medium: series.thumbnail,
    },
    bannerImage: null,
    description: "Archive metadata temporarily loading directly from local data modules.",
    genres: [],
    streamingEpisodes: [],
    studios: { nodes: [] },
  };
}

/* -------------------------------------------------------------------------- */
/*                               Data sources                                 */
/* -------------------------------------------------------------------------- */

async function queryAniList(search: string, signal: AbortSignal): Promise<AniListData[]> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: ANILIST_QUERY, variables: { search } }),
    signal,
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json?.data?.Page?.media ?? [];
}

/**
 * Tries the dedicated AniList search term first, then falls back to the title.
 * Throws only on network-level failure so the caller can flag an outage.
 */
async function fetchAniListMatch(
  series: DonghuaSeries,
  terms: string[],
  signal: AbortSignal
): Promise<AniListData | null> {
  const searches = [series.anilistSearch, series.title].filter(isNonEmpty);
  const uniqueSearches = [...new Set(searches)];

  for (const search of uniqueSearches) {
    const media = await queryAniList(search, signal);
    if (media.length === 0) continue;

    return pickBest(
      media,
      (m) => scoreTitleMatch([m.title?.romaji, m.title?.english, m.title?.native], terms),
      (m) => [m.status === "RELEASING" ? 1 : 0, releasedFromAni(m)]
    );
  }
  return null;
}

/** Total episode count according to Jikan (MyAnimeList). Never throws. */
async function fetchJikanTotal(
  series: DonghuaSeries,
  terms: string[],
  signal: AbortSignal
): Promise<number> {
  if (!isNonEmpty(series.jikanSearch)) return 0;

  try {
    const url = `${JIKAN_URL}?q=${encodeURIComponent(series.jikanSearch)}&limit=10`;
    const res = await fetch(url, { signal });
    if (!res.ok) return 0;

    const json = await res.json();
    const list: JikanAnimeEntry[] = json?.data ?? [];

    const best = pickBest(
      list,
      (e) =>
        scoreTitleMatch(
          [e.title, e.title_english, ...(e.titles ?? []).map((t) => t.title)],
          terms
        ),
      (e) => [e.airing ? 1 : 0, e.episodes ?? 0]
    );
    return best?.episodes ?? 0;
  } catch (err) {
    if (isAbortError(err)) throw err;
    return 0;
  }
}

/** Pulls total episodes + next airing out of a next-episode.net page. */
function parseNextEpisodeHtml(html: string): { total: number; next: NextAiring | null } {
  const totalMatch =
    html.match(/Total.*?(\d+)\s*episodes/i) ||
    html.match(/<span[^>]*total.*?<\/span>.*?(\d+)\s*episodes?/is) ||
    html.match(/(\d+)\s*episodes?\s*(?:\(.*?\))?\s*Total/is);
  const total = totalMatch ? parseInt(totalMatch[1], 10) || 0 : 0;

  const nextStart = html.match(/Next.*?Episode/i);
  const start = nextStart?.index ?? 0;
  const slice = nextStart ? html.slice(start, start + 2_500) : html.slice(0, 3_000);

  const epMatch =
    slice.match(/(?:Next.*?Episode|Episode)\s*(?:Nr\.?|#)?\s*(\d+)/i) ||
    slice.match(/Next.*?(\d+)/is);
  const dateMatch =
    slice.match(/(\d{4}-\d{2}-\d{2})/) ||
    slice.match(new RegExp(`((?:${MONTHS})\\s+\\d{1,2},?\\s+\\d{4})`, "i"));

  if (!epMatch || !dateMatch) return { total, next: null };

  const date = new Date(dateMatch[0]);
  if (!Number.isFinite(date.getTime())) return { total, next: null };

  return {
    total,
    next: { episode: parseInt(epMatch[1], 10), airingAt: Math.floor(date.getTime() / 1000) },
  };
}

/**
 * Scrapes next-episode.net. Never throws (except on abort).
 * NOTE: browsers block this cross-origin request (CORS) and forbid setting
 * User-Agent, so route it through your own proxy/edge function in production.
 */
async function fetchNextEpisode(
  series: DonghuaSeries,
  signal: AbortSignal
): Promise<{ total: number; next: NextAiring | null }> {
  const empty = { total: 0, next: null };
  if (!isNonEmpty(series.nextEpisodeSlug)) return empty;

  try {
    const res = await fetch(`${NEXT_EPISODE_URL}/${encodeURIComponent(series.nextEpisodeSlug)}`, {
      headers: { Accept: "text/html,application/xhtml+xml" },
      signal,
    });
    if (!res.ok) return empty;
    return parseNextEpisodeHtml(await res.text());
  } catch (err) {
    if (isAbortError(err)) throw err;
    return empty;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Hook                                    */
/* -------------------------------------------------------------------------- */

export function useDonghuaData(seriesId: string | undefined) {
  const [aniData, setAniData] = useState<AniListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  const series = useMemo(() => DONGHUA_SERIES.find((d) => d.id === seriesId), [seriesId]);

  /* ----------------------------- Data fetching ----------------------------- */
  useEffect(() => {
    if (!series) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    async function load(s: DonghuaSeries) {
      setLoading(true);
      setError(null);

      try {
        const terms = buildCanonicalTerms(s);

        // All three sources are independent, so run them in parallel.
        const [aniResult, jikanTotal, nextEp] = await Promise.all([
          fetchAniListMatch(s, terms, signal).then(
            (match) => ({ match, failed: false }),
            (err) => {
              if (isAbortError(err)) throw err;
              console.warn("AniList unreachable or blocked, using local fallback.", err);
              return { match: null, failed: true };
            }
          ),
          fetchJikanTotal(s, terms, signal),
          fetchNextEpisode(s, signal),
        ]);

        if (signal.aborted) return;

        const primary = aniResult.match ?? buildFallbackProfile(s);
        const usedFallback = aniResult.match === null;

        const countdownAllowed = shouldShowReleaseCountdown(s, primary.status);

        const bestTotal = Math.max(
          s.knownTotalEpisodes || 0,
          primary.episodes || 0,
          jikanTotal,
          nextEp.total
        );

        let nextAiringEpisode: AniListData["nextAiringEpisode"] = null;
        if (countdownAllowed) {
          const source = nextEp.next ?? primary.nextAiringEpisode;
          if (source) {
            nextAiringEpisode = {
              airingAt: source.airingAt,
              episode: source.episode,
              timeUntilAiring: Math.max(0, Math.floor(source.airingAt - Date.now() / 1000)),
            };
          }
        }

        setAniData({
          ...primary,
          episodes: bestTotal || primary.episodes,
          nextAiringEpisode,
        });

        if (usedFallback) setError("API Partial Outage");
      } catch (err) {
        if (isAbortError(err)) return;
        console.error("Critical failure in donghua data handler:", err);
        setError("Failed to load show data.");
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    load(series);
    return () => controller.abort();
  }, [series]);

  /* ------------------------------- Countdown ------------------------------- */
  const airingAt = aniData?.nextAiringEpisode?.airingAt;

  useEffect(() => {
    if (!airingAt) {
      setCountdown("");
      return;
    }

    const tick = () => {
      const secondsLeft = Math.max(0, Math.floor(airingAt - Date.now() / 1000));
      setCountdown(formatTimeUntil(secondsLeft));
    };

    tick();
    const id = setInterval(tick, COUNTDOWN_TICK_MS);
    return () => clearInterval(id);
  }, [airingAt]);

  /* ------------------------------- Derived data ---------------------------- */
  const releasedCount = useMemo(() => {
    const known = series?.knownTotalEpisodes || 0;
    if (!aniData) return known;

    const aniCount =
      aniData.nextAiringEpisode && shouldShowReleaseCountdown(series, aniData.status)
        ? Math.max(0, aniData.nextAiringEpisode.episode - 1)
        : aniData.episodes || 0;

    return Math.max(known, aniCount);
  }, [aniData, series]);

  const allEpisodes = useMemo(() => {
    if (releasedCount === 0) return [];

    const fallbackThumb =
      aniData?.coverImage?.large || aniData?.coverImage?.medium || series?.thumbnail || "";

    const thumbs = new Map<number, string>();
    aniData?.streamingEpisodes?.forEach((ep) => {
      const match = ep.title?.match(/Episode\s+(\d+)/i);
      if (match && ep.thumbnail) thumbs.set(parseInt(match[1], 10), ep.thumbnail);
    });

    return Array.from({ length: releasedCount }, (_, i) => {
      const number = i + 1;
      return {
        number,
        thumbnail: proxyImageUrl(thumbs.get(number) ?? fallbackThumb),
        description: `Episode ${number}`,
      };
    });
  }, [releasedCount, aniData, series]);

  return { series, aniData, loading, error, countdown, releasedCount, allEpisodes };
}
