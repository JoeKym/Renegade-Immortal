import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Search, ScrollText, Sword, Users, Wand2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useLoreContent } from "@/contexts/LoreContentContext";
import { characters as bundledCharacters, type Character } from "@/data/charactersData";
import { ARTIFACT_ITEMS, type ArtifactItem } from "@/pages/Artifacts";
import {
  getLoreStoryArcs,
  isArtifactPayload,
  isCharacterPayload,
  mergeLoreContent,
} from "@/lib/loreContent";
import { NOVEL_BOOK_OPTIONS } from "@/lib/novelBooks";

type LoreType = "character" | "artifact" | "technique";
type ExplorerFilter = "all" | LoreType;

interface ArcExplorerEntry {
  name: string;
  type: LoreType;
  arcs: string[];
  summary: string;
  searchable: string;
}

const typeLabels: Record<LoreType, string> = {
  character: "Character",
  artifact: "Artifact",
  technique: "Technique",
};

function getEntryLink(entry: ArcExplorerEntry, arc: string) {
  const params = new URLSearchParams({ q: entry.name });
  params.set("arc", arc);
  return `${entry.type === "character" ? "/characters" : "/artifacts"}?${params.toString()}`;
}

function EntryIcon({ type }: { type: LoreType }) {
  if (type === "character") return <Users size={15} className="text-primary" />;
  if (type === "artifact") return <Sword size={15} className="text-crimson" />;
  return <Wand2 size={15} className="text-jade" />;
}

export default function ArcExplorer() {
  const { records } = useLoreContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [search, setSearch] = useState(query);
  const [typeFilter, setTypeFilter] = useState<ExplorerFilter>("all");

  useEffect(() => {
    setSearch(query);
  }, [query]);

  const entries = useMemo(() => {
    const loreCharacters: Character[] = mergeLoreContent(
      "character",
      bundledCharacters,
      records,
      isCharacterPayload,
    );
    const loreItems: ArtifactItem[] = mergeLoreContent(
      "artifact",
      ARTIFACT_ITEMS,
      records,
      isArtifactPayload,
    ).concat(mergeLoreContent("technique", [], records, isArtifactPayload));

    return [
      ...loreCharacters.map((character): ArcExplorerEntry => ({
        name: character.name,
        type: "character",
        arcs: getLoreStoryArcs(character),
        summary: character.description,
        searchable: [
          character.name,
          character.subtitle,
          character.description,
          character.race,
          character.alignment,
          ...(character.tags ?? []),
          ...(character.techniques ?? []),
          ...(character.artifacts ?? []),
        ].join(" "),
      })),
      ...loreItems.map((item): ArcExplorerEntry => ({
        name: item.name,
        type: item.type,
        arcs: getLoreStoryArcs(item),
        summary: item.power,
        searchable: [item.name, item.owner, item.origin, item.power, item.dao, ...getLoreStoryArcs(item)].join(" "),
      })),
    ];
  }, [records]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return entries.filter((entry) => {
      const matchesType = typeFilter === "all" || entry.type === typeFilter;
      const matchesSearch = !query || entry.searchable.toLocaleLowerCase().includes(query) ||
        entry.arcs.some((arc) => arc.toLocaleLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [entries, search, typeFilter]);

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, ArcExplorerEntry[]>();
    filteredEntries.forEach((entry) => {
      const arcs = entry.arcs.length > 0 ? entry.arcs : ["Unassigned"];
      arcs.forEach((arc) => {
        const group = groups.get(arc) ?? [];
        group.push(entry);
        groups.set(arc, group);
      });
    });
    const arcs = NOVEL_BOOK_OPTIONS.map(({ label }) => label);
    if (groups.has("Unassigned")) arcs.push("Unassigned");
    return arcs.map((arc) => {
      const book = NOVEL_BOOK_OPTIONS.find(({ label }) => label === arc);
      return {
        name: arc,
        book,
        entries: [...(groups.get(arc) ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
      };
    });
  }, [filteredEntries]);

  const totalEntries = filteredEntries.length;

  return (
    <Layout>
      <PageHero
        title="Arc Explorer"
        subtitle="Find characters, treasures, and techniques by their first appearance in one of 13 novel volumes"
      />
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 rounded-lg border border-border gradient-card p-5 md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <Search size={18} className="text-primary" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearch(value);
                  const nextParams = new URLSearchParams(searchParams);
                  if (value) nextParams.set("q", value);
                  else nextParams.delete("q");
                  setSearchParams(nextParams, { replace: true });
                }}
                placeholder="Search arcs, characters, artifacts, and techniques..."
                className="min-w-0 flex-1 border-b border-border bg-transparent pb-2 font-body text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2" aria-label="Filter by lore type">
                {(["all", "character", "artifact", "technique"] as ExplorerFilter[]).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setTypeFilter(filter)}
                    aria-pressed={typeFilter === filter}
                    className={`rounded px-3 py-1.5 text-xs capitalize transition-colors ${
                      typeFilter === filter
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter === "all" ? "All entries" : `${filter}s`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalEntries} {totalEntries === 1 ? "entry" : "entries"} across 13 canonical books
              </p>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-3 text-sm">
            <Link to="/characters" className="text-primary hover:underline">Browse all characters</Link>
            <Link to="/artifacts" className="text-primary hover:underline">Browse artifacts & techniques</Link>
            <Link to="/timeline" className="inline-flex items-center gap-1 text-primary hover:underline">
              <BookOpen size={14} /> Read the story timeline
            </Link>
          </div>

          {totalEntries > 0 ? (
            <div className="space-y-10">
              {groupedEntries.map((group) => (
                <section key={group.name} aria-labelledby={`arc-${group.name}`}>
                  <div className="mb-4 flex items-end justify-between gap-3 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <ScrollText size={18} className="text-primary" />
                      <div>
                        <h2 id={`arc-${group.name}`} className="font-heading text-xl tracking-wider text-primary">{group.name}</h2>
                        {group.book && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {group.book.title}
                            {" · Chapters "}
                            {group.book.startChapter}
                            {"–"}
                            {group.book.endChapter}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{group.entries.length} entries</span>
                  </div>
                  {group.entries.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.entries.map((entry) => (
                        <Link
                          key={`${group.name}-${entry.type}-${entry.name}`}
                          to={getEntryLink(entry, group.name)}
                          className="group rounded-lg border border-border bg-card/70 p-4 transition-colors hover:border-primary/40 hover:bg-card"
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <EntryIcon type={entry.type} />
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{typeLabels[entry.type]}</span>
                          </div>
                          <h3 className="mb-2 font-heading text-base text-foreground group-hover:text-primary">{entry.name}</h3>
                          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                            No entries are assigned to this book yet.
                          </p>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-muted-foreground">
              No lore entries match this search. Try another name, arc, or content type.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
