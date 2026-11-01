import type { DonghuaSeries } from "@/data/donghuaData";

export type VideoServerName = "anime4i" | "luciferdonghua" | "luciferdonghuain" | "myanime";

export function extractSlugFromStreamingUrl(url: string): string | null {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    const finalSegment = path.split("/").pop();
    if (!finalSegment) return null;

    const baseSlug = finalSegment
      .replace(/-(episode|episod|ep|part|pt)-(\d+)(?:-(20\d{2}))?(?:-.*)?$/i, (_match, _marker: string, _number: string, year?: string) =>
        year ? `-${year}` : "")
      .replace(/-(?:english-sub(?:title)?s?|lucifer-donghua)$/i, "");
    return baseSlug || null;
  } catch {
    return null;
  }
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
