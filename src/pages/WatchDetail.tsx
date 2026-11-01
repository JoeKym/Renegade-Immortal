import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { WatchPageTemplate } from "@/components/watch/WatchPageTemplate";
import NotFound from "@/pages/NotFound";
import { parseWatchSlug, buildWatchUrl } from "@/lib/slugParser";
import { useDonghuaCatalog } from "@/contexts/DonghuaCatalogContext";

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { series } = useDonghuaCatalog();

  // Robust slug resolution supporting series names, aliases, and episode sequential numbers
  const { donghuaId, episodeNumber } = useMemo(() => {
    return parseWatchSlug(slug, series);
  }, [slug, series]);

  const handleEpisodeSelect = useCallback(
    (num: number) => {
      if (donghuaId) {
        navigate(buildWatchUrl(donghuaId, num));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [navigate, donghuaId]
  );

  // Return custom styled 404 page if slug does not resolve to a valid series or episode
  if (!donghuaId) return <NotFound />;

  return (
    <WatchPageTemplate
      seriesId={donghuaId}
      episodeNumber={episodeNumber}
      onEpisodeSelect={handleEpisodeSelect}
    />
  );
}
