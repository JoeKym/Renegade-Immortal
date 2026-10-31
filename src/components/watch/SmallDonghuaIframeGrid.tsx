import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { DONGHUA_SERIES, DonghuaSeries } from "@/data/donghuaData";
import { proxyImageUrl } from "@/lib/utils";

export const FEATURED_SERIES_IDS: string[] = [
  "beyond-times-gaze",
  "tales-of-herding-gods",
  "swallowed-star",
  "one-hundred-thousand-years-of-qi-refining",
  "battle-through-the-heavens",
  "eclipse-of-illusion",
  "tomb-of-fallen-gods",
  "spy-x-sect",
];

interface SmallDonghuaIframeGridProps {
  currentSeriesId?: string;
  title?: string;
  subtitle?: string;
}

export function SmallDonghuaIframeGrid({
  currentSeriesId,
  title = "Explore More Donghua",
  subtitle = "Click any series to jump directly to its dedicated cultivation watch realm.",
}: SmallDonghuaIframeGridProps) {
  const navigate = useNavigate();
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({});

  // Resolve the 8 series. If the current page is already one of the 8, swap it with Renegade Immortal
  const seriesToDisplay = FEATURED_SERIES_IDS.map((id) => {
    if (currentSeriesId && id === currentSeriesId) {
      return DONGHUA_SERIES.find((s) => s.id === "renegade-immortal");
    }
    return DONGHUA_SERIES.find((s) => s.id === id);
  }).filter(Boolean) as DonghuaSeries[];

  const handleSeriesClick = (slug: string) => {
    navigate(`/watch/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mt-10 pt-6 border-t border-border/60">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading text-foreground tracking-wide flex items-center gap-2">
            <Sparkles size={20} className="text-primary animate-pulse" />
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            {subtitle}
          </p>
        </div>
        <button
          onClick={() => navigate("/donghua-series")}
          className="text-xs text-primary hover:text-primary/80 transition-colors font-body flex items-center gap-1 self-start sm:self-auto"
        >
          View Full Directory <ExternalLink size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {seriesToDisplay.map((series, idx) => {
          const streamUrl =
            series.streamingLinks?.luciferDonghuaOrg ||
            series.streamingLinks?.anime4i ||
            series.streamingLinks?.luciferDonghuaIn ||
            "";

          return (
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-border bg-card/60 hover:border-primary/60 transition-all duration-300 shadow-lg hover:shadow-primary/10"
            >
              {/* Top: Small Embedded i-Frame with Fallback & Absolute Click Interceptor */}
              <div className="relative aspect-video w-full bg-black/80 overflow-hidden">
                {/* Fallback Poster Background */}
                <img
                  src={
                    brokenThumbs[series.id]
                      ? "/placeholder.svg"
                      : proxyImageUrl(series.thumbnail)
                  }
                  alt={series.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500 filter blur-[1px]"
                  loading="lazy"
                  onError={() =>
                    setBrokenThumbs((prev) => ({ ...prev, [series.id]: true }))
                  }
                />

                {/* Embedded i-Frame */}
                {streamUrl ? (
                  <iframe
                    src={streamUrl}
                    title={`${series.title} Player Preview`}
                    className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : null}

                {/* Gradient Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                {/* Status Badge */}
                <div className="absolute top-2 left-2 z-10 pointer-events-none">
                  <span className="px-2 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider bg-black/70 backdrop-blur-md text-primary border border-primary/30">
                    {series.statusTag || "Ongoing"}
                  </span>
                </div>

                {/* Hover Play Pill */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-heading text-xs shadow-lg transform group-hover:scale-105 transition-transform">
                    <Play size={13} fill="currentColor" />
                    <span>Watch Series</span>
                  </div>
                </div>

                {/* 🛡️ TRANSPARENT CLICK OVERLAY: Intercepts all clicks on the iframe/thumbnail and triggers SPA route */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${series.title}`}
                  onClick={() => handleSeriesClick(series.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSeriesClick(series.id);
                    }
                  }}
                  className="absolute inset-0 z-20 cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                />
              </div>

              {/* Bottom: Title & Episode Count Info */}
              <div
                className="p-3 flex-1 flex flex-col justify-between cursor-pointer bg-card/40 hover:bg-card/70 transition-colors"
                onClick={() => handleSeriesClick(series.id)}
              >
                <div>
                  <h4 className="text-xs font-heading text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                    {series.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-body mt-0.5 line-clamp-1">
                    {series.episodesSeason ||
                      `${series.knownTotalEpisodes || "Multiple"} Episodes`}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-body">
                  <span className="text-primary/90 font-medium">
                    /watch/{series.id}
                  </span>
                  <span>{series.releaseDay || "Weekly"}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

