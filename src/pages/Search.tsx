import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Fuse from "fuse.js";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Search as SearchIcon, Clock3, Sparkles } from "lucide-react";
import { searchableData } from "@/data/searchData";

const categories = [
  "All",
  "Character",
  "Dao",
  "Artifact",
  "Technique",
  "Page",
  "News",
  "Series",
  "Profile",
  "Search",
];

const popularSearches = [
  "Wang Lin",
  "Li Muwan",
  "Heaven Rending Sword",
  "Life & Death Domain",
  "Renegade Immortal",
  "Donghua",
  "Communities",
  "News",
  "Dao",
  "Artifacts",
];

const fuse = new Fuse(searchableData, {
  keys: [
    { name: "title", weight: 3 },
    { name: "category", weight: 1.5 },
    { name: "description", weight: 1.2 },
    { name: "keywords", weight: 2 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  useExtendedSearch: true,
});

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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
      const next = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      localStorage.setItem("renegade-search-history", JSON.stringify(next));
      return next;
    });
  };

  const suggestions = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return popularSearches.slice(0, 6);

    const fromPopular = popularSearches.filter((term) => term.toLowerCase().includes(trimmed.toLowerCase()));
    const fromIndex = fuse.search(trimmed).slice(0, 6).map((match) => match.item.title);
    const combined = [...fromPopular, ...fromIndex].filter((term, index, items) => items.indexOf(term) === index);

    return combined.slice(0, 6);
  }, [query]);

  const rawResults = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    return fuse
      .search(trimmed)
      .map((item) => {
        const title = item.item.title.toLowerCase();
        const description = item.item.description.toLowerCase();
        const normalizedQuery = trimmed.toLowerCase();

        let scoreBoost = 0;
        if (title.includes(normalizedQuery)) scoreBoost += 20;
        if (description.includes(normalizedQuery)) scoreBoost += 5;
        if (item.item.category.toLowerCase() === normalizedQuery) scoreBoost += 15;

        return { ...item.item, score: item.score ?? 0, scoreBoost };
      })
      .sort((a, b) => (b.scoreBoost + (1 - (b.score ?? 0))) - (a.scoreBoost + (1 - (a.score ?? 0))));
  }, [query]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((category) => {
      counts[category] = category === "All" ? rawResults.length : rawResults.filter((result) => result.category === category).length;
    });
    return counts;
  }, [rawResults]);

  const results = useMemo(() => {
    return rawResults.filter((item) => (activeCategory === "All" ? true : item.category === activeCategory)).slice(0, 30);
  }, [rawResults, activeCategory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
    recordSearch(trimmed);
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setSearchParams({ q: term });
    recordSearch(term);
  };

  return (
    <Layout>
      <PageHero
        title="Search the site"
        subtitle="Search everything in the Renegade Immortal universe — characters, daos, artifacts, pages, episodes, communities, and more."
      />

      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <SearchIcon className="h-5 w-5 text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything in the website..."
                className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="submit"
                className="rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-heading text-primary hover:bg-primary/15"
              >
                Search
              </button>
            </div>
          </form>

          {!query.trim() && (
            <div className="mb-8 space-y-4">
              <div>
                <p className="mb-3 text-xs font-heading uppercase tracking-[0.28em] text-primary">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {recentSearches.length > 0 && (
                <div>
                  <p className="mb-3 flex items-center gap-2 text-xs font-heading uppercase tracking-[0.28em] text-primary">
                    <Clock3 className="h-3.5 w-3.5" /> Recent searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSuggestionClick(term)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
                Enter a keyword to search the whole site.
              </div>
            </div>
          )}

          {query.trim() && (
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-heading transition-colors ${
                      activeCategory === category
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {category} {category === "All" ? `(${categoryCounts.All || 0})` : `(${categoryCounts[category] || 0})`}
                  </button>
                ))}
              </div>

              <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {results.length} result{results.length === 1 ? "" : "s"} found in {activeCategory === "All" ? "all categories" : activeCategory}
              </div>
            </div>
          )}

          {query.trim() && suggestions.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {suggestions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSuggestionClick(term)}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary/80 transition-colors hover:bg-primary/10"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No site-wide results found for “{query.trim()}”. Try a character, artifact, dao, series, or page name.
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, index) => (
                <a
                  key={`${result.title}-${index}`}
                  href={result.path}
                  className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/20"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[10px] font-heading uppercase tracking-[0.24em] text-primary">{result.category}</span>
                    {result.score && (
                      <span className="text-[10px] text-muted-foreground">Match score {Math.max(0, Math.round((1 - result.score) * 100))}%</span>
                    )}
                  </div>
                  <h3 className="text-xl font-heading text-foreground">{result.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>
                  <p className="mt-3 text-xs text-primary/80">Open result → {result.path}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
