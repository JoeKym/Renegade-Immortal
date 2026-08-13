import { useState, useMemo, useCallback } from "react";
import { WatchPageTemplate } from "@/components/watch/WatchPageTemplate";

const seasonLabels: { maxEp: number; title: string }[] = [
  { maxEp: 24, title: "Heng Yue Sect & Zhao Country Arc" },
  { maxEp: 76, title: "Sea of Devils & Teng Clan Vengeance Arc" },
  { maxEp: 120, title: "Soul Formation Domain & Ancient Demon Arc" },
  { maxEp: 180, title: "Alliance Planet & Suzaku Country Arc" },
  { maxEp: 240, title: "Allheaven Star System Arc" },
  { maxEp: 9999, title: "Grand Astral Continent Arc" },
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
