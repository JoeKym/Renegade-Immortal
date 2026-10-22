import type { DonghuaSeries } from "@/data/donghuaData";

export type VideoServerName = "anime4i" | "luciferdonghua" | "luciferdonghuain" | "myanime";

export function extractSlugFromStreamingUrl(url: string): string | null {
  // Support both "-episode-" and "-episod-" (found on LuciferDonghua URLs like BTTH)
  const match = url.match(/\/([^/?#]+)-(?:episode|episod)-\d+/i);
  return match?.[1] || null;
}

export function getVideoServerSlugs(series: Pick<DonghuaSeries, "id" | "serverSlug" | "streamingLinks">): Record<VideoServerName, string> {
  const fallback = series.serverSlug || series.id;

  const anime4iSlug = series.streamingLinks?.anime4i
    ? extractSlugFromStreamingUrl(series.streamingLinks.anime4i)
    : null;

  const luciferOrgSlug = series.streamingLinks?.luciferDonghuaOrg
    ? extractSlugFromStreamingUrl(series.streamingLinks.luciferDonghuaOrg)
    : null;

  const luciferInSlug = series.streamingLinks?.luciferDonghuaIn
    ? extractSlugFromStreamingUrl(series.streamingLinks.luciferDonghuaIn)
    : null;

  return {
    anime4i: anime4iSlug || fallback,
    luciferdonghua: luciferOrgSlug || fallback,
    luciferdonghuain: luciferInSlug || luciferOrgSlug || fallback,
    myanime: fallback,
  };
}
