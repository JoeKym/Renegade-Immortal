import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { WatchPageTemplate } from "@/components/watch/WatchPageTemplate";

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Parse slug
  const { donghuaId, episodeNumber } = useMemo(() => {
    if (!slug) return { donghuaId: null, episodeNumber: null };
    if (DONGHUA_SERIES.find(d => d.id === slug)) return { donghuaId: slug, episodeNumber: null };
    const match = slug.match(/(.+)-(\d+)$/);
    if (match && DONGHUA_SERIES.find(d => d.id === match[1])) {
      return { donghuaId: match[1], episodeNumber: parseInt(match[2]) };
    }
    return { donghuaId: null, episodeNumber: null };
  }, [slug]);

  const handleEpisodeSelect = useCallback((num: number) => {
    navigate(`/watch/${donghuaId}-${num}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate, donghuaId]);

  if (!donghuaId) return null;

  return (
    <WatchPageTemplate 
      seriesId={donghuaId}
      episodeNumber={episodeNumber}
      onEpisodeSelect={handleEpisodeSelect}
    />
  );
}
