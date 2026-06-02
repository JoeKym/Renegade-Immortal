import { supabase } from "@/integrations/supabase/client";
import type { AniListData } from "@/hooks/useDonghuaData";
import type { DonghuaSeries } from "@/data/donghuaData";

const DAY_MS = 24 * 60 * 60 * 1000;
const RELEASING_SYNC_MS = 6 * 60 * 60 * 1000;
const CACHE_KEY_PREFIX = "donghua_release_meta_v1";
const GLOBAL_SYNC_KEY = "donghua_release_meta_global_sync_v1";

export interface ReleaseMetadata {
  totalEpisodes: number;
  premiered: string | null;
  nextEpisode: number | null;
  nextAiringAt: number | null;
  source: "next-episode" | "anilist" | "jikan";
  updatedAt: number;
}

function cacheKey(seriesId: string) {
  return `${CACHE_KEY_PREFIX}:${seriesId}`;
}

function parseCached(seriesId: string): ReleaseMetadata | null {
  try {
    const raw = localStorage.getItem(cacheKey(seriesId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReleaseMetadata;
    if (!parsed?.updatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCached(seriesId: string, payload: ReleaseMetadata) {
  try {
    localStorage.setItem(cacheKey(seriesId), JSON.stringify(payload));
  } catch {
    // Ignore storage failures.
  }
}

function getBestFallbackTotal(anilist: AniListData | null, jikanTotal: number) {
  const airingDerived = anilist?.nextAiringEpisode?.episode
    ? Math.max(0, anilist.nextAiringEpisode.episode - 1)
    : 0;
  return Math.max(anilist?.episodes || 0, jikanTotal || 0, airingDerived);
}

function buildFallbackMetadata(anilist: AniListData | null, jikanTotal: number): ReleaseMetadata {
  const totalEpisodes = getBestFallbackTotal(anilist, jikanTotal);
  return {
    totalEpisodes,
    premiered: null,
    nextEpisode: anilist?.nextAiringEpisode?.episode || null,
    nextAiringAt: anilist?.nextAiringEpisode?.airingAt || null,
    source: (jikanTotal > (anilist?.episodes || 0)) ? "jikan" : "anilist",
    updatedAt: Date.now(),
  };
}

function getCacheTtl(anilist: AniListData | null, cached?: ReleaseMetadata | null): number {
  if (anilist?.status === "RELEASING") return RELEASING_SYNC_MS;
  if (cached?.nextEpisode) return RELEASING_SYNC_MS;
  return DAY_MS;
}

interface NextEpisodeResponse {
  success: boolean;
  source?: "next-episode";
  data?: {
    totalEpisodes: number | null;
    premiered: string | null;
    nextEpisode: number | null;
    nextAiringAt: number | null;
  };
}

export async function syncSeriesReleaseMetadata(
  series: DonghuaSeries,
  anilist: AniListData | null,
  jikanTotal: number,
  force = false,
): Promise<ReleaseMetadata> {
  const cached = parseCached(series.id);
  const ttlMs = getCacheTtl(anilist, cached);
  if (!force && cached && (Date.now() - cached.updatedAt) < ttlMs) {
    return cached;
  }

  try {
    const { data, error } = await supabase.functions.invoke("fetch-episodes", {
      body: {
        slug: series.nextEpisodeSlug,
        query: series.searchQuery,
        aliases: series.aliases || [],
      },
    });

    if (!error) {
      const payload = data as NextEpisodeResponse;
      const totalEpisodes = payload?.data?.totalEpisodes || 0;
      if (payload?.success && totalEpisodes > 0) {
        const normalized: ReleaseMetadata = {
          totalEpisodes,
          premiered: payload.data?.premiered || null,
          nextEpisode: payload.data?.nextEpisode || null,
          nextAiringAt: payload.data?.nextAiringAt || null,
          source: "next-episode",
          updatedAt: Date.now(),
        };
        saveCached(series.id, normalized);
        return normalized;
      }
    }
  } catch {
    // fall back to AniList/Jikan when Next-Episode is unreachable.
  }

  const fallback = buildFallbackMetadata(anilist, jikanTotal);
  saveCached(series.id, fallback);
  return fallback;
}

export async function syncAllSeriesReleaseMetadata(
  seriesList: DonghuaSeries[],
  force = false,
) {
  const lastSync = Number(localStorage.getItem(GLOBAL_SYNC_KEY) || 0);
  if (!force && Date.now() - lastSync < RELEASING_SYNC_MS) {
    return;
  }

  await Promise.allSettled(
    seriesList.map((series) =>
      supabase.functions.invoke("fetch-episodes", {
        body: {
          slug: series.nextEpisodeSlug,
          query: series.searchQuery,
          aliases: series.aliases || [],
        },
      }).then(({ data, error }) => {
        if (error) return;
        const totalEpisodes = data?.data?.totalEpisodes || 0;
        if (totalEpisodes > 0) {
          const normalizedSource =
            data?.source === "next-episode" || data?.source === "jikan"
              ? data.source
              : "anilist";
          saveCached(series.id, {
            totalEpisodes,
            premiered: data?.data?.premiered || null,
            nextEpisode: data?.data?.nextEpisode || null,
            nextAiringAt: data?.data?.nextAiringAt || null,
            source: normalizedSource,
            updatedAt: Date.now(),
          });
        }
      })
    )
  );

  localStorage.setItem(GLOBAL_SYNC_KEY, String(Date.now()));
}
