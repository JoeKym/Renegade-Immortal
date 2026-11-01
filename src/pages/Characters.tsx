import { useState, useMemo, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Search, ChevronDown, Heart, ScrollText, X, RotateCcw, UserRound, Sparkles, BookOpen, UsersRound } from "lucide-react";
import { CharacterRelationships } from "@/components/CharacterRelationships";
import { CharacterComments } from "@/components/CharacterComments";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLoreContent } from "@/contexts/LoreContentContext";
import { getDistinctLoreArcs, getLoreStoryArcs, isCharacterPayload, loreContentId, mergeLoreContent } from "@/lib/loreContent";
import {
  characters,
  alignments,
  alignmentColors,
  alignmentBorderColors,
  type Character,
} from "@/data/charactersData";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

function getCharacterSearchText(character: Character) {
  return normalizeSearchText([
    character.name,
    character.race,
    character.alignment,
    character.subtitle,
    character.description,
    character.alias,
    character.sect,
    character.master,
    character.status,
    character.firstAppearance,
    character.bloodline,
    character.cultivationRealm,
    ...(character.nicknames ?? []),
    ...(character.titles ?? []),
    ...(character.sectsLed ?? []),
    ...(character.planetaryAuthority ?? []),
    ...(character.nationalRoles ?? []),
    ...(character.disciples ?? []),
    ...(character.disciplesDetails ?? []).flatMap((detail) => [
      detail.name,
      detail.relationship,
      detail.description,
      detail.status,
    ]),
    ...(character.enemies ?? []),
    ...(character.tags ?? []),
    ...(character.techniques ?? []),
    ...(character.artifacts ?? []),
    ...(character.majorBattles ?? []),
    ...(character.dao ?? []),
    ...(character.quotes ?? []),
    ...getLoreStoryArcs(character),
  ].filter(Boolean).join(" "));
}

const CharactersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryChar = searchParams.get("q");
  const queryArc = searchParams.get("arc");
  
  const [search, setSearch] = useState(queryChar || "");
  const [race, setRace] = useState("All Races");
  const [alignment, setAlignment] = useState("All Roles");
  const [arcFilter, setArcFilter] = useState(queryArc || "All Arcs");
  const [realmFilter, setRealmFilter] = useState("All Realms");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [expandedChar, setExpandedChar] = useState<string | null>(queryChar || null);
  const { user, profile, refreshProfile } = useAuth();
  const { records } = useLoreContent();
  const [favorites, setFavorites] = useState<string[]>([]);
  const currentCharacters = useMemo(
    () => mergeLoreContent("character", characters, records, isCharacterPayload),
    [records],
  );
  const currentRaces = useMemo(
    () => ["All Races", ...new Set(currentCharacters.map((character) => character.race))],
    [currentCharacters],
  );
  const currentAlignments = useMemo(
    () => ["All Roles", ...new Set([
      ...alignments.filter((role) => role !== "All Roles"),
      ...currentCharacters.map((character) => character.alignment),
    ])],
    [currentCharacters],
  );
  const currentArcs = useMemo(
    () => getDistinctLoreArcs(currentCharacters.flatMap((character) => getLoreStoryArcs(character))),
    [currentCharacters],
  );
  const currentRealms = useMemo(
    () => [...new Set(currentCharacters.map((character) => character.cultivationRealm?.trim()).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)),
    [currentCharacters],
  );
  const currentStatuses = useMemo(
    () => [...new Set(currentCharacters.map((character) => character.status?.trim()).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)),
    [currentCharacters],
  );

  // Auto-expand character from URL query param on mount
  useEffect(() => {
    if (queryChar) {
      setSearch(queryChar);
      setExpandedChar(queryChar);
    }
  }, [queryChar]);

  useEffect(() => {
    setArcFilter(queryArc || "All Arcs");
  }, [queryArc]);

  useEffect(() => {
    if (profile?.favorite_characters) {
      setFavorites(profile.favorite_characters);
    }
  }, [profile]);

  const toggleFavorite = useCallback(async (charName: string) => {
    if (!user) {
      toast.error("Sign in to favorite characters");
      return;
    }
    const isFav = favorites.includes(charName);
    const updated = isFav ? favorites.filter(n => n !== charName) : [...favorites, charName];
    if (updated.length > 10) {
      toast.error("Maximum 10 favorite characters");
      return;
    }
    setFavorites(updated);
    const { error } = await supabase
      .from("profiles")
      .update({ favorite_characters: updated })
      .eq("user_id", user.id);
    if (error) {
      setFavorites(favorites);
      toast.error("Failed to update favorites");
    } else {
      toast.success(isFav ? `Removed ${charName}` : `Added ${charName} to favorites`);
      refreshProfile();
    }
  }, [user, favorites, refreshProfile]);

  const filtered = useMemo(() => {
    const searchTerms = normalizeSearchText(search).split(/\s+/).filter(Boolean);

    return currentCharacters.filter((c) => {
      const searchableText = getCharacterSearchText(c);
      const matchSearch = searchTerms.length === 0 || searchTerms.every((term) => searchableText.includes(term));
      const matchRace = race === "All Races" || c.race === race;
      const matchAlign = alignment === "All Roles" || c.alignment === alignment;
      const characterArcs = getLoreStoryArcs(c);
      const matchArc = arcFilter === "All Arcs" ||
        (arcFilter === "Unassigned" ? characterArcs.length === 0 :
          characterArcs.some((arc) => arc.toLowerCase() === arcFilter.toLowerCase()));
      const matchRealm = realmFilter === "All Realms" || c.cultivationRealm === realmFilter;
      const matchStatus = statusFilter === "All Statuses" || c.status === statusFilter;
      return matchSearch && matchRace && matchAlign && matchArc && matchRealm && matchStatus;
    });
  }, [currentCharacters, search, race, alignment, arcFilter, realmFilter, statusFilter]);

  const activeFilters: { id: string; label: string; remove: () => void }[] = [];
  if (search.trim()) activeFilters.push({
    id: "search",
    label: `Search: ${search.trim()}`,
    remove: () => {
      setSearch("");
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("q");
      setSearchParams(nextParams, { replace: true });
    },
  });
  if (race !== "All Races") activeFilters.push({ id: "race", label: `Race: ${race}`, remove: () => setRace("All Races") });
  if (alignment !== "All Roles") activeFilters.push({ id: "role", label: `Role: ${alignment}`, remove: () => setAlignment("All Roles") });
  if (arcFilter !== "All Arcs") activeFilters.push({
    id: "arc",
    label: `Arc: ${arcFilter}`,
    remove: () => {
      setArcFilter("All Arcs");
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("arc");
      setSearchParams(nextParams, { replace: true });
    },
  });
  if (realmFilter !== "All Realms") activeFilters.push({ id: "realm", label: `Realm: ${realmFilter}`, remove: () => setRealmFilter("All Realms") });
  if (statusFilter !== "All Statuses") activeFilters.push({ id: "status", label: `Status: ${statusFilter}`, remove: () => setStatusFilter("All Statuses") });

  const clearAllFilters = () => {
    setSearch("");
    setRace("All Races");
    setAlignment("All Roles");
    setArcFilter("All Arcs");
    setRealmFilter("All Realms");
    setStatusFilter("All Statuses");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
    nextParams.delete("arc");
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <Layout>
      <PageHero
        title="Characters"
        subtitle="Explore the legends, heroes, and ancient beings that shape the world of Xian Ni"
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Filters */}
          <div className="gradient-card border border-border rounded-lg p-5 md:p-6 mb-6">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-primary" />
              <input
                value={search}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearch(value);
                  const nextParams = new URLSearchParams(searchParams);
                  if (value) nextParams.set("q", value);
                  else nextParams.delete("q");
                  setSearchParams(nextParams, { replace: true });
                }}
                placeholder="Search names, aliases, sects, realms, techniques..."
                aria-label="Search characters"
                className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-body text-base md:text-lg border-b border-border pb-2 focus:border-primary transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    const nextParams = new URLSearchParams(searchParams);
                    nextParams.delete("q");
                    setSearchParams(nextParams, { replace: true });
                  }}
                  aria-label="Clear character search"
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <CharacterFilterSelect id="character-arc-filter" label="Story arc" value={arcFilter} onChange={(value) => {
                setArcFilter(value);
                const nextParams = new URLSearchParams(searchParams);
                if (value === "All Arcs") nextParams.delete("arc");
                else nextParams.set("arc", value);
                setSearchParams(nextParams, { replace: true });
              }} options={[
                ["All Arcs", "All arcs"],
                ...(currentCharacters.some((character) => getLoreStoryArcs(character).length === 0)
                  ? [["Unassigned", "Unassigned"] as [string, string]]
                  : []),
                ...currentArcs.map((arc) => [arc, arc] as [string, string]),
              ]} />
              <CharacterFilterSelect id="character-race-filter" label="Race" value={race} onChange={setRace} options={currentRaces.map((value) => [value, value === "All Races" ? "All races" : value])} />
              <CharacterFilterSelect id="character-role-filter" label="Role" value={alignment} onChange={setAlignment} options={currentAlignments.map((value) => [value, value === "All Roles" ? "All roles" : value])} />
              <CharacterFilterSelect id="character-realm-filter" label="Cultivation realm" value={realmFilter} onChange={setRealmFilter} options={[
                ["All Realms", "All realms"],
                ...currentRealms.map((value) => [value, value] as [string, string]),
              ]} />
              <CharacterFilterSelect id="character-status-filter" label="Status" value={statusFilter} onChange={setStatusFilter} options={[
                ["All Statuses", "All statuses"],
                ...currentStatuses.map((value) => [value, value] as [string, string]),
              ]} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Link to="/arcs" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                <ScrollText size={15} /> Browse the Arc Explorer
              </Link>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {currentCharacters.length} characters
              </p>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {activeFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={filter.remove}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  {filter.label}
                  <X size={13} />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw size={13} /> Clear all
              </button>
            </div>
          )}

          {/* Characters Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((char, i) => (
              <CharacterCard
                key={char.name}
                char={char}
                index={i}
                isExpanded={expandedChar === char.name}
                onToggle={() =>
                  setExpandedChar(
                    expandedChar === char.name ? null : char.name
                  )
                }
                isFavorite={favorites.includes(char.name)}
                onToggleFavorite={() => toggleFavorite(char.name)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-lg border border-border bg-card/60 px-5 py-12 text-center">
              <p className="mb-2 font-heading text-lg text-foreground">No characters found</p>
              <p className="mb-5 text-sm text-muted-foreground">Try a different search or remove one or more filters.</p>
              <button type="button" onClick={clearAllFilters} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                <RotateCcw size={15} /> Reset search and filters
              </button>
            </div>
          )}

          {/* Relationship Map */}
          <CharacterRelationships />

          {/* Ancient Races */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">
              The Three Ancient Races
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Ancient Gods",
                  desc: "Embody creation, order, and celestial authority.",
                  traits: [
                    "Supreme authority",
                    "Creation Daos",
                    "Pride in lineage",
                    "Resistance to change",
                  ],
                },
                {
                  title: "Ancient Demons",
                  desc: "Chaotic and powerful entities that embody instinct.",
                  traits: [
                    "Respect for strength",
                    "Chaotic but strategic",
                    "Complex honor codes",
                    "Bridge god and devil traits",
                  ],
                },
                {
                  title: "Ancient Devils",
                  desc: "The most destructive and least organized.",
                  traits: [
                    "Pure destructive power",
                    "Chaotic Dao mastery",
                    "Loose collectives",
                    "Feared across realms",
                  ],
                },
              ].map((r) => (
                <div
                  key={r.title}
                  className="gradient-card border border-border rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg text-primary tracking-wider mb-2">
                    {r.title}
                  </h3>
                  <p className="text-foreground/70 font-body text-sm mb-4">
                    {r.desc}
                  </p>
                  <ul className="space-y-1">
                    {r.traits.map((t) => (
                      <li
                        key={t}
                        className="text-xs text-muted-foreground font-body flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

function CharacterFilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-heading uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </div>
  );
}

function CharacterCard({
  char,
  index,
  isExpanded,
  onToggle,
  isFavorite,
  onToggleFavorite,
}: {
  char: Character;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const borderColor = alignmentBorderColors[char.alignment] ?? "border-border";
  const bgColor = alignmentColors[char.alignment] ?? "bg-muted";
  const [activeProfileSection, setActiveProfileSection] = useState("overview");
  const profileId = loreContentId(char.name);
  const storyArcs = getLoreStoryArcs(char);
  const profileSections = [
    { id: "overview", label: "Overview", icon: UserRound },
    { id: "relationships", label: "Relationships", icon: UsersRound },
    { id: "abilities", label: "Abilities & Treasures", icon: Sparkles },
    { id: "story", label: "Story", icon: BookOpen },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className={`gradient-card border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300 ${borderColor} flex flex-col ${
        isExpanded ? "sm:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Close" : "View"} ${char.name} profile`}
          className="group relative block w-full text-left"
        >
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted sm:aspect-[2/1] lg:aspect-[2.4/1]">
          {char.image ? (
            <img
              src={char.image}
              alt={char.name}
              loading="lazy"
              className="h-full w-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className={`flex h-full w-full flex-col items-center justify-center gap-2 ${bgColor}`}>
              <span className="font-heading text-4xl tracking-wider text-primary-foreground opacity-60">
                {getInitials(char.name)}
              </span>
              <span className="font-body text-xs italic text-primary-foreground/50">No image available</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/95 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="mb-1 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-primary/30 bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {char.alignment}
              </span>
              {char.status && (
                <span className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] text-foreground/80">
                  {char.status}
                </span>
              )}
            </div>
            <h3 className="font-heading text-xl tracking-wider text-primary drop-shadow-lg sm:text-2xl">
              {char.name}
            </h3>
            <p className="line-clamp-1 font-body text-xs text-foreground/75">{char.subtitle}</p>
          </div>
        </div>
        </button>

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${char.name} from favorites` : `Add ${char.name} to favorites`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 rounded-full border border-border/70 bg-background/80 p-2 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-red-500"
        >
          <Heart size={17} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="grid gap-2 sm:grid-cols-2">
          {char.cultivationRealm && <QuickStat label="Cultivation" value={char.cultivationRealm} />}
          {char.sect && <QuickStat label="Affiliation" value={char.sect} />}
          <QuickStat label="Race" value={char.race} />
          {char.master && <QuickStat label="Master" value={char.master} />}
        </div>
        {char.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {char.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded border border-primary/20 px-2 py-0.5 font-body text-[10px] text-primary/80">{tag}</span>
            ))}
            {char.tags.length > 3 && <span className="px-1 py-0.5 font-body text-[10px] text-muted-foreground">+{char.tags.length - 3} more</span>}
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          {isExpanded ? "Close profile" : "View full profile"}
          <ChevronDown size={16} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 sm:p-6">
              <div role="group" aria-label={`${char.name} profile sections`} className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
                {profileSections.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    id={`${profileId}-tab-${id}`}
                    aria-pressed={activeProfileSection === id}
                    onClick={() => setActiveProfileSection(id)}
                    className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm ${
                      activeProfileSection === id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={15} />{label}
                  </button>
                ))}
              </div>

              {activeProfileSection === "overview" && (
                <section aria-labelledby={`${profileId}-tab-overview`} className="space-y-5">
                  <p className="max-w-4xl text-sm leading-relaxed text-foreground/80">{char.description || "No overview has been added yet."}</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {char.alias && <ProfileField label="Aliases" value={char.alias} />}
                    {char.nicknames?.length ? <ProfileField label="Nicknames" value={char.nicknames.join(" • ")} /> : null}
                    {char.titles?.length ? <ProfileField label="Titles" value={char.titles.join(" • ")} /> : null}
                    {char.cultivationRealm && <ProfileField label="Cultivation realm" value={char.cultivationRealm} />}
                    {char.status && <ProfileField label="Status" value={char.status} />}
                    {char.bloodline && <ProfileField label="Bloodline" value={char.bloodline} />}
                    {char.sect && <ProfileField label="Affiliation" value={char.sect} />}
                    {char.firstAppearance && <ProfileField label="First appearance" value={char.firstAppearance} />}
                  </div>
                </section>
              )}

              {activeProfileSection === "relationships" && (
                <section aria-labelledby={`${profileId}-tab-relationships`} className="space-y-5">
                  {char.master && <RelatedNames label="Masters" value={char.master.split(",").map((name) => name.trim()).filter(Boolean)} />}
                  {char.disciples?.length ? <RelatedNames label="Disciples" value={char.disciples} /> : null}
                  {char.enemies?.length ? <RelatedNames label="Rivals & enemies" value={char.enemies} /> : null}
                  {char.disciplesDetails?.length ? (
                    <div>
                      <ProfileSectionHeading>Detailed relationships</ProfileSectionHeading>
                      <div className="grid gap-3 md:grid-cols-2">
                        {char.disciplesDetails.map((disciple, detailIndex) => (
                          <article key={`${disciple.name}-${detailIndex}`} className="rounded-lg border border-border bg-muted/30 p-4">
                            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                              <Link to={`/characters?q=${encodeURIComponent(disciple.name)}`} className="font-heading text-primary hover:underline">{disciple.name}</Link>
                              <span className="text-xs text-muted-foreground">{disciple.status}</span>
                            </div>
                            <p className="mb-1 text-xs text-primary/80">{disciple.relationship}</p>
                            <p className="text-sm leading-relaxed text-foreground/70">{disciple.description}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {!char.master && !char.disciples?.length && !char.enemies?.length && !char.disciplesDetails?.length && (
                    <p className="text-sm text-muted-foreground">No relationship details have been added yet.</p>
                  )}
                </section>
              )}

              {activeProfileSection === "abilities" && (
                <section aria-labelledby={`${profileId}-tab-abilities`} className="grid gap-6 md:grid-cols-2">
                  <LinkedLoreItems label="Daos" items={char.dao ?? []} href="/daos" tone="primary" />
                  <LinkedLoreItems label="Techniques" items={char.techniques ?? []} href="/artifacts" query="q" tone="jade" />
                  <LinkedLoreItems label="Artifacts & treasures" items={char.artifacts ?? []} href="/artifacts" query="q" tone="crimson" />
                  {char.bloodline && <ProfileField label="Bloodline" value={char.bloodline} />}
                  {!char.dao?.length && !char.techniques?.length && !char.artifacts?.length && !char.bloodline && (
                    <p className="text-sm text-muted-foreground">No abilities or treasures have been added yet.</p>
                  )}
                </section>
              )}

              {activeProfileSection === "story" && (
                <section aria-labelledby={`${profileId}-tab-story`} className="space-y-5">
                  <div>
                    <ProfileSectionHeading>Story arcs</ProfileSectionHeading>
                    {storyArcs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {storyArcs.map((arc) => (
                          <Link key={arc} to={`/arcs?q=${encodeURIComponent(arc)}`} className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10">{arc}</Link>
                        ))}
                      </div>
                    ) : <p className="text-sm text-muted-foreground">No story arcs have been assigned yet.</p>}
                  </div>
                  {char.sectsLed?.length ? <CharacterTextList label="Sects led" items={char.sectsLed} /> : null}
                  {char.planetaryAuthority?.length ? <CharacterTextList label="Planetary authority" items={char.planetaryAuthority} /> : null}
                  {char.nationalRoles?.length ? <CharacterTextList label="National & regional roles" items={char.nationalRoles} /> : null}
                  {char.majorBattles?.length ? <CharacterTextList label="Major battles" items={char.majorBattles} /> : null}
                  {char.quotes?.length ? (
                    <div>
                      <ProfileSectionHeading>Notable quotes</ProfileSectionHeading>
                      <div className="grid gap-3 md:grid-cols-2">
                        {char.quotes.map((quote, quoteIndex) => (
                          <blockquote key={`${quoteIndex}-${quote}`} className="rounded-r border-l-2 border-primary/40 bg-muted/30 px-4 py-3 text-sm italic leading-relaxed text-foreground/70">
                            “{quote}”
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              )}

              <div className="mt-6 border-t border-border pt-5">
                <CharacterComments
                  characterId={char.name.toLowerCase().replace(/\s+/g, "-")}
                  characterName={char.name}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProfileSectionHeading({ children }: { children: ReactNode }) {
  return <h4 className="mb-2 text-xs font-heading uppercase tracking-wider text-muted-foreground">{children}</h4>;
}

function CharacterTextList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <ProfileSectionHeading>{label}</ProfileSectionHeading>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 rounded-md bg-muted/30 px-3 py-2 text-sm text-foreground/75">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedNames({ label, value }: { label: string; value: string[] }) {
  return (
    <div>
      <ProfileSectionHeading>{label}</ProfileSectionHeading>
      <div className="flex flex-wrap gap-2">
        {value.map((name) => (
          <Link key={name} to={`/characters?q=${encodeURIComponent(name)}`} className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary">
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function LinkedLoreItems({
  label,
  items,
  href,
  query,
  tone,
}: {
  label: string;
  items: string[];
  href: string;
  query?: string;
  tone: "primary" | "jade" | "crimson";
}) {
  if (items.length === 0) return null;
  const toneClass = tone === "jade"
    ? "border-jade/30 text-jade hover:bg-jade/10"
    : tone === "crimson"
      ? "border-crimson/30 text-crimson hover:bg-crimson/10"
      : "border-primary/25 text-primary hover:bg-primary/10";
  return (
    <div>
      <ProfileSectionHeading>{label}</ProfileSectionHeading>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item}
            to={query ? `${href}?${query}=${encodeURIComponent(item)}` : href}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${toneClass}`}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="truncate">
      <span className="text-[10px] font-heading text-muted-foreground tracking-wider uppercase">{label}: </span>
      <span className="text-xs text-foreground/80 font-body">{value}</span>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-heading text-muted-foreground tracking-wider uppercase">
        {label}
      </span>
      <p className="text-sm text-foreground/80 font-body">{value}</p>
    </div>
  );
}

export default CharactersPage;
