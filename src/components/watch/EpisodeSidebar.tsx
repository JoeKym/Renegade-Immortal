import { Search, Grid, List, Play, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Episode {
  number: number;
  thumbnail: string;
  description: string;
  arc?: string;
}

interface EpisodeSidebarProps {
  releasedCount: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  search: string;
  setSearch: (val: string) => void;
  filteredEpisodes: Episode[];
  selectedEpisode: number | null;
  handleEpisodeSelect: (num: number) => void;
  watchHistory: Record<number, boolean>;
  seriesThumbnail?: string;
}

export function EpisodeSidebar({
  releasedCount,
  viewMode,
  setViewMode,
  search,
  setSearch,
  filteredEpisodes,
  selectedEpisode,
  handleEpisodeSelect,
  watchHistory,
  seriesThumbnail
}: EpisodeSidebarProps) {
  return (
    <div className="gradient-card border border-border rounded-xl overflow-hidden flex flex-col" style={{ maxHeight: "80vh" }}>
      <div className="p-4 border-b border-border text-center">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-heading text-foreground tracking-wider uppercase">Episodes ({releasedCount})</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><Grid size={13} /></button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><List size={13} /></button>
          </div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search episodes..." className="w-full pl-8 pr-3 py-2 bg-muted/40 border border-border rounded-lg text-xs" />
        </div>
      </div>
      <div className="overflow-y-auto flex-1 p-3">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-3 gap-2">
            {filteredEpisodes.map((ep) => (
              <button
                key={ep.number}
                onClick={() => handleEpisodeSelect(ep.number)}
                className={`aspect-video relative rounded border overflow-hidden flex items-center justify-center text-[10px] font-body transition-colors ${selectedEpisode === ep.number ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
              >
                <img
                  src={ep.thumbnail}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (seriesThumbnail && target.src !== seriesThumbnail) target.src = seriesThumbnail;
                  }}
                />
                <span className="relative z-10">EP {ep.number}</span>
                {watchHistory[ep.number] && selectedEpisode !== ep.number && <Eye size={10} className="absolute top-1 right-1 text-primary/60 z-10" />}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredEpisodes.map((ep) => (
              <button
                key={ep.number}
                onClick={() => handleEpisodeSelect(ep.number)}
                className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition-colors ${selectedEpisode === ep.number ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-6 overflow-hidden rounded bg-muted flex-shrink-0">
                    <img
                      src={ep.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (seriesThumbnail && target.src !== seriesThumbnail) target.src = seriesThumbnail;
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-body">Episode {ep.number}</p>
                    {ep.arc && <p className="text-[10px] text-muted-foreground truncate">{ep.arc}</p>}
                  </div>
                </div>
                {watchHistory[ep.number] && selectedEpisode !== ep.number && <Eye size={12} className="text-primary/60" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
