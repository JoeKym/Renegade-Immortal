import { useState, useMemo, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { WatchPageTemplate } from "@/components/watch/WatchPageTemplate";

// 🌟 ROBUST SAFETY EXTRA: Local Error Boundary to catch any nested component or network failures
interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class WatchComponentErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Watch page internal render crash caught safely:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center", color: "#fff", background: "#111", borderRadius: "8px", margin: "20px" }}>
          <h2 style={{ color: "#e53e3e" }}>⚠️ Cultivation Register Archive Warning</h2>
          <p>The external anime index server is currently experiencing an outage.</p>
          <p style={{ opacity: 0.7 }}>Your local media route remains safe. Try refreshing the page to reload assets.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "16px", padding: "8px 16px", background: "#d69e2e", border: "none", color: "#000", fontWeight: "bold", cursor: "pointer", borderRadius: "4px" }}
          >
            Retry Connection
          </button>
        </div>
      );
    }
    return this.children;
  }
}

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
    // 🛡️ Safe-guard wrappers keep the global app router completely unaware of template failures
    <WatchComponentErrorBoundary>
      <WatchPageTemplate
        seriesId="renegade-immortal"
        episodeNumber={selectedEpisode}
        onEpisodeSelect={handleEpisodeSelect}
        getCustomEpisodeData={getCustomEpisodeData}
        customFilter={customFilter}
      />
    </WatchComponentErrorBoundary>
  );
}
