import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Fuse from "fuse.js";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import {
  Search as SearchIcon,
  Clock3,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  Tag,
  BookOpen,
  Zap,
  Layers,
  Compass
} from "lucide-react";
import { searchableData, type SearchResult } from "@/data/searchData";
import { toast } from "sonner";

const categories = [
  "All",
  "Character",
  "Dao",
  "Cultivation",
  "Lore",
  "Multiverse",
  "Timeline",
  "Donghua",
  "Episode",
  "Artifact",
  "Technique",
  "Location",
  "Community",
  "Account",
  "Guide",
  "Page",
  "Series",
];

const popularSearches = [
  "Wang Lin",
  "14 Essences",
  "Li Muwan",
  "Heaven-Defying Bead",
  "Planet Suzaku",
  "Episode 153",
  "Tu Si",
  "Situ Nan",
  "Slaughter Dao",
  "4th Step",
  "Er Gen Multiverse",
  "Heng Yue Sect",
  "Cultivators Union",
  "Beginner Guide",
];

const categoryBadgeStyles: Record<string, string> = {
  Character: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Dao: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Cultivation: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Lore: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Multiverse: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Timeline: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Donghua: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Episode: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Artifact: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Technique: "bg-red-500/20 text-red-400 border-red-500/30",
  Location: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Community: "bg-gold-500/20 text-amber-300 border-amber-400/30",
  Account: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  Guide: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Page: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Series: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  News: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const fuse = new Fuse(searchableData, {
  keys: [
    { name: "title", weight: 3 },
    { name: "keywords", weight: 2.5 },
    { name: "tags", weight: 2 },
    { name: "category", weight: 1.5 },
    { name: "realm", weight: 1.2 },
    { name: "alignment", weight: 1.2 },
    { name: "description", weight: 1 },
  ],
  threshold: 0.42,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  isCaseSensitive: false,
  findAllMatches: true,
  useExtendedSearch: true,
});

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCat = searchParams.get("cat") ?? "All";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState<"relevance" | "alphabetical" | "category">("relevance");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [searchTimeMs, setSearchTimeMs] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("renegade-search-history");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const recordSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;

    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      localStorage.setItem("renegade-search-history", JSON.stringify(next));
      return next;
    });
  };

  const rawResults = useMemo(() => {
    const startTime = performance.now();
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchTimeMs(0);
      return [];
    }

    const matches = fuse.search(trimmed).map((item) => {
      const title = item.item.title.toLowerCase();
      const description = item.item.description.toLowerCase();
      const normalizedQuery = trimmed.toLowerCase();

      let scoreBoost = 0;
      if (title.includes(normalizedQuery)) scoreBoost += 25;
      if (title === normalizedQuery) scoreBoost += 50;
      if (description.includes(normalizedQuery)) scoreBoost += 8;
      if (item.item.category.toLowerCase() === normalizedQuery) scoreBoost += 20;

      return {
        ...item.item,
        score: item.score ?? 0,
        scoreBoost,
      };
    });

    const elapsed = Math.round(performance.now() - startTime);
    setSearchTimeMs(elapsed);
    return matches;
  }, [query]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((category) => {
      counts[category] =
        category === "All"
          ? rawResults.length
          : rawResults.filter((result) => result.category === category).length;
    });
    return counts;
  }, [rawResults]);

  const sortedResults = useMemo(() => {
    let filtered = rawResults.filter((item) =>
      activeCategory === "All" ? true : item.category === activeCategory
    );

    if (sortBy === "alphabetical") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "category") {
      filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category));
    } else {
      filtered = [...filtered].sort(
        (a, b) => b.scoreBoost + (1 - (b.score ?? 0)) - (a.scoreBoost + (1 - (a.score ?? 0)))
      );
    }

    return filtered;
  }, [rawResults, activeCategory, sortBy]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed, cat: activeCategory });
    recordSearch(trimmed);
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setSearchParams({ q: term, cat: activeCategory });
    recordSearch(term);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (query.trim()) {
      setSearchParams({ q: query.trim(), cat });
    }
  };

  const copyResultLink = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <Layout>
      <PageHero
        title="Site-Wide Search Engine"
        subtitle="Search all Renegade Immortal lore, characters, daos, essences, cultivation realms, timeline, donghua episodes, artifacts, locations, communities & guides."
      />

      <section className="py-10">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Main Search Input Form */}
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SearchIcon className="h-6 w-6 text-primary shrink-0 ml-1" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search characters, 14 essences, cultivation realms, episodes, artifacts, lore..."
                className="flex-1 bg-transparent text-lg sm:text-xl text-foreground placeholder:text-muted-foreground outline-none font-body"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearchParams({});
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 font-heading text-sm text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Preset Category Pills Header */}
          <div className="mb-6 flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => {
                const count = categoryCounts[category] || 0;
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-heading transition-all shrink-0 ${isActive
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                        : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                  >
                    {category} {query.trim() && <span className="ml-1 opacity-80">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats & Sort Bar */}
          {query.trim() && (
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  Found <strong className="text-foreground font-semibold">{sortedResults.length}</strong> result{sortedResults.length === 1 ? "" : "s"}
                  {activeCategory !== "All" && ` in category "${activeCategory}"`} (indexed {searchableData.length} items in {searchTimeMs}ms)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-heading uppercase tracking-wider text-[11px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-card border border-border rounded-lg px-2.5 py-1 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="relevance">Relevance</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                  <option value="category">Group by Category</option>
                </select>
              </div>
            </div>
          )}

          {/* Popular Search Pills & Recent Queries */}
          {!query.trim() && (
            <div className="mb-10 space-y-6">
              <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="h-4 w-4 text-primary" />
                  <p className="text-xs font-heading uppercase tracking-[0.24em] text-primary font-bold">
                    Quick Search Engine Suggestions
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="rounded-full border border-border bg-muted/30 px-3.5 py-1.5 text-xs text-foreground/80 font-body transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {recentSearches.length > 0 && (
                <div className="rounded-2xl border border-border bg-card/40 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock3 className="h-4 w-4 text-amber-400" />
                    <p className="text-xs font-heading uppercase tracking-[0.24em] text-amber-400 font-bold">
                      Your Recent Searches
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSuggestionClick(term)}
                        className="rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-amber-400/40 hover:text-amber-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Engine Highlights Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 text-amber-400 font-heading text-sm mb-2">
                    <Layers className="h-4 w-4" /> 14 Essences & Daos
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Search Ethereal, Corporeal, and Special Essences, Five Elements True Body, and Slaughter clone techniques.
                  </p>
                  <button
                    onClick={() => handleSuggestionClick("14 Essences")}
                    className="mt-3 text-xs text-primary underline font-medium"
                  >
                    Explore Daos &rarr;
                  </button>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 text-cyan-400 font-heading text-sm mb-2">
                    <Zap className="h-4 w-4" /> Donghua & Episodes
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Direct access to Donghua release schedules, episode breakdowns, and streaming source mirrors.
                  </p>
                  <button
                    onClick={() => handleSuggestionClick("Donghua")}
                    className="mt-3 text-xs text-primary underline font-medium"
                  >
                    Watch Episodes &rarr;
                  </button>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 text-emerald-400 font-heading text-sm mb-2">
                    <BookOpen className="h-4 w-4" /> Cultivation & Lore
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete stage progression from Qi Condensation to 4th-Step Transcendence and Ancient God tomb secrets.
                  </p>
                  <button
                    onClick={() => handleSuggestionClick("Cultivation")}
                    className="mt-3 text-xs text-primary underline font-medium"
                  >
                    View Realms &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Zero Results View */}
          {query.trim() && sortedResults.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-4 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading text-foreground">No matches found for “{query.trim()}”</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Try searching for a character name (Wang Lin, Situ Nan, Li Muwan), a technique (Call the Wind, Soul Flag), an essence, or a cultivation stage.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("All");
                    setSearchParams({});
                  }}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-heading text-muted-foreground hover:text-foreground"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Grid / List */}
          {sortedResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedResults.map((result, index) => {
                const badgeStyle =
                  categoryBadgeStyles[result.category] ||
                  "bg-primary/20 text-primary border-primary/30";

                return (
                  <div
                    key={`${result.title}-${index}`}
                    className="group relative rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/50 hover:bg-card/90 hover:shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider ${badgeStyle}`}>
                          {result.category}
                        </span>

                        {result.realm && (
                          <span className="text-[11px] font-medium text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            {result.realm}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {result.title}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {result.description}
                      </p>

                      {/* Tag Chips */}
                      {result.tags && result.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {result.tags.map((t) => (
                            <button
                              key={t}
                              onClick={() => handleSuggestionClick(t)}
                              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary bg-muted/40 hover:bg-primary/10 border border-border/50 px-2 py-0.5 rounded transition-colors"
                            >
                              <Tag className="h-2.5 w-2.5" /> #{t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Card Actions */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                      <button
                        onClick={() => navigate(result.path)}
                        className="inline-flex items-center gap-1.5 text-primary font-heading font-semibold hover:underline"
                      >
                        Explore Result <ExternalLink className="h-3 w-3" />
                      </button>

                      <button
                        onClick={() => copyResultLink(result.path)}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px]"
                        title="Copy link"
                      >
                        {copiedPath === result.path ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Share
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
