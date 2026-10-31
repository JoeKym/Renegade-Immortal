import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Radio,
  CheckCircle2,
  Film,
  AlertTriangle,
  Play,
  Tv,
  Filter,
  Sparkles,
  ExternalLink,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DONGHUA_SERIES, type DonghuaSeries } from "@/data/donghuaData";
import { proxyImageUrl } from "@/lib/utils";
import { isCompletedSeries, isHiatusSeries } from "@/lib/donghuaStatus";

interface TimelineMilestone {
  seriesId: string;
  seasonLabel: string;
  episodesRange: string;
  releaseDateOrSchedule: string;
  status: "airing" | "hiatus" | "movie" | "completed";
  studio?: string;
  currentArcTitle: string;
  milestones: string[];
  notice?: {
    type: "warning" | "info" | "success";
    headline: string;
    body: string;
  };
}

export const DONGHUA_TIMELINE_ENTRIES: TimelineMilestone[] = [
  {
    seriesId: "renegade-immortal",
    seasonLabel: "Season 3 • Ongoing (Nian Fan)",
    episodesRange: "Episodes 1–163+ (Weekly Drops)",
    releaseDateOrSchedule: "Sundays at 1:00 PM (EAT) / 6:00 PM (CST)",
    status: "airing",
    studio: "Build Dream (铸梦动画) & Tencent Video",
    currentArcTitle: "Alliance Planet & Suzaku Country Realm",
    milestones: [
      "Zhao Country & Heng Yue Sect",
      "Sea of Devils & Teng Clan Vengeance",
      "Soul Formation & Ancient Demon Tuo Sen",
      "Suzaku Star Ascension & Allheaven Star Road",
    ],
  },
  {
    seriesId: "perfect-world",
    seasonLabel: "Broadcast Arc • Episode 288 Climax",
    episodesRange: "Episodes 1–288 Released (Production Hiatus)",
    releaseDateOrSchedule: "Production Hiatus — Resuming December 31, 2026",
    status: "hiatus",
    studio: "Foch Film (福煦影视) & Tencent Penguin Pictures",
    currentArcTitle: "Higher Realm Sovereign Climax & Pre-Hiatus Climax",
    milestones: [
      "Stone Village & Willow Deity Heritage",
      "Eight Desolations Sovereigns Clash",
      "Three Thousand Provinces Martial Meet",
      "Immortal Ancient Battlefield & Sovereign Climax (Ep 288)",
    ],
    notice: {
      type: "warning",
      headline: "13-Week Studio Production Hiatus (Resuming Dec 31, 2026)",
      body: "Tencent and animation studio Foch Film placed Perfect World on a scheduled 13-week production hiatus after Episode 288 to elevate animation quality, polish VFX, and faithfully adapt the climactic higher realm arcs. The series will officially return on December 31, 2026, with a special 2-episode double drop (Episodes 289 & 290)!",
    },
  },
  {
    seriesId: "swallowed-star",
    seasonLabel: "Seasons 3–4 • Ongoing (Nian Fan)",
    episodesRange: "Episodes 1–246+ (Weekly Drops)",
    releaseDateOrSchedule: "Mondays at 5:00 AM (EAT) / 10:00 AM (CST)",
    status: "airing",
    studio: "Sparkly Key Animation (玄机科技)",
    currentArcTitle: "Virtual Universe Company & Cosmic Origin Sector",
    milestones: [
      "Earth Great Nirvana & Golden Horned Beast",
      "Universe Genius Battle & Virtual Universe Primus",
      "Blood Luo Continent Ancient Secret",
      "Origin Star Battle & Domain Lord Breakthrough",
    ],
  },
  {
    seriesId: "battle-through-the-heavens",
    seasonLabel: "Season 5 • Central Plains Saga (Nian Fan)",
    episodesRange: "Episodes 1–215+ (Weekly Drops)",
    releaseDateOrSchedule: "Sundays at 5:00 AM (EAT) / 10:00 AM (CST)",
    status: "airing",
    studio: "Sparkly Key Animation & Motion Magic",
    currentArcTitle: "Central Plains & Pill Tower Sovereign Gathering",
    milestones: [
      "Three Year Agreement with Nalan Yanran",
      "Jia Nan Academy & Fallen Heart Flame Subjugation",
      "Black-Corner Domain & Xiao Clan Vengeance",
      "Central Plains Domain & Pill Tower Gathering",
    ],
  },
  {
    seriesId: "one-hundred-thousand-years-of-qi-refining",
    seasonLabel: "Continuous Airing (Bi-Weekly Drop)",
    episodesRange: "Episodes 1–387+ (Tuesday & Saturday Releases)",
    releaseDateOrSchedule: "Tuesdays & Saturdays at 5:00 AM (EAT)",
    status: "airing",
    studio: "Foch Film & Tencent",
    currentArcTitle: "Pure Yang Domain & Upper Realm Transcendence",
    milestones: [
      "Tian Lan Sect Rebirth",
      "66,000th Layer Qi Refining Breakthrough",
      "Immortal Realm Gate Destruction",
      "Pure Yang Ancestral Dao Awakening",
    ],
  },
  {
    seriesId: "shrouding-the-heavens",
    seasonLabel: "Season 1–2 • Ongoing (Nian Fan)",
    episodesRange: "Episodes 1–186+ (Weekly Drops)",
    releaseDateOrSchedule: "Wednesdays at 5:00 AM (EAT) / 10:00 AM (CST)",
    status: "airing",
    studio: "Sparkly Key Animation",
    currentArcTitle: "Big Dipper Domain & Ancient Emperor Secrets",
    milestones: [
      "Nine Dragons Pulling the Coffin Incident",
      "Ancient Desolate Sacred Body Awakening",
      "Big Dipper Eastern Wasteland Hegemony",
      "Imperial Path Climax & Battle Against Wang Teng",
    ],
  },
  {
    seriesId: "tales-of-herding-gods",
    seasonLabel: "Continuous Airing • Season 1",
    episodesRange: "Episodes 1–105+ (Weekly Drops)",
    releaseDateOrSchedule: "Sundays at 6:00 AM (EAT) / 11:00 AM (CST)",
    status: "airing",
    studio: "Sparkly Key Animation & Tencent",
    currentArcTitle: "Great Ruins Divine Heritage & Overlord Body",
    milestones: [
      "Disabled Elders Village Heritage",
      "Overlord Body Divine Awakening",
      "Four Great Heavenly Gates Trials",
    ],
  },
  {
    seriesId: "beyond-times-gaze",
    seasonLabel: "Seasons 1–2 • Ongoing",
    episodesRange: "Episodes 1–44+ (Weekly Drops)",
    releaseDateOrSchedule: "Saturdays at 5:00 AM (EAT) / 10:00 AM (CST)",
    status: "airing",
    studio: "Build Dream (铸梦动画) & Bilibili",
    currentArcTitle: "Seven Blood Eyes Sect & Ancient Scourge Era",
    milestones: [
      "God's Gaze Cataclysm & Survival in the Ruins",
      "Seven Blood Eyes Sect Apprenticeship",
      "Forbidden Sea & Ghost Hand Trial",
    ],
  },
  {
    seriesId: "record-of-a-mortals-journey-to-immortality",
    seasonLabel: "Seasons 1–7 • Ongoing Airing",
    episodesRange: "Episodes 1–196+ (Weekly Drops)",
    releaseDateOrSchedule: "Saturdays at 6:00 AM (EAT) / 11:00 AM (CST)",
    status: "airing",
    studio: "Original Force (原力动画) & Bilibili",
    currentArcTitle: "Starry Sea & Nascent Soul Realm Domain",
    milestones: [
      "Seven Mysteries Sect & Green Vial Discovery",
      "Yellow Maple Valley & State of Yue War",
      "Exile to the Chaotic Star Seas",
      "Nascent Soul Breakthrough & Heavenly Void Cauldron",
    ],
  },
  {
    seriesId: "gu-an",
    seasonLabel: "Season 1 • Ongoing Airing",
    episodesRange: "Episodes 1–14+ (Weekly Drops)",
    releaseDateOrSchedule: "Mondays at 5:00 AM (EAT)",
    status: "airing",
    studio: "Tencent Video",
    currentArcTitle: "One Slash Across the Heavens Debut",
    milestones: [
      "Immortal Sword Heritage Awakening",
      "Heavenly Domain Sword Sect Trial",
    ],
  },
  {
    seriesId: "a-good-day-to-ascend",
    seasonLabel: "Season 1 • Ongoing Airing",
    episodesRange: "Episodes 1–16+ (Weekly Drops)",
    releaseDateOrSchedule: "Saturdays at 4:00 AM (EAT)",
    status: "airing",
    studio: "Tencent Video",
    currentArcTitle: "Tribulation Ascension & Divine Comedy",
    milestones: [
      "Mortal Realm Cultivation Breakthrough",
      "Ascension Tribulation Lightning Tribulation",
    ],
  },
  {
    seriesId: "renegade-immortal-special",
    seasonLabel: "Feature Film • Special Extended Arc",
    episodesRange: "Battle of Gods (War of the Domains)",
    releaseDateOrSchedule: "Theatrical Special Film • Completed",
    status: "movie",
    studio: "Build Dream & Tencent Video",
    currentArcTitle: "Allheaven Star War & Domain Gods Duel",
    milestones: [
      "Allheaven Domain Clash",
      "Ancient God Full Avatar Release",
      "Domain God Subjugation",
    ],
  },
  {
    seriesId: "renegade-immortal-immortal-slayer",
    seasonLabel: "Theatrical Movie • Cultivation Film",
    episodesRange: "Battle of Immortal Slayer (Feature Film)",
    releaseDateOrSchedule: "Theatrical Movie Release • Completed",
    status: "movie",
    studio: "Build Dream & Tencent Video",
    currentArcTitle: "Immortal Slaying Saber & Divine Retribution",
    milestones: [
      "Slaughter Domain Condensation",
      "Nine Immortal Slaying Blades",
      "Transcendent Victory",
    ],
  },
  {
    seriesId: "perfect-world-the-movie",
    seasonLabel: "Theatrical Movie • Feature Film",
    episodesRange: "Nine Tribulations Burning Heaven (Movie)",
    releaseDateOrSchedule: "Theatrical Film • Completed",
    status: "movie",
    studio: "Foch Film",
    currentArcTitle: "Ashes of Perfect Fire & Sovereign Battle",
    milestones: [
      "Nine Heavenly Tribulations Trial",
      "Primordial Fire Rebirth",
    ],
  },
  {
    seriesId: "swallowed-star-blood-luo-continent",
    seasonLabel: "Theatrical Movie • Special Film",
    episodesRange: "Blood Luo Continent (Special Feature)",
    releaseDateOrSchedule: "Theatrical Movie • Completed",
    status: "movie",
    studio: "Sparkly Key Animation",
    currentArcTitle: "Blood River Crystal Secret & Ancient Beast",
    milestones: [
      "Blood Luo World Descent",
      "Blood River Crystal Fusion",
    ],
  },
  {
    seriesId: "tomb-of-fallen-gods",
    seasonLabel: "Seasons 1–3 • Landmark Arc",
    episodesRange: "Episodes 1–52 (Complete)",
    releaseDateOrSchedule: "Completed (Season 3 Ended July 2026)",
    status: "completed",
    studio: "Sparkly Key Animation & Youku",
    currentArcTitle: "Gods Cemetery Resurrection & Divine Mystery",
    milestones: [
      "Ancient Cemetery Awakening",
      "Chu Country Royal Academy Hegemony",
      "Divine Dragon Clan & Heavenly Dao Conflict",
    ],
  },
  {
    seriesId: "spy-x-sect",
    seasonLabel: "Season 1 • Full Arc",
    episodesRange: "Episodes 1–152 (Complete)",
    releaseDateOrSchedule: "Completed (Season 1 Ended May 2026)",
    status: "completed",
    studio: "Foch Film & Bilibili",
    currentArcTitle: "All Female Spies in My Sect Comedy Arc",
    milestones: [
      "Sect Master Disciples Recruitment",
      "Counter-Espionage Comedy Trials",
      "Unified Sect Domination",
    ],
  },
];

type TimelineFilter = "all" | "airing" | "hiatus" | "movie" | "completed";

export const ReleaseTimeline = () => {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all");
  const [search, setSearch] = useState("");

  const filteredTimeline = useMemo(() => {
    return DONGHUA_TIMELINE_ENTRIES.filter((entry) => {
      // Filter tab
      if (activeFilter !== "all" && entry.status !== activeFilter) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const series = DONGHUA_SERIES.find((s) => s.id === entry.seriesId);
        const matchTitle = series?.title.toLowerCase().includes(q);
        const matchArc = entry.currentArcTitle.toLowerCase().includes(q);
        const matchMilestone = entry.milestones.some((m) =>
          m.toLowerCase().includes(q)
        );
        const matchSeason = entry.seasonLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchArc && !matchMilestone && !matchSeason) {
          return false;
        }
      }

      return true;
    });
  }, [activeFilter, search]);

  const statusBadge = (s: TimelineMilestone["status"]) => {
    switch (s) {
      case "airing":
        return {
          icon: <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />,
          label: "Ongoing Airing",
          classes: "bg-primary/10 text-primary border-primary/30",
          nodeBorder: "border-primary text-primary shadow-primary/20",
          lineColor: "bg-primary/60",
        };
      case "hiatus":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />,
          label: "Studio Hiatus (Resumes Dec 31)",
          classes: "bg-amber-500/15 text-amber-300 border-amber-500/40 font-semibold shadow-sm",
          nodeBorder: "border-amber-400 text-amber-400 shadow-amber-400/20",
          lineColor: "bg-amber-500/60",
        };
      case "movie":
        return {
          icon: <Film className="w-3.5 h-3.5 text-purple-400" />,
          label: "Theatrical Movie / Special",
          classes: "bg-purple-500/10 text-purple-300 border-purple-500/30",
          nodeBorder: "border-purple-400 text-purple-400 shadow-purple-400/20",
          lineColor: "bg-purple-500/60",
        };
      case "completed":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: "Arc Completed",
          classes: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          nodeBorder: "border-emerald-400 text-emerald-400 shadow-emerald-400/20",
          lineColor: "bg-emerald-500/60",
        };
    }
  };

  return (
    <div className="gradient-card border border-border rounded-xl p-6 mb-12 shadow-xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-xl text-primary tracking-wider">
              Donghua Release & Production Timeline
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            Chronological progression, weekly broadcasting schedules, theatrical specials, and verified studio production notices.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", label: "All Timelines" },
              { id: "airing", label: "Ongoing Airing" },
              { id: "hiatus", label: "Studio Hiatus" },
              { id: "movie", label: "Movies & Specials" },
              { id: "completed", label: "Completed Sagas" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading tracking-wide transition-all ${
                activeFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-2 sm:pl-4">
        {filteredTimeline.map((item, i) => {
          const series = DONGHUA_SERIES.find((s) => s.id === item.seriesId);
          const badge = statusBadge(item.status);
          const thumbUrl = proxyImageUrl(series?.thumbnail);

          return (
            <motion.div
              key={item.seriesId + item.seasonLabel}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="relative flex gap-4 sm:gap-6 pb-10 last:pb-2 group"
            >
              {/* Connecting Vertical Track */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`relative z-10 w-9 h-9 rounded-full bg-background border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${badge.nodeBorder}`}
                >
                  {badge.icon}
                </div>
                {i < filteredTimeline.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 my-1.5 rounded-full opacity-40 group-hover:opacity-80 transition-opacity ${badge.lineColor}`}
                  />
                )}
              </div>

              {/* Card Body */}
              <div className="min-w-0 flex-1">
                <div
                  className={`rounded-xl border p-4 sm:p-5 transition-all shadow-md ${
                    item.status === "hiatus"
                      ? "border-amber-500/50 bg-amber-950/20 shadow-amber-950/30"
                      : "border-border/80 bg-card/60 hover:border-primary/50 hover:bg-card/90"
                  }`}
                >
                  {/* Top Bar: Title, Series Slug, Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {thumbUrl && (
                        <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0 bg-black/60 border border-border/80">
                          <img
                            src={thumbUrl}
                            alt={series?.title || item.seriesId}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-heading text-base sm:text-lg text-foreground tracking-wide group-hover:text-primary transition-colors">
                            {series?.title || item.seriesId}
                          </h4>
                          {series?.releaseDay && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-body bg-black/50 text-foreground/80 border border-border">
                              {series.releaseDay}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-body text-primary/90 mt-0.5">
                          {item.seasonLabel} • {item.episodesRange}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading border ${badge.classes}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Studio Hiatus Alert Card (e.g. Perfect World Resumption Banner) */}
                  {item.notice && (
                    <div className="mt-3 mb-4 p-3.5 rounded-lg border border-amber-500/60 bg-amber-500/10 text-amber-100 text-xs font-body leading-relaxed flex items-start gap-3 shadow-sm">
                      <AlertTriangle
                        size={20}
                        className="text-amber-400 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="font-heading text-sm text-amber-300 font-semibold mb-1">
                          {item.notice.headline}
                        </p>
                        <p className="text-amber-200/90 leading-relaxed">
                          {item.notice.body}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Metadata Row: Broadcast schedule & Animation studio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body text-muted-foreground pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-primary shrink-0" />
                      <span>{item.releaseDateOrSchedule}</span>
                    </div>
                    {item.studio && (
                      <div className="flex items-center gap-2">
                        <Tv size={13} className="text-primary shrink-0" />
                        <span className="truncate">{item.studio}</span>
                      </div>
                    )}
                  </div>

                  {/* Current Arc & Milestones */}
                  <div className="mt-3.5 pt-3 border-t border-border/40">
                    <p className="text-[11px] font-heading uppercase tracking-wider text-muted-foreground mb-1.5">
                      Current Story Arc:{" "}
                      <span className="text-foreground font-normal">
                        {item.currentArcTitle}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.milestones.map((milestone, idx) => (
                        <span
                          key={milestone}
                          className="text-xs font-body px-2.5 py-1 rounded-md border border-border/60 bg-muted/40 text-foreground/80 flex items-center gap-1"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary/70" />
                          {milestone}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-body">
                      Watch on platform: <code className="text-primary">/watch/{item.seriesId}</code>
                    </span>
                    <Link
                      to={`/watch/${item.seriesId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground font-heading text-xs transition-colors"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Watch Series</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredTimeline.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-body text-sm">
            No donghua release timeline entries match your filter.
          </div>
        )}
      </div>
    </div>
  );
};
