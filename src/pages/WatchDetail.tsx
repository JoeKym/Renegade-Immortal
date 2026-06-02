import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import {
  Play, Search, Loader2, Star, Calendar, ChevronLeft, ChevronRight,
  Tv, Clock, List, Grid, Eye, PlaySquare, Share2, ExternalLink, Volume2
} from "lucide-react";
import { VideoPlayer } from "@/components/watch/VideoPlayer";
import { useT } from "@/contexts/TranslationContext";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { Helmet } from "react-helmet-async";
import { useDonghuaData } from "@/hooks/useDonghuaData";
import NotFound from "./NotFound";

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [watchHistory, setWatchHistory] = useState<Record<number, boolean>>({});

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

  const { series, aniData, loading, error, countdown, releasedCount, allEpisodes } = useDonghuaData(donghuaId || undefined);

  useEffect(() => {
    try {
      const historyStr = localStorage.getItem(`${series?.id}_watch_history`);
      if (historyStr) setWatchHistory(JSON.parse(historyStr));
    } catch (e) {
      console.warn("Failed to load local watch history");
    }
  }, [series?.id]);

  const filtered = useMemo(() => {
    if (!search) return allEpisodes;
    const q = search.toLowerCase();
    return allEpisodes.filter(ep => ep.number.toString().includes(q));
  }, [search, allEpisodes]);

  const handleEpisodeSelect = (num: number) => {
    setWatchHistory(prev => {
      const next = { ...prev, [num]: true };
      localStorage.setItem(`${series?.id}_watch_history`, JSON.stringify(next));
      return next;
    });
    navigate(`/watch/${series?.id}-${num}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${series?.title} - Episode ${episodeNumber}`,
        text: `Watch ${series?.title} Episode ${episodeNumber} on Renegade Immortal`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={36} className="animate-spin text-primary mb-4" />
        </div>
      </Layout>
    );
  }

  if (!series) return <NotFound />;
  if (episodeNumber && (episodeNumber > releasedCount || episodeNumber < 1)) return <NotFound />;

  const title = series.title;
  const pageTitle = episodeNumber 
    ? `${title} Episode ${episodeNumber} - Watch Online`
    : `${title} - All Episodes`;
  const pageDesc = aniData?.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `Watch ${title} online.`;
  const pageImage = aniData?.coverImage?.extraLarge || series.thumbnail;

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="video.other" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImage} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Banner */}
      <div
        className="relative h-48 sm:h-64 overflow-hidden"
        style={{
          backgroundImage: aniData?.bannerImage ? `url(${aniData.bannerImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundColor: "hsl(228 15% 7%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 flex items-end gap-5">
          <img
            src={aniData?.coverImage?.large || series.thumbnail}
            alt={title}
            className="hidden sm:block w-24 h-36 object-cover rounded-lg border border-border shadow-xl flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== series.thumbnail) {
                target.src = series.thumbnail;
              }
            }}
          />
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-heading text-foreground tracking-wider leading-tight truncate">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {aniData?.averageScore && (
                <span className="flex items-center gap-1 text-xs text-yellow-400 font-body">
                  <Star size={12} fill="currentColor" /> {(aniData.averageScore / 10).toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <Tv size={12} /> {releasedCount} Episodes
              </span>
              {countdown && (
                <span className="flex items-center gap-1 text-xs text-primary font-body animate-pulse">
                  <Clock size={12} /> Next: {countdown}
                </span>
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

      <div className="container mx-auto px-4 max-w-7xl py-6">
        {error ? (
          <div className="text-center py-24">
            <p className="text-destructive font-body mb-2">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT: Player or Info */}
            <div className="flex-1 min-w-0">
              {episodeNumber ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">Now Playing</p>
                      <h2 className="text-sm font-heading text-foreground tracking-wide">Episode {episodeNumber}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleShare} className="p-2 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Share">
                        <Share2 size={16} />
                      </button>
                      <button onClick={() => handleEpisodeSelect(episodeNumber - 1)} disabled={episodeNumber <= 1} className="flex items-center gap-1 px-3 py-1.5 rounded bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs font-body transition-colors">
                        <ChevronLeft size={14} /> Prev
                      </button>
                      <button onClick={() => handleEpisodeSelect(episodeNumber + 1)} disabled={episodeNumber >= releasedCount} className="flex items-center gap-1 px-3 py-1.5 rounded bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs font-body transition-colors">
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <VideoPlayer 
                    episode={episodeNumber} 
                    donghuaSlug={series.serverSlug || series.id}
                    onEnded={() => handleEpisodeSelect(episodeNumber + 1)} 
                  />

                  <div className="mt-4 p-4 gradient-card border border-border rounded-lg">
                    <h3 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-2">About</h3>
                    <p className="text-sm font-body text-muted-foreground leading-relaxed line-clamp-6">
                      {aniData?.description?.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="gradient-card border border-border rounded-xl p-8 text-center">
                  <Play size={48} className="text-primary mx-auto mb-4 opacity-20" />
                  <h2 className="text-xl font-heading mb-2">Select an Episode</h2>
                  <p className="text-muted-foreground mb-6">Choose from the {releasedCount} available episodes to start watching.</p>
                  <button onClick={() => handleEpisodeSelect(1)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-heading">
                    Start from Episode 1
                  </button>
                </div>
              )}

              {/* More Donghua Series (Standardized) */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading text-foreground tracking-wider flex items-center gap-2">
                    <Volume2 size={20} className="text-primary" />
                    More Donghua Series
                  </h3>
                  <Link to="/donghua" className="text-xs text-primary hover:underline font-body">View All</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {DONGHUA_SERIES.filter(s => s.id !== series.id).slice(0, 4).map((s) => (
                    <Link key={s.id} to={`/watch/${s.id}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-lg bg-card">
                      <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-[10px] text-primary font-body uppercase tracking-tighter mb-0.5">Series</p>
                        <h4 className="text-xs font-heading text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">{s.title}</h4>
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
                      {filtered.map((ep) => (
                        <button key={ep.number} onClick={() => handleEpisodeSelect(ep.number)} className={`aspect-video relative rounded border flex items-center justify-center text-[10px] font-body transition-colors ${episodeNumber === ep.number ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                          <img 
                            src={ep.thumbnail} 
                            alt={`EP ${ep.number}`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity rounded" 
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (series?.thumbnail && target.src !== series.thumbnail) {
                                    target.src = series.thumbnail;
                                }
                            }}
                          />
                          <span className="relative z-10">EP {ep.number}</span>
                          {watchHistory[ep.number] && episodeNumber !== ep.number && <Eye size={10} className="absolute top-1 right-1 text-primary/60 z-10" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filtered.map((ep) => (
                        <button key={ep.number} onClick={() => handleEpisodeSelect(ep.number)} className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition-colors ${episodeNumber === ep.number ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-6 overflow-hidden rounded bg-muted flex-shrink-0">
                                <img 
                                    src={ep.thumbnail} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (series?.thumbnail && target.src !== series.thumbnail) {
                                            target.src = series.thumbnail;
                                        }
                                    }}
                                />
                            </div>
                            Episode {ep.number}
                          </div>
                          {watchHistory[ep.number] && episodeNumber !== ep.number && <Eye size={12} className="text-primary/60" />}
                        </button>
                      ))}
                    </div>
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
