import type { DonghuaSeries } from "@/data/donghuaData";
import type { Json } from "@/integrations/supabase/types";

const releaseDays = new Set([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Multiple",
]);
const statusTags = new Set([
  "Ongoing",
  "Completed",
  "Ongoing (Nian Fan)",
  "Completed Special Series",
  "Completed / Ongoing Season 2",
  "Movie",
  "Special",
  "Hiatus",
]);

interface DonghuaCatalogRow {
  id: string;
  payload: Json;
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isDonghuaSeries(value: Json, rowId: string): value is DonghuaSeries {
  if (!value || Array.isArray(value) || typeof value !== "object") return false;
  const candidate = value as Record<string, Json | undefined>;
  const requiredStrings = [
    "id",
    "title",
    "searchQuery",
    "anilistSearch",
    "jikanSearch",
    "nextEpisodeSlug",
    "thumbnail",
  ];

  if (requiredStrings.some((key) => typeof candidate[key] !== "string" || !candidate[key])) {
    return false;
  }
  if (candidate.id !== rowId) return false;
  if (candidate.aliases !== undefined &&
      (!Array.isArray(candidate.aliases) || candidate.aliases.some((alias) => typeof alias !== "string"))) {
    return false;
  }
  if (candidate.releaseDay !== undefined &&
      (typeof candidate.releaseDay !== "string" || !releaseDays.has(candidate.releaseDay))) {
    return false;
  }
  if (candidate.statusTag !== undefined &&
      (typeof candidate.statusTag !== "string" || !statusTags.has(candidate.statusTag))) {
    return false;
  }
  if (candidate.knownTotalEpisodes !== undefined &&
      (typeof candidate.knownTotalEpisodes !== "number" || candidate.knownTotalEpisodes < 0)) {
    return false;
  }
  if (candidate.anchorEpisode !== undefined &&
      (typeof candidate.anchorEpisode !== "number" || candidate.anchorEpisode < 0)) {
    return false;
  }
  if (candidate.streamingLinks !== undefined) {
    if (!candidate.streamingLinks || Array.isArray(candidate.streamingLinks) || typeof candidate.streamingLinks !== "object") {
      return false;
    }
    const links = candidate.streamingLinks as Record<string, Json | undefined>;
    if (["anime4i", "luciferDonghuaOrg", "luciferDonghuaIn"].some((key) => !isOptionalString(links[key]))) {
      return false;
    }
  }

  return true;
}

export function mergeDonghuaCatalog(
  baseSeries: DonghuaSeries[],
  rows: DonghuaCatalogRow[],
): DonghuaSeries[] {
  const overrides = new Map<string, DonghuaSeries>();
  for (const row of rows) {
    if (!isDonghuaSeries(row.payload, row.id)) {
      console.error(`Ignoring invalid donghua catalog record "${row.id}".`);
      continue;
    }
    overrides.set(row.id, row.payload);
  }

  const merged = baseSeries.map((series) => overrides.get(series.id) ?? series);
  const existingIds = new Set(baseSeries.map((series) => series.id));
  for (const row of rows) {
    const override = overrides.get(row.id);
    if (override && !existingIds.has(row.id)) merged.push(override);
  }
  return merged;
}
