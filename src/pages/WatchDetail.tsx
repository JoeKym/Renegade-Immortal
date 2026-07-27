import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { WatchPageTemplate } from "@/components/watch/WatchPageTemplate";
import NotFound from "@/pages/NotFound";

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Parse slug — try exact match first, then progressive suffix stripping for series whose IDs contain "-N"
  const { donghuaId, episodeNumber } = useMemo(() => {
    if (!slug) return { donghuaId: null, episodeNumber: null };
    if (DONGHUA_SERIES.some((d) => d.id === slug)) return { donghuaId: slug, episodeNumber: null };

    const parts = slug.split("-");
    for (let i = parts.length - 1; i >= 1; i--) {
      const candidateId = parts.slice(0, i).join("-");
      const epPart = parts.slice(i).join("-");
      const match = DONGHUA_SERIES.find((d) => d.id === candidateId);
      if (match) {
        const epNum = Number.isFinite(parseInt(epPart)) ? parseInt(epPart) : null;
        return { donghuaId: candidateId, episodeNumber: epNum };
      }
    }

    const regexMatch = slug.match(/^(.+)-(\d+)$/);
    if (regexMatch) {
      const candidate = regexMatch[1];
      if (DONGHUA_SERIES.some((d) => d.id === candidate)) {
        return { donghuaId: candidate, episodeNumber: parseInt(regexMatch[2]) };
      }
    }
    return { donghuaId: null, episodeNumber: null };
  }, [slug]);

  const handleEpisodeSelect = useCallback(
    (num: number) => {
      navigate(`/watch/${donghuaId}-${num}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate, donghuaId]
  );

  if (!donghuaId) return <NotFound />;

  return (
    <WatchPageTemplate
      seriesId={donghuaId}
      episodeNumber={episodeNumber}
      onEpisodeSelect={handleEpisodeSelect}
    />
  );
}
