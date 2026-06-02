import { useState, useMemo, useCallback } from "react";
import { WatchPageTemplate } from "@/components/watch/WatchPageTemplate";

const seasonLabels: { maxEp: number; title: string }[] = [
  { maxEp: 39, title: "Heng Yue Sect Arc" },
  { maxEp: 78, title: "Zhao Kingdom Arc" },
  { maxEp: 118, title: "Sea of Devils Arc" },
  { maxEp: 158, title: "Tian Gang Sect Arc" },
  { maxEp: 198, title: "Allheaven Arc" },
  { maxEp: 9999, title: "Star System Arc" },
];

function getArcForEpisode(ep: number): string {
  for (const s of seasonLabels) {
    if (ep <= s.maxEp) return s.title;
  }
  return seasonLabels[seasonLabels.length - 1].title;
}

export default function WatchPage() {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const handleEpisodeSelect = useCallback((num: number) => {
    setSelectedEpisode(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getCustomEpisodeData = useCallback((ep: any) => ({
    ...ep,
    arc: getArcForEpisode(ep.number)
  }), []);

  const customFilter = useCallback((ep: any, query: string) => {
    return ep.number.toString().includes(query) || ep.arc?.toLowerCase().includes(query);
  }, []);

  return (
    <WatchPageTemplate
      seriesId="renegade-immortal"
      episodeNumber={selectedEpisode}
      onEpisodeSelect={handleEpisodeSelect}
      getCustomEpisodeData={getCustomEpisodeData}
      customFilter={customFilter}
    />
  );
}
