import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Tv, ArrowRightLeft, Info } from "lucide-react";

// Detailed mapping: each entry is [episodeStart, episodeEnd, chapterStart, chapterEnd, arcName]
const episodeMap: [number, number, number, number, string][] = [
  [1, 10, 1, 50, "Heng Yue Sect"],
  [11, 20, 51, 100, "Cultivation Beginnings"],
  [21, 30, 101, 150, "Ancient Bead Awakening"],
  [31, 40, 151, 200, "Zhao Country Trials"],
  [41, 50, 201, 250, "Ji Realm Climax"],
  [51, 60, 251, 350, "Sea of Devils"],
  [61, 70, 351, 430, "Corpse Sect Arc"],
  [71, 80, 431, 500, "Underworld Dao"],
  [81, 90, 501, 560, "Suzaku Star"],
  [91, 100, 561, 600, "Corporeal Realm Ascension"],
  [101, 110, 601, 700, "Allheaven Star System"],
  [111, 120, 701, 780, "Ancient God Awakening"],
  [121, 128, 781, 850, "Dao of Slaughter"],
  [129, 140, 851, 950, "Demon Sect Infiltration"],
  [141, 150, 951, 1000, "Tuo Sen Confrontation"],
  [151, 170, 1001, 1200, "Life & Death Dao"],
  [171, 185, 1201, 1300, "Karma Dao"],
  [186, 200, 1301, 1400, "True/False Dao"],
  [201, 220, 1401, 1600, "Space/Time Mastery"],
  [221, 250, 1601, 1800, "Cave System Revelation"],
  [251, 280, 1801, 1950, "Celestial War"],
  [281, 300, 1951, 2100, "True Transcendence"],
];

type Mode = "chapter" | "episode";

interface Result {
  episodes: string;
  chapters: string;
  arc: string;
}

export const ChapterConverter = () => {
  const [chapterInput, setChapterInput] = useState("");
  const [episodeInput, setEpisodeInput] = useState("");
  const [chapterFiltered, setChapterFiltered] = useState<Result[]>([]);
  const [episodeFiltered, setEpisodeFiltered] = useState<Result[]>([]);

  useEffect(() => {
    const num = parseInt(chapterInput);
    if (!isNaN(num) && num > 0) {
      setChapterFiltered(
        episodeMap
          .filter(([, , chS, chE]) => num >= chS && num <= chE)
          .map(([epS, epE, chS, chE, arc]) => ({ episodes: `${epS}–${epE}`, chapters: `${chS}–${chE}`, arc }))
      );
    } else {
      setChapterFiltered([]);
    }
  }, [chapterInput]);

  useEffect(() => {
    const num = parseInt(episodeInput);
    if (!isNaN(num) && num > 0) {
      setEpisodeFiltered(
        episodeMap
          .filter(([epS, epE]) => num >= epS && num <= epE)
          .map(([epS, epE, chS, chE, arc]) => ({ episodes: `${epS}–${epE}`, chapters: `${chS}–${chE}`, arc }))
      );
    } else {
      setEpisodeFiltered([]);
    }
  }, [episodeInput]);

  return (
    <div className="mb-12">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chapter to Episode */}
        <div className="gradient-card border border-border rounded-lg p-6">
          <h3 className="font-heading text-lg text-primary tracking-wider mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Chapter → Episode
          </h3>
          <p className="text-xs font-body text-muted-foreground mb-5">
            Look up which episodes adapt a specific novel chapter.
          </p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              min={1}
              value={chapterInput}
              onChange={(e) => setChapterInput(e.target.value)}
              placeholder="Enter chapter number (e.g. 450)"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>

          <AnimatePresence mode="wait">
            {chapterInput.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {chapterFiltered.length > 0 ? (
                  <div className="space-y-2">
                    {chapterFiltered.map((r, i) => (
                      <div key={i} className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-muted/20">
                        <div className="flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-primary" /><span className="text-sm font-heading tracking-wider">Episodes {r.episodes}</span></div>
                        <span className="text-xs text-muted-foreground font-body">Arc: {r.arc} ({r.chapters})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center border border-border border-dashed rounded-lg bg-muted/10">
                    <p className="text-sm font-body text-muted-foreground">No matching episodes found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Episode to Chapter */}
        <div className="gradient-card border border-border rounded-lg p-6">
          <h3 className="font-heading text-lg text-primary tracking-wider mb-2 flex items-center gap-2">
            <Tv className="w-4 h-4" /> Episode → Chapter
          </h3>
          <p className="text-xs font-body text-muted-foreground mb-5">
            Look up which chapters an episode covers.
          </p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              min={1}
              value={episodeInput}
              onChange={(e) => setEpisodeInput(e.target.value)}
              placeholder="Enter episode number (e.g. 75)"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>

          <AnimatePresence mode="wait">
            {episodeInput.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {episodeFiltered.length > 0 ? (
                  <div className="space-y-2">
                    {episodeFiltered.map((r, i) => (
                      <div key={i} className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-muted/20">
                        <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-primary" /><span className="text-sm font-heading tracking-wider">Chapters {r.chapters}</span></div>
                        <span className="text-xs text-muted-foreground font-body">Arc: {r.arc} (Eps {r.episodes})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center border border-border border-dashed rounded-lg bg-muted/10">
                    <p className="text-sm font-body text-muted-foreground">No matching chapters found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-body mt-4 flex items-center gap-1 border-t border-border/50 pt-3">
        <Info className="w-3 h-3 shrink-0" /> Mappings are approximate (~5–7 chapters per episode). Actual pacing varies by arc.
      </p>
    </div>
  );
};
