import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Share2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { useDonghuaData } from "@/hooks/useDonghuaData";
import { VideoPlayer } from "@/components/watch/VideoPlayer";
import { WatchBanner } from "./WatchBanner";
import { EpisodeSidebar } from "./EpisodeSidebar";
import { SeriesGrid } from "./SeriesGrid";
import NotFound from "@/pages/NotFound";
import { proxyImageUrl } from "@/lib/utils";
import { getVideoServerSlugs } from "@/lib/videoSourceSlugs";

interface WatchPageTemplateProps {
  seriesId: string;
  episodeNumber?: number | null;
  onEpisodeSelect: (num: number) => void;
  getCustomEpisodeData?: (ep: any) => any;
  customFilter?: (ep: any, query: string) => boolean;
}

export function WatchPageTemplate({
  seriesId,
  episodeNumber,
  onEpisodeSelect,
  getCustomEpisodeData,
  customFilter
}: WatchPageTemplateProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [watchHistory, setWatchHistory] = useState<Record<number, boolean>>({});

  const { series, aniData, loading, error, countdown, releasedCount, allEpisodes: baseEpisodes } = useDonghuaData(seriesId);

  useEffect(() => {
    try {
      const historyStr = localStorage.getItem(`${seriesId}_watch_history`);
      if (historyStr) setWatchHistory(JSON.parse(historyStr));
    } catch (e) {
      console.warn("Failed to load local watch history");
    }
  }, [seriesId]);

  const allEpisodes = useMemo(() => {
    if (!getCustomEpisodeData) return baseEpisodes;
    return baseEpisodes.map(getCustomEpisodeData);
  }, [baseEpisodes, getCustomEpisodeData]);

  const filtered = useMemo(() => {
    if (!search) return allEpisodes;
    const q = search.toLowerCase();
    if (customFilter) {
        return allEpisodes.filter(ep => customFilter(ep, q));
    }
    return allEpisodes.filter(ep => ep.number.toString().includes(q));
  }, [search, allEpisodes, customFilter]);

  const handleEpisodeSelect = (num: number) => {
    setWatchHistory(prev => {
      const next = { ...prev, [num]: true };
      localStorage.setItem(`${seriesId}_watch_history`, JSON.stringify(next));
      return next;
    });
    onEpisodeSelect(num);
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

  if (!series || error) return <NotFound />;
  if (episodeNumber && (episodeNumber > releasedCount || episodeNumber < 1)) return <NotFound />;

  const title = series.title;
  const pageTitle = episodeNumber 
    ? `${title} Episode ${episodeNumber} - Watch Online`
    : `${title} - All Episodes`;
  const pageDesc = aniData?.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `Watch ${title} online.`;
  const pageImage = proxyImageUrl(aniData?.coverImage?.extraLarge || series.thumbnail);

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

      <WatchBanner 
        aniData={aniData} 
        series={series} 
        releasedCount={releasedCount} 
        countdown={countdown} 
        title={title} 
      />

      <div className="container mx-auto px-4 max-w-7xl py-6">
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
                  serverSlugs={getVideoServerSlugs(series)}
                  seriesTitle={series.title}
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

            <SeriesGrid currentSeriesId={seriesId} />
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <EpisodeSidebar 
                releasedCount={releasedCount}
                viewMode={viewMode}
                setViewMode={setViewMode}
                search={search}
                setSearch={setSearch}
                filteredEpisodes={filtered}
                selectedEpisode={episodeNumber || null}
                handleEpisodeSelect={handleEpisodeSelect}
                watchHistory={watchHistory}
                seriesThumbnail={series.thumbnail}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
