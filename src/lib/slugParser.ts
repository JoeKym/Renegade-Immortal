import { DONGHUA_SERIES, DonghuaSeries } from "@/data/donghuaData";

export interface ParsedWatchSlug {
  donghuaId: string | null;
  episodeNumber: number | null;
  isEpisode: boolean;
}

/**
 * Normalizes an arbitrary string into a URL-safe lowercase slug.
 */
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Parses dynamic `/watch/:slug` parameters into a structured series and optional episode number.
 *
 * Supported formats:
 * - Series only: e.g. "beyond-times-gaze", "renegade-immortal", "tales-of-herding-gods"
 * - Episode with "episode": e.g. "renegade-immortal-episode-131", "beyond-times-gaze-episode-1"
 * - Episode with "ep": e.g. "renegade-immortal-ep-131"
 * - Episode with hyphen number: e.g. "renegade-immortal-131"
 *
 * Resolves longer series IDs first to prevent prefix collisions
 * (e.g. "battle-through-the-heavens-three-year-agreement" before "battle-through-the-heavens").
 */
export function parseWatchSlug(slug?: string, seriesList: DonghuaSeries[] = DONGHUA_SERIES): ParsedWatchSlug {
  if (!slug || typeof slug !== "string") {
    return { donghuaId: null, episodeNumber: null, isEpisode: false };
  }

  const cleanSlug = toSlug(slug);
  if (!cleanSlug) {
    return { donghuaId: null, episodeNumber: null, isEpisode: false };
  }

  // 1. Check for exact series ID matches
  const exactSeries = seriesList.find((s) => s.id === cleanSlug);
  if (exactSeries) {
    return { donghuaId: exactSeries.id, episodeNumber: null, isEpisode: false };
  }

  // 2. Check for exact series alias matches
  for (const s of seriesList) {
    if (s.aliases) {
      for (const alias of s.aliases) {
        if (toSlug(alias) === cleanSlug) {
          return { donghuaId: s.id, episodeNumber: null, isEpisode: false };
        }
      }
    }
  }

  // 3. Check for episode patterns, sorting candidate series by length descending
  const sortedSeries = [...seriesList].sort((a, b) => b.id.length - a.id.length);

  for (const s of sortedSeries) {
    if (cleanSlug.startsWith(s.id)) {
      const remainder = cleanSlug.slice(s.id.length);
      const match = remainder.match(/^-(?:episode|ep)?-?(\d+)$/i);
      if (match) {
        const ep = parseInt(match[1], 10);
        if (Number.isFinite(ep) && ep > 0) {
          return { donghuaId: s.id, episodeNumber: ep, isEpisode: true };
        }
      }
    }

    // Check alias prefixes
    if (s.aliases) {
      for (const alias of s.aliases) {
        const aliasSlug = toSlug(alias);
        if (aliasSlug && cleanSlug.startsWith(aliasSlug)) {
          const remainder = cleanSlug.slice(aliasSlug.length);
          const match = remainder.match(/^-(?:episode|ep)?-?(\d+)$/i);
          if (match) {
            const ep = parseInt(match[1], 10);
            if (Number.isFinite(ep) && ep > 0) {
              return { donghuaId: s.id, episodeNumber: ep, isEpisode: true };
            }
          }
        }
      }
    }
  }

  return { donghuaId: null, episodeNumber: null, isEpisode: false };
}

/**
 * Constructs standard client-side URL for a series or episode.
 */
export function buildWatchUrl(seriesId: string, episodeNumber?: number | null): string {
  if (episodeNumber && Number.isFinite(episodeNumber) && episodeNumber > 0) {
    return `/watch/${seriesId}-episode-${episodeNumber}`;
  }
  return `/watch/${seriesId}`;
}

/**
 * Builds canonical absolute URL for social sharing and search engines.
 */
export function buildCanonicalWatchUrl(
  seriesId: string,
  episodeNumber?: number | null,
  customOrigin?: string
): string {
  const base =
    customOrigin ||
    (typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null"
      ? window.location.origin
      : "https://renegadeimmortal.com");
  const path = buildWatchUrl(seriesId, episodeNumber);
  return `${base}${path}`;
}

