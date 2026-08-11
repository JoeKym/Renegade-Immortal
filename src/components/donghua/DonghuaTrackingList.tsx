import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DONGHUA_SERIES, type DonghuaSeries } from "@/data/donghuaData";
import { Calendar, Clock, ExternalLink, Play, Filter, Tv } from "lucide-react";
import { Link } from "react-router-dom";
import { proxyImageUrl } from "@/lib/utils";

type DayFilter = "All" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

const DAYS: DayFilter[] = [
  "All",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function DonghuaTrackingList() {
  const [selectedDay, setSelectedDay] = useState<DayFilter>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSeries = useMemo(() => {
    return DONGHUA_SERIES.filter((series) => {
      // Day filter
      if (selectedDay !== "All") {
        if (series.releaseDay === "Multiple") {
          // Qi Refining is Tuesday and Saturday
          if (selectedDay !== "Tuesday" && selectedDay !== "Saturday") {
            return false;
          }
        } else if (series.releaseDay !== selectedDay) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "All") {
        if (selectedStatus === "Ongoing" && !series.statusTag?.includes("Ongoing")) {
          return false;
        }
        if (selectedStatus === "Completed" && !series.statusTag?.includes("Completed")) {
          return false;
        }
        if (selectedStatus === "Nian Fan" && !series.statusTag?.includes("Nian Fan")) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = series.title.toLowerCase().includes(q);
        const aliasMatch = series.aliases?.some((a) => a.toLowerCase().includes(q));
        if (!titleMatch && !aliasMatch) return false;
      }

      return true;
    });
  }, [selectedDay, selectedStatus, searchQuery]);

  const getStatusBadge = (statusTag?: string) => {
    if (!statusTag) return "bg-muted text-muted-foreground border-border";
    if (statusTag.includes("Nian Fan")) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
    if (statusTag.includes("Completed")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    return "bg-primary/10 text-primary border-primary/30";
  };

  return (
    <div className="gradient-card border border-border rounded-xl p-6 mb-12 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tv className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-xl text-primary tracking-wider">
              Ongoing Donghua Weekly Release Schedule & Tracking
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            Real-time episode counts, release times (GMT+8), and direct streaming sources.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search series or aliases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Filter Bar: Days of the week */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-heading text-muted-foreground tracking-wider uppercase">
            Release Day (GMT+8)
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1 rounded-lg text-xs font-body transition-all border ${
                selectedDay === day
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar: Status tags */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-heading text-muted-foreground tracking-wider uppercase">
            Status Filter:
          </span>
        </div>
        {[
          { label: "All Series", value: "All" },
          { label: "Ongoing", value: "Ongoing" },
          { label: "Nian Fan (Yearly)", value: "Nian Fan" },
          { label: "Completed", value: "Completed" },
        ].map((st) => (
          <button
            key={st.value}
            onClick={() => setSelectedStatus(st.value)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-body transition-colors border ${
              selectedStatus === st.value
                ? "bg-secondary text-secondary-foreground border-primary/40"
                : "bg-card text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Grid of tracked Donghua series */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSeries.map((series, idx) => (
          <motion.div
            key={series.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="group relative bg-card/60 hover:bg-card border border-border hover:border-primary/40 rounded-xl p-4 transition-all duration-300 flex flex-col justify-between shadow-md"
          >
            <div>
              {/* Thumbnail + Basic Info */}
              <div className="flex gap-3.5 mb-3">
                <img
                  src={proxyImageUrl(series.thumbnail)}
                  alt={series.title}
                  className="w-16 h-22 object-cover rounded-lg border border-border shadow shrink-0 group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] font-heading px-2 py-0.5 rounded border tracking-wider ${getStatusBadge(
                        series.statusTag
                      )}`}
                    >
                      {series.statusTag || "Ongoing"}
                    </span>
                  </div>
                  <h4 className="font-heading text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {series.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-body mt-1 line-clamp-2">
                    {series.episodesSeason}
                  </p>
                </div>
              </div>

              {/* Release Schedule Line */}
              {series.releaseSchedule && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/30 border border-border/50 text-xs font-body text-foreground/80 mb-3">
                  <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{series.releaseSchedule}</span>
                </div>
              )}
            </div>

            {/* Actions & Links */}
            <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
              <Link
                to={`/watch/${series.id}`}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-heading tracking-wider transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Watch on Site
              </Link>

              {/* Streaming Links */}
              {series.streamingLinks && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider mr-1">
                    Direct Links:
                  </span>
                  {series.streamingLinks.anime4i && (
                    <a
                      href={series.streamingLinks.anime4i}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] font-body text-foreground/80 hover:text-primary transition-colors border border-border"
                    >
                      <ExternalLink className="w-2.5 h-2.5" /> Anime4i
                    </a>
                  )}
                  {series.streamingLinks.luciferDonghuaOrg && (
                    <a
                      href={series.streamingLinks.luciferDonghuaOrg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] font-body text-foreground/80 hover:text-primary transition-colors border border-border"
                    >
                      <ExternalLink className="w-2.5 h-2.5" /> Lucifer (.org)
                    </a>
                  )}
                  {series.streamingLinks.luciferDonghuaIn && (
                    <a
                      href={series.streamingLinks.luciferDonghuaIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] font-body text-foreground/80 hover:text-primary transition-colors border border-border"
                    >
                      <ExternalLink className="w-2.5 h-2.5" /> Lucifer (.in)
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSeries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm font-heading text-muted-foreground">
            No Donghua series match your selected filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedDay("All");
              setSelectedStatus("All");
              setSearchQuery("");
            }}
            className="mt-3 px-3 py-1.5 text-xs font-body text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
