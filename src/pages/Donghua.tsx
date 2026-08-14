import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Tv, BookOpen, Clock, Calendar, Play, ChevronRight, TrendingUp, Loader2, Info, ExternalLink } from "lucide-react";
import { getDonghuaStats, getDonghuaArcs, type DonghuaArc } from "@/services/donghua";
import { ReleaseTimeline } from "@/components/donghua/ReleaseTimeline";
import { ChapterConverter } from "@/components/donghua/ChapterConverter";
import { DonghuaTrackingList } from "@/components/donghua/DonghuaTrackingList";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { getNextReleaseInfo } from "@/lib/releaseSchedule";
import { isCompletedSeries } from "@/lib/donghuaStatus";
import { useState, useEffect } from "react";

const DonghuaPage = () => {
  const [expandedArc, setExpandedArc] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    currentEpisode: number;
    totalEpisodes: number;
    currentChapter: number;
    totalChapters: number;
    episodeProgress: number;
    chapterProgress: number;
    currentArc: DonghuaArc | null;
  } | null>(null);
  const [arcs, setArcs] = useState<DonghuaArc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, arcsData] = await Promise.all([
          getDonghuaStats(),
          getDonghuaArcs(),
        ]);
        setStats(statsData);
        setArcs(arcsData);
      } catch (error) {
        console.error("Failed to fetch donghua data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const trackedSeries = DONGHUA_SERIES;
  const ongoingSeries = trackedSeries.filter((series) => !isCompletedSeries(series.statusTag));
  const ongoingCount = ongoingSeries.filter((series) => series.statusTag?.includes("Ongoing") || series.statusTag?.includes("Nian Fan")).length;
  const completedCount = trackedSeries.filter((series) => isCompletedSeries(series.statusTag)).length;
  const releaseDays = new Set(ongoingSeries.filter((series) => series.releaseDay).map((series) => series.releaseDay));
  const nextRelease = ongoingSeries
    .map((series) => ({ series, info: getNextReleaseInfo(series) }))
    .sort((a, b) => a.info.nextAiringDate.getTime() - b.info.nextAiringDate.getTime())[0];

  const statusColor = (s: string) =>
    s === "completed" ? "text-jade" : s === "airing" ? "text-primary" : "text-muted-foreground";
  const statusBadge = (s: string) =>
    s === "completed"
      ? "bg-jade/10 text-jade border-jade/20"
      : s === "airing"
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-muted text-muted-foreground border-border";

  return (
    <Layout>
      <PageHero
        title="Donghua Progress Tracker"
        subtitle="Track the animated adaptation of Er Gen's Renegade Immortal (仙逆)"
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Tv, label: "Series Tracked", value: `${trackedSeries.length}`, sub: "Live donghua roster" },
              { icon: BookOpen, label: "Ongoing", value: `${ongoingCount}`, sub: "Current live titles" },
              { icon: Clock, label: "Next Release", value: nextRelease ? nextRelease.info.timeUntilFormatted : "—", sub: nextRelease ? nextRelease.series.title : "No upcoming drop" },
              { icon: Calendar, label: "Release Days", value: `${releaseDays.size}`, sub: "Across the week" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="gradient-card border border-border rounded-lg p-5 text-center group hover:border-primary/30 transition-colors"
              >
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-heading text-primary tracking-wider">{stat.value}</p>
                <p className="font-heading text-xs text-muted-foreground tracking-wider mt-1">{stat.label}</p>
                <p className="text-xs text-foreground/50 font-body mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Live tracker summary */}
          <div className="gradient-card border border-border rounded-lg p-6 mb-12">
            <h3 className="font-heading text-lg text-primary tracking-wider mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Live Tracker Summary
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Active schedule</p>
                <p className="mt-2 text-2xl font-heading text-primary">{ongoingCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">Ongoing releases in the tracker</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Completed</p>
                <p className="mt-2 text-2xl font-heading text-primary">{completedCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">Finished or special-series entries</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Next drop</p>
                <p className="mt-2 text-lg font-heading text-primary">{nextRelease ? nextRelease.series.title : "No upcoming"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{nextRelease ? nextRelease.info.nextAiringFormattedCST : "Waiting for schedule data"}</p>
              </div>
            </div>
          </div>

          {/* Donghua Tracking & Weekly Release Schedule */}
          <DonghuaTrackingList />

          {/* Release Timeline */}
          <ReleaseTimeline />

          {/* Chapter Converter */}
          <ChapterConverter />

          {/* Story Arcs */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Story Arcs</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : arcs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No arc data available</p>
            ) : (
              arcs.map((arc, i) => {
                const isExpanded = expandedArc === arc.id;
                const episodes = `${arc.episode_start}–${arc.episode_end}`;
                const chapters = `${arc.chapter_start}–${arc.chapter_end}`;
                return (
                  <motion.div
                    key={arc.id}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={`gradient-card border rounded-lg overflow-hidden transition-colors cursor-pointer ${isExpanded ? "border-primary/40" : "border-border hover:border-primary/20"}`}
                    onClick={() => setExpandedArc(isExpanded ? null : arc.id)}
                  >
                    <div className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-heading tracking-wider border ${arc.status === "completed" ? "border-jade text-jade" : arc.status === "now_airing" ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-base text-foreground tracking-wider truncate">{arc.name}</h3>
                          <p className="text-xs text-muted-foreground font-body">Ep {episodes} • Ch {chapters}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-heading tracking-wider ${arc.status === "completed" ? "text-jade" : arc.status === "now_airing" ? "text-primary" : "text-muted-foreground"}`}>
                          {arc.status === "completed" ? "Completed" : arc.status === "now_airing" ? "Now Airing" : "Upcoming"}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 border-t border-border/50"
                      >
                        <p className="text-foreground/80 font-body text-sm leading-relaxed pt-4">
                          {arc.description}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Real source links from the tracked series data */}
          <div className="gradient-card border border-border rounded-lg p-6 mb-12">
            <h3 className="font-heading text-lg text-primary tracking-wider mb-4">Current Streaming & Source Links</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {DONGHUA_SERIES.filter((series) => series.streamingLinks)
                .slice(0, 8)
                .flatMap((series) => {
                  const links: Array<{ label: string; sub: string; url: string }> = [];
                  const streaming = series.streamingLinks || {};

                  if (streaming.anime4i) {
                    links.push({ label: `${series.title} • anime4i`, sub: "Episode page", url: streaming.anime4i });
                  }
                  if (streaming.luciferDonghuaOrg) {
                    links.push({ label: `${series.title} • luciferdonghua.org`, sub: "Mirror source", url: streaming.luciferDonghuaOrg });
                  }
                  if (streaming.luciferDonghuaIn) {
                    links.push({ label: `${series.title} • luciferdonghua.in`, sub: "Backup mirror source", url: streaming.luciferDonghuaIn });
                  }

                  return links;
                })
                .map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-50 cursor-pointer pointer-events-auto flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <div>
                      <p className="text-sm font-heading text-foreground tracking-wider group-hover:text-primary transition-colors">{link.label}</p>
                      <p className="text-xs font-body text-muted-foreground">{link.sub}</p>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            This page aggregates publicly available information and fan estimates. Actual release dates and episode counts may vary according to studio production schedules.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default DonghuaPage;
