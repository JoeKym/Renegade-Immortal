import Fuse from "fuse.js";
import type { Character } from "@/data/charactersData";
import type { DonghuaSeries } from "@/data/donghuaData";
import type { LoreContentRecord } from "@/lib/loreContent";
import { getAutoReleasedEpisodes, getNextReleaseInfo } from "@/lib/releaseSchedule";
import { buildWatchUrl } from "@/lib/slugParser";
import {
  getLoreStoryArcs,
  isArtifactPayload,
  isCharacterPayload,
  mergeLoreContent,
  type LoreContentType,
} from "@/lib/loreContent";
import type { ArtifactItem } from "@/pages/Artifacts";
import type { SearchResult } from "@/data/searchData";

export interface SearchIndexInput {
  baseResults?: SearchResult[];
  characters: Character[];
  loreRecords: LoreContentRecord[];
  artifactItems: ArtifactItem[];
  series: DonghuaSeries[];
  communities?: Array<{ id: string; name: string; description: string | null; category: string }>;
  profiles?: Array<{ username: string; display_name: string; bio: string | null }>;
  now?: Date;
}

function uniqueStrings(values: Array<string | undefined>): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))];
}

function characterResult(character: Character): SearchResult {
  const keywords = uniqueStrings([
    character.alias,
    ...(character.nicknames ?? []),
    ...(character.titles ?? []),
    character.sect,
    ...(character.sectsLed ?? []),
    character.master,
    ...(character.disciples ?? []),
    ...(character.enemies ?? []),
    ...(character.techniques ?? []),
    ...(character.artifacts ?? []),
    ...(character.majorBattles ?? []),
    ...(character.dao ?? []),
    character.race,
    character.status,
    character.firstAppearance,
  ]);

  return {
    id: `character:${character.name}`,
    title: character.name,
    category: "Character",
    description: [character.subtitle, character.description].filter(Boolean).join(" "),
    path: `/characters?q=${encodeURIComponent(character.name)}`,
    keywords,
    realm: character.cultivationRealm,
    alignment: character.alignment,
    tags: character.tags,
  };
}

function loreResult(item: ArtifactItem, type: LoreContentType): SearchResult {
  const itemArcs = getLoreStoryArcs(item);
  return {
    id: `${type}:${item.name}`,
    title: item.name,
    category: type === "technique" ? "Technique" : "Artifact",
    description: item.power,
    path: `/artifacts?q=${encodeURIComponent(item.name)}`,
    keywords: uniqueStrings([
      item.origin,
      item.owner,
      item.storyArc,
      ...(item.storyArcs ?? []),
      ...itemArcs,
      item.dao,
      item.firstAppearance,
    ]),
    tags: item.dao ? [item.dao] : undefined,
  };
}

function seriesResults(series: DonghuaSeries, now: Date): SearchResult[] {
  const aliases = series.aliases ?? [];
  const currentEpisode = getAutoReleasedEpisodes(series, now);
  const nextRelease = getNextReleaseInfo(series, now);
  const results: SearchResult[] = [
    {
      id: `series:${series.id}`,
      title: series.title,
      category: "Series",
      description: [series.episodesSeason, series.releaseSchedule, series.statusTag].filter(Boolean).join(" • "),
      path: buildWatchUrl(series.id),
      keywords: uniqueStrings([
        series.searchQuery,
        series.anilistSearch,
        series.jikanSearch,
        ...aliases,
        series.statusTag,
        series.releaseSchedule,
      ]),
      tags: aliases,
    },
  ];

  const lastEpisodeToIndex = currentEpisode + (nextRelease.showCountdown ? 1 : 0);
  for (let episodeNumber = 1; episodeNumber <= lastEpisodeToIndex; episodeNumber++) {
    const isUpcoming = episodeNumber > currentEpisode;
    results.push({
      id: `episode:${series.id}:${episodeNumber}`,
      title: `${series.title} Episode ${episodeNumber}`,
      category: "Episode",
      description: isUpcoming
        ? `Upcoming episode ${episodeNumber} of ${series.title}. ${nextRelease.nextAiringFormattedCST}.`
        : `Episode ${episodeNumber} of ${series.title}${series.episodesSeason ? ` • ${series.episodesSeason}` : ""}.`,
      path: buildWatchUrl(series.id, episodeNumber),
      keywords: uniqueStrings([
        ...aliases,
        series.title,
        `episode ${episodeNumber}`,
        `ep ${episodeNumber}`,
        `ep${episodeNumber}`,
      ]),
    });
  }

  return results;
}

function mergeSearchResults(results: SearchResult[]): SearchResult[] {
  const merged = new Map<string, SearchResult>();
  for (const result of results) {
    const key = `${result.category}:${result.title.trim().toLocaleLowerCase()}`;
    const previous = merged.get(key);
    if (!previous) {
      merged.set(key, result);
      continue;
    }

    merged.set(key, {
      ...previous,
      ...result,
      keywords: uniqueStrings([...(previous.keywords ?? []), ...(result.keywords ?? [])]),
      tags: uniqueStrings([...(previous.tags ?? []), ...(result.tags ?? [])]),
    });
  }
  return [...merged.values()];
}

export function buildSearchIndex({
  baseResults = [],
  characters,
  loreRecords,
  artifactItems,
  series,
  communities = [],
  profiles = [],
  now = new Date(),
}: SearchIndexInput): SearchResult[] {
  const mergedCharacters = mergeLoreContent("character", characters, loreRecords, isCharacterPayload);
  const bundledArtifacts = artifactItems.filter((item) => item.type === "artifact");
  const bundledTechniques = artifactItems.filter((item) => item.type === "technique");
  const artifacts = mergeLoreContent("artifact", bundledArtifacts, loreRecords, isArtifactPayload);
  const techniques = mergeLoreContent("technique", bundledTechniques, loreRecords, isArtifactPayload);

  return mergeSearchResults([
    ...baseResults,
    ...mergedCharacters.map(characterResult),
    ...artifacts.map((item) => loreResult(item, "artifact")),
    ...techniques.map((item) => loreResult(item, "technique")),
    ...series.flatMap((item) => seriesResults(item, now)),
    ...communities.map((community): SearchResult => ({
      id: `community:${community.id}`,
      title: community.name,
      category: "Sect",
      description: community.description || `${community.category} sect`,
      path: `/communities/${community.id}`,
      keywords: uniqueStrings([community.category]),
    })),
    ...profiles.map((profile): SearchResult => ({
      id: `account:${profile.username}`,
      title: profile.display_name,
      category: "Account",
      description: profile.bio || `Cultivator @${profile.username}`,
      path: `/cultivator/${encodeURIComponent(profile.username)}`,
      keywords: uniqueStrings([profile.username, `@${profile.username}`]),
    })),
  ]);
}

export function createSiteSearch(index: SearchResult[]) {
  return new Fuse(index, {
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
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    isCaseSensitive: false,
    findAllMatches: true,
    useExtendedSearch: true,
  });
}