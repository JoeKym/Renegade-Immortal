import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import {
  Play, Search, Loader2, Star, Calendar, ChevronLeft, ChevronRight,
  Tv, Clock, List, Grid, Volume2, Eye, PlaySquare, ExternalLink
} from "lucide-react";
import { VideoPlayer } from "@/components/watch/VideoPlayer";
import { useT } from "@/contexts/TranslationContext";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { useDonghuaData } from "@/hooks/useDonghuaData";

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
  const { t } = useT();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [watchHistory, setWatchHistory] = useState<Record<number, boolean>>({});
  const [lastWatched, setLastWatched] = useState<number | null>(null);
  const episodeListRef = useRef<HTMLDivElement>(null);

  const { series, aniData, loading, error, countdown, releasedCount, allEpisodes: baseEpisodes } = useDonghuaData("renegade-immortal");

  useEffect(() => {
    try {
      const historyStr = localStorage.getItem("renegade_watch_history");
      if (historyStr) setWatchHistory(JSON.parse(historyStr));
      
      const lastWatchedStr = localStorage.getItem("renegade_last_watched");
      if (lastWatchedStr) setLastWatched(Number(lastWatchedStr));
    } catch (e) {
      console.warn("Failed to load local watch history");
    }
  }, []);

  const allEpisodes = useMemo(() => {
    return baseEpisodes.map(ep => ({
      ...ep,
      arc: getArcForEpisode(ep.number)
    }));
  }, [baseEpisodes]);

  const filtered = useMemo(() => {
    if (!search) return allEpisodes;
    const q = search.toLowerCase();
    return allEpisodes.filter(
      (ep) => ep.number.toString().includes(q) || ep.arc.toLowerCase().includes(q)
    );
  }, [search, allEpisodes]);

  const selectedData = selectedEpisode
    ? allEpisodes.find((e) => e.number === selectedEpisode)
    : null;

  const handleEpisodeSelect = (num: number) => {
    setSelectedEpisode(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    setWatchHistory(prev => {
      const next = { ...prev, [num]: true };
      localStorage.setItem("renegade_watch_history", JSON.stringify(next));
      return next;
    });
    setLastWatched(num);
    localStorage.setItem("renegade_last_watched", num.toString());
  };

  const handlePrev = () => {
    if (selectedEpisode && selectedEpisode > 1) handleEpisodeSelect(selectedEpisode - 1);
  };
  const handleNext = () => {
    if (selectedEpisode && selectedEpisode < releasedCount) handleEpisodeSelect(selectedEpisode + 1);
  };

  const studio = aniData?.studios?.nodes?.[0]?.name;
  const title = aniData?.title?.english || aniData?.title?.romaji || "Renegade Immortal";

  return (
    <Layout>
      {/* Banner */}
      <div
        className="relative h-48 sm:h-64 overflow-hidden"
        style={{
          backgroundImage: aniData?.bannerImage
            ? `url(${aniData.bannerImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundColor: "hsl(228 15% 7%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 flex items-end gap-5">
          {aniData?.coverImage && (
            <img
              src={aniData.coverImage.large}
              alt={title}
              className="hidden sm:block w-24 h-36 object-cover rounded-lg border border-border shadow-xl flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (series?.thumbnail && target.src !== series.thumbnail) {
                  target.src = series.thumbnail;
                }
              }}
            />
          )}
          <div className="min-w-0">
            <p className="text-xs text-primary font-body tracking-widest uppercase mb-1">仙逆 · Xian Ni</p>
            <h1 className="text-2xl sm:text-3xl font-heading text-foreground tracking-wider leading-tight truncate">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {aniData?.averageScore && (
                <span className="flex items-center gap-1 text-xs text-yellow-400 font-body">
                  <Star size={12} fill="currentColor" /> {(aniData.averageScore / 10).toFixed(1)} {t("watch.rating")}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <Tv size={12} /> {t("watch.episode_count", { count: releasedCount })}
              </span>
              {countdown && (
                <span className="flex items-center gap-1 text-xs text-primary font-body animate-pulse">
                  <Clock size={12} /> Next: {countdown}
                </span>
              )}
              {aniData?.status && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                  {aniData.status === "RELEASING" ? t("watch.airing") : t("watch.completed")}
                </span>
              )}
              {studio && (
                <span className="text-xs text-muted-foreground font-body">{studio}</span>
              )}
            </div>
            {aniData?.genres && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {aniData.genres.slice(0, 4).map((g) => (
                  <span key={g} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-body border border-primary/20">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 max-w-7xl py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={36} className="animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-body text-sm">Connecting to AniList...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-destructive font-body mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-primary hover:underline font-body"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT: Player + Info */}
            <div className="flex-1 min-w-0 space-y-8">
              {selectedEpisode ? (
                <motion.div
                  key={selectedEpisode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">Now Playing</p>
                      <h2 className="text-sm font-heading text-foreground tracking-wide">
                        Episode {selectedEpisode} — {selectedData?.arc}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        disabled={selectedEpisode <= 1}
                        className="flex items-center gap-1 px-3 py-1.5 rounded bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs font-body transition-colors"
                      >
                        <ChevronLeft size={14} /> Prev
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={selectedEpisode >= releasedCount}
                        className="flex items-center gap-1 px-3 py-1.5 rounded bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs font-body transition-colors"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <VideoPlayer episode={selectedEpisode} donghuaSlug="renegade-immortal-xian-ni" onEnded={handleNext} />

                  {aniData?.description && (
                    <div className="mt-4 p-4 gradient-card border border-border rounded-lg">
                      <h3 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-2">About</h3>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed line-clamp-4">
                        {aniData.description.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="gradient-card border border-border rounded-xl overflow-hidden"
                >
                  <div className="relative w-full flex items-center justify-center" style={{ paddingBottom: "56.25%" }}>
                    <div className="absolute inset-0">
                      {aniData?.bannerImage ? (
                        <img src={aniData.bannerImage} alt="banner" className="w-full h-full object-cover opacity-40" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-card" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Play size={36} className="text-primary ml-1" />
                      </div>
                      <div>
                        <p className="text-foreground font-heading tracking-wider text-lg mb-1">Select an Episode</p>
                        <p className="text-muted-foreground font-body text-sm">Choose any of the {releasedCount} released episodes</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleEpisodeSelect(1)}
                          className="px-6 py-2.5 bg-muted/60 text-foreground hover:bg-muted rounded-lg text-sm font-heading transition-colors border border-border"
                        >
                          Start from Episode 1
                        </button>
                        {lastWatched && (
                          <button
                            onClick={() => handleEpisodeSelect(lastWatched)}
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-heading hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                          >
                            <PlaySquare size={16} /> Continue Ep {lastWatched}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* More Donghua Series */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading text-foreground tracking-wider flex items-center gap-2">
                    <Volume2 size={20} className="text-primary" />
                    More Donghua Series
                  </h3>
                  <Link to="/donghua" className="text-xs text-primary hover:underline font-body">View All</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {DONGHUA_SERIES.filter(s => s.id !== "renegade-immortal").map((series) => (
                    <Link
                      key={series.id}
                      to={`/watch/${series.id}`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-lg bg-card"
                    >
                      <img
                        src={series.thumbnail}
                        alt={series.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-[10px] text-primary font-body uppercase tracking-tighter mb-0.5">Series</p>
                        <h4 className="text-xs font-heading text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {series.title}
                        </h4>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                          <ExternalLink size={18} className="text-primary-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Episode List */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="gradient-card border border-border rounded-xl overflow-hidden flex flex-col" style={{ maxHeight: "80vh" }}>
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <List size={15} className="text-primary" />
                      <span className="text-xs font-heading text-foreground tracking-wider">
                        Episodes ({releasedCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Grid size={13} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <List size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search episodes or arcs..."
                      className="w-full pl-8 pr-3 py-2 bg-muted/40 border border-border rounded-lg text-xs font-body text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div ref={episodeListRef} className="overflow-y-auto flex-1 p-3">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                      {filtered.map((ep) => (
                        <motion.button
                          key={ep.number}
                          layout
                          onClick={() => handleEpisodeSelect(ep.number)}
                          className={`group relative rounded-lg overflow-hidden border transition-all text-left ${
                            selectedEpisode === ep.number
                              ? "ring-2 ring-primary border-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <img 
                                src={ep.thumbnail} 
                                alt={`EP ${ep.number}`} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                loading="lazy" 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (series?.thumbnail && target.src !== series.thumbnail) {
                                        target.src = series.thumbnail;
                                    }
                                }}
                            />
                            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                                <Play size={14} className="text-primary-foreground ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-background/80 text-[10px] font-body">EP {ep.number}</span>
                            {watchHistory[ep.number] && <Eye size={12} className="absolute top-1 right-1 text-primary" />}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filtered.map((ep) => (
                        <motion.button
                          key={ep.number}
                          layout
                          onClick={() => handleEpisodeSelect(ep.number)}
                          className={`w-full flex items-center gap-3 rounded-lg p-2.5 text-left transition-all border ${
                            selectedEpisode === ep.number
                              ? "bg-primary/10 border-primary/40 text-foreground"
                              : "border-transparent hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {ep.thumbnail ? (
                            <img 
                                src={ep.thumbnail} 
                                alt={`ep ${ep.number}`} 
                                className="w-16 h-10 object-cover rounded flex-shrink-0" 
                                loading="lazy" 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (series?.thumbnail && target.src !== series.thumbnail) {
                                        target.src = series.thumbnail;
                                    }
                                }}
                            />
                          ) : (
                            <div className="w-16 h-10 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                              <Play size={14} className="text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1 flex flex-col">
                            <p className="text-xs font-heading tracking-wide text-inherit flex items-center gap-1.5">
                              {selectedEpisode === ep.number && <span className="text-primary">▶</span>}
                              Episode {ep.number}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-body truncate">{ep.arc}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                  {filtered.length === 0 && (
                    <p className="text-center text-muted-foreground text-xs font-body py-8">No episodes match your search</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
