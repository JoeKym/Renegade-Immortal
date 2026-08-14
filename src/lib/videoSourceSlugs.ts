import type { DonghuaSeries } from "@/data/donghuaData";

export type VideoServerName = "anime4i" | "luciferdonghua" | "myanime";

export function extractSlugFromStreamingUrl(url: string): string | null {
  const match = url.match(/\/([^/?#]+)-episode-\d+/i);
  return match?.[1] || null;
}

export function getVideoServerSlugs(series: Pick<DonghuaSeries, "id" | "serverSlug" | "streamingLinks">): Record<VideoServerName, string> {
  const fallback = series.serverSlug || series.id;

  return {
    anime4i:
      (series.streamingLinks?.anime4i && extractSlugFromStreamingUrl(series.streamingLinks.anime4i)) ||
      fallback,
    luciferdonghua:
      (series.streamingLinks?.luciferDonghuaOrg && extractSlugFromStreamingUrl(series.streamingLinks.luciferDonghuaOrg)) ||
      fallback,
    myanime: fallback,
  };
}
