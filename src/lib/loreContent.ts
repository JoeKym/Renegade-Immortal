import type { Character } from "@/data/charactersData";
import type { ArtifactItem } from "@/pages/Artifacts";
import type { Json } from "@/integrations/supabase/types";

export type LoreContentType = "character" | "artifact" | "technique";

export interface LoreContentRecord {
  id: string;
  content_type: LoreContentType;
  payload: Json;
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
    "nicknames", "titles", "sectsLed", "planetaryAuthority", "nationalRoles", "disciples", "enemies",
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
    isOptionalString(value, "dao")
  );
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
