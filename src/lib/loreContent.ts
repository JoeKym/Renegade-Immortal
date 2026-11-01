import type { Character } from "@/data/charactersData";
import type { ArtifactItem } from "@/pages/Artifacts";
import type { Json } from "@/integrations/supabase/types";
import {
  getNovelBookForChapter,
  getNovelBookLabel,
  isNovelBookNumber,
  parseNovelBookNumber,
  type NovelBookNumber,
} from "@/lib/novelBooks";

export type LoreContentType = "character" | "artifact" | "technique";

export interface LoreContentRecord {
  id: string;
  content_type: LoreContentType;
  payload: Json;
}

export interface LoreArcMembership {
  firstAppearanceBook?: number | null;
  firstAppearance?: string;
  name?: string;
  storyArcs?: string[];
  storyArc?: string;
}

export function getLoreFirstAppearanceBook(content: LoreArcMembership): NovelBookNumber | undefined {
  if (content.firstAppearanceBook === null) return undefined;
  if (isNovelBookNumber(content.firstAppearanceBook)) return content.firstAppearanceBook;

  const chapterMatch = content.firstAppearance?.trim().match(/^chapter\s*(\d+)/i);
  const chapterBook = chapterMatch ? getNovelBookForChapter(Number(chapterMatch[1])) : undefined;
  const legacyBook = (content.storyArcs ?? [])
    .map((arc) => /^volume\s*(1[0-3]|[1-9])$/i.test(arc.trim()) ? parseNovelBookNumber(arc) : undefined)
    .find(Boolean)
    ?? (/^volume\s*(1[0-3]|[1-9])$/i.test(content.storyArc?.trim() ?? "")
      ? parseNovelBookNumber(content.storyArc)
      : undefined)
    ?? chapterBook;
  return legacyBook;
}

export function getLoreStoryArcs(content: LoreArcMembership): string[] {
  const bookLabel = getNovelBookLabel(getLoreFirstAppearanceBook(content) ?? 0);
  return bookLabel ? [bookLabel] : [];
}

export function getDistinctLoreArcs(arcs: string[]): string[] {
  const unique = new Map<string, string>();
  arcs.forEach((arc) => {
    const trimmed = arc.trim();
    if (trimmed && !unique.has(trimmed.toLocaleLowerCase())) {
      unique.set(trimmed.toLocaleLowerCase(), trimmed);
    }
  });
  return [...unique.values()].sort((a, b) => a.localeCompare(b));
}

export function loreContentId(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionalString(value: Record<string, unknown>, key: string) {
  return value[key] === undefined || typeof value[key] === "string";
}

function isOptionalStringArray(value: Record<string, unknown>, key: string) {
  return value[key] === undefined || (
    Array.isArray(value[key]) &&
    value[key].every((item) => typeof item === "string")
  );
}

export function isCharacterPayload(value: unknown): value is Character {
  const alignments = ["Protagonist", "Ally", "Rival", "Antagonist", "Family", "Master", "Disciple", "Servant"];
  const optionalStringFields = [
    "alias", "sect", "master", "status", "firstAppearance", "bloodline", "cultivationRealm", "image",
  ];
  const optionalArrayFields = [
    "storyArcs", "nicknames", "titles", "sectsLed", "planetaryAuthority", "nationalRoles", "disciples", "enemies",
    "techniques", "artifacts", "majorBattles", "dao", "quotes",
  ];
  return (
    isObject(value) &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.race === "string" &&
    typeof value.alignment === "string" &&
    alignments.includes(value.alignment) &&
    typeof value.subtitle === "string" &&
    typeof value.description === "string" &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === "string") &&
    (value.firstAppearanceBook === undefined || value.firstAppearanceBook === null || isNovelBookNumber(value.firstAppearanceBook)) &&
    optionalStringFields.every((field) => isOptionalString(value, field)) &&
    optionalArrayFields.every((field) => isOptionalStringArray(value, field)) &&
    (value.disciplesDetails === undefined || (
      Array.isArray(value.disciplesDetails) &&
      value.disciplesDetails.every((detail) =>
        isObject(detail) &&
        typeof detail.name === "string" &&
        typeof detail.relationship === "string" &&
        typeof detail.description === "string" &&
        typeof detail.status === "string"
      )
    ))
  );
}

export function isArtifactPayload(value: unknown): value is ArtifactItem {
  return (
    isObject(value) &&
    (value.type === "artifact" || value.type === "technique") &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.origin === "string" &&
    typeof value.owner === "string" &&
    typeof value.power === "string" &&
    typeof value.firstAppearance === "string" &&
    typeof value.storyArc === "string" &&
    (value.firstAppearanceBook === undefined || value.firstAppearanceBook === null || isNovelBookNumber(value.firstAppearanceBook)) &&
    isOptionalString(value, "dao") &&
    isOptionalStringArray(value, "storyArcs")
  );
}

export function normalizeCharacterPayload(value: unknown, base?: Character): Character | null {
  if (!isObject(value)) return null;

  const { role, ...fields } = value;
  const candidate: Record<string, unknown> = {
    name: "",
    race: "Human",
    alignment: "Ally",
    subtitle: "",
    description: "",
    tags: [],
    ...base,
    ...fields,
    ...(typeof role === "string" ? { alignment: role } : {}),
  };

  if (typeof candidate.name === "string") candidate.name = candidate.name.trim();
  return isCharacterPayload(candidate) ? candidate : null;
}

export function normalizeArtifactPayload(
  value: unknown,
  type: "artifact" | "technique",
  base?: ArtifactItem,
): ArtifactItem | null {
  if (!isObject(value)) return null;

  const candidate: Record<string, unknown> = {
    name: "",
    origin: "",
    owner: "",
    power: "",
    firstAppearance: "",
    storyArc: "",
    ...base,
    ...value,
    type,
  };

  if (typeof candidate.name === "string") candidate.name = candidate.name.trim();
  return isArtifactPayload(candidate) ? candidate : null;
}

export function mergeLoreContent<T extends { name: string }>(
  type: LoreContentType,
  bundled: T[],
  records: LoreContentRecord[],
  isValid: (payload: unknown) => payload is T,
): T[] {
  const merged = new Map<string, T>();
  bundled.forEach((entry) => merged.set(loreContentId(entry.name), entry));

  records
    .filter((record) => record.content_type === type)
    .forEach((record) => {
      if (!isValid(record.payload)) {
        console.error(`Ignoring invalid ${type} lore content record "${record.id}".`);
        return;
      }
      merged.set(record.id, record.payload);
    });

  return [...merged.values()];
}

export function isLoreContentType(value: string): value is LoreContentType {
  return value === "character" || value === "artifact" || value === "technique";
}
