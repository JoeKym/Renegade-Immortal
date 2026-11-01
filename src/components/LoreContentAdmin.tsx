import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { ARTIFACT_ITEMS, type ArtifactItem } from "@/pages/Artifacts";
import { characters, type Character } from "@/data/charactersData";
import { supabase } from "@/integrations/supabase/client";
import { notifyLoreContentUpdated } from "@/contexts/LoreContentContext";
import {
  getDistinctLoreArcs,
  getLoreStoryArcs,
  isArtifactPayload,
  isCharacterPayload,
  isLoreContentType,
  loreContentId,
  normalizeArtifactPayload,
  normalizeCharacterPayload,
  type LoreContentType,
} from "@/lib/loreContent";
import type { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

interface LoreRecord {
  id: string;
  content_type: LoreContentType;
  payload: Json;
  is_published: boolean;
}

const contentTypeLabels: Record<LoreContentType, string> = {
  character: "Characters",
  artifact: "Artifacts",
  technique: "Techniques",
};

const bundledContent: Record<LoreContentType, Array<{ id: string; payload: Character | ArtifactItem }>> = {
  character: characters.map((payload) => ({ id: loreContentId(payload.name), payload })),
  artifact: ARTIFACT_ITEMS.filter((payload) => payload.type === "artifact").map((payload) => ({
    id: loreContentId(payload.name),
    payload,
  })),
  technique: ARTIFACT_ITEMS.filter((payload) => payload.type === "technique").map((payload) => ({
    id: loreContentId(payload.name),
    payload,
  })),
};

function blankPayload(type: LoreContentType) {
  if (type === "character") {
    return {
      name: "",
      race: "Human",
      alignment: "Ally",
      subtitle: "",
      description: "",
      tags: [],
    };
  }
  return {
    name: "",
    type,
    origin: "",
    owner: "",
    power: "",
    firstAppearance: "",
    storyArc: "",
  };
}

function getEditableArcs(payload: unknown, type: LoreContentType) {
  if (type === "character" && isCharacterPayload(payload)) return payload.storyArcs ?? [];
  if (type !== "character" && isArtifactPayload(payload)) return getLoreStoryArcs(payload);
  return [];
}

function parseArcText(value: string) {
  return getDistinctLoreArcs(value.split(/[\n,]/));
}

export default function LoreContentAdmin() {
  const { user } = useAuth();
  const [type, setType] = useState<LoreContentType>("character");
  const [records, setRecords] = useState<LoreRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [arcText, setArcText] = useState("");
  const [arcTextEdited, setArcTextEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const savedRecords = useMemo(() => records.filter((record) => record.content_type === type), [records, type]);
  const recordOptions = useMemo(() => {
    const options = new Map<string, { id: string; name: string }>();
    bundledContent[type].forEach(({ id, payload }) => options.set(id, { id, name: payload.name }));
    savedRecords.forEach(({ id, payload }) => {
      const name = typeof payload === "object" && payload !== null && "name" in payload ? payload.name : id;
      options.set(id, { id, name: typeof name === "string" ? name : id });
    });
    return [...options.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [savedRecords, type]);

  const selectedIsBundled = bundledContent[type].some((entry) => entry.id === selectedId);
  const selectedIsSaved = savedRecords.some((entry) => entry.id === selectedId);
  const arcSuggestions = useMemo(() => getDistinctLoreArcs([
    ...Object.values(bundledContent).flatMap((entries) =>
      entries.flatMap(({ payload }) => getLoreStoryArcs(payload))
    ),
    ...records.flatMap((record) => {
      if (record.content_type === "character" && isCharacterPayload(record.payload)) {
        return getLoreStoryArcs(record.payload);
      }
      if (record.content_type !== "character" && isArtifactPayload(record.payload)) {
        return getLoreStoryArcs(record.payload);
      }
      return [];
    }),
  ]), [records]);

  const loadRecords = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("lore_content")
      .select("id, content_type, payload, is_published")
      .order("content_type")
      .order("id");
    if (error) {
      toast.error("Could not load lore content");
      console.error("Could not load lore content in admin.", error);
    } else {
      setRecords(data.filter((record) => isLoreContentType(record.content_type)));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void loadRecords();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setEditorValue(JSON.stringify(blankPayload(type), null, 2));
      setArcText("");
      setArcTextEdited(false);
      return;
    }
    const saved = savedRecords.find((record) => record.id === selectedId);
    const bundled = bundledContent[type].find((record) => record.id === selectedId);
    const payload = saved?.payload ?? bundled?.payload;
    if (payload) {
      setEditorValue(JSON.stringify(payload, null, 2));
      setArcText(getEditableArcs(payload, type).join("\n"));
      setArcTextEdited(false);
    }
  }, [selectedId, savedRecords, type]);

  const handleSave = async () => {
    let payload: unknown;
    try {
      payload = JSON.parse(editorValue);
    } catch {
      toast.error("Content must be valid JSON");
      return;
    }
    const savedPayload = savedRecords.find((record) => record.id === selectedId)?.payload;
    const bundledPayload = bundledContent[type].find((record) => record.id === selectedId)?.payload;
    const existingPayload = savedPayload ?? bundledPayload;
    const normalizedPayload = type === "character"
      ? normalizeCharacterPayload(
        payload,
        isCharacterPayload(existingPayload) ? existingPayload : undefined,
      )
      : normalizeArtifactPayload(
        payload,
        type,
        isArtifactPayload(existingPayload) && existingPayload.type === type ? existingPayload : undefined,
      );
    if (!normalizedPayload) {
      toast.error(type === "character"
        ? "Add a name. Other character fields are optional; use 'role' or 'alignment' with a valid role and check any supplied field types."
        : "Add a name. Other item fields are optional; check the selected type and any supplied field types.");
      return;
    }
    const arcs = arcTextEdited ? parseArcText(arcText) : getLoreStoryArcs(normalizedPayload);
    const payloadWithArcs = { ...normalizedPayload, storyArcs: arcs };
    const id = selectedId || loreContentId(normalizedPayload.name);
    if (!id) {
      toast.error("Add a name before saving");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("lore_content").upsert({
      id,
      content_type: type,
      payload: payloadWithArcs as Json,
      is_published: true,
      updated_by: user?.id ?? null,
    });
    setIsSaving(false);
    if (error) {
      toast.error("Could not save lore content");
      console.error("Could not save lore content.", error);
      return;
    }
    toast.success("Lore content published");
    await loadRecords();
    setSelectedId(id);
    notifyLoreContentUpdated();
  };

  const handleRemoveOverride = async () => {
    const { error } = await supabase
      .from("lore_content")
      .delete()
      .eq("content_type", type)
      .eq("id", selectedId);
    if (error) {
      toast.error("Could not remove lore content");
      console.error("Could not remove lore content.", error);
      return;
    }
    toast.success(selectedIsBundled ? "Bundled version restored" : "Lore entry removed");
    await loadRecords();
    setSelectedId("");
    notifyLoreContentUpdated();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lore Content</CardTitle>
        <CardDescription>
          Add characters, artifacts, and techniques without editing source files. Existing entries can be overridden and restored to their bundled version.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content type</label>
            <Select value={type} onValueChange={(value) => {
              if (!isLoreContentType(value)) return;
              setType(value);
              setSelectedId("");
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(contentTypeLabels) as LoreContentType[]).map((value) => (
                  <SelectItem key={value} value={value}>{contentTypeLabels[value]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Entry</label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger><SelectValue placeholder="Choose an entry or create one" /></SelectTrigger>
              <SelectContent>
                {recordOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setSelectedId("")}>New entry</Button>
          {selectedIsSaved && (
            <Button variant="outline" onClick={() => void handleRemoveOverride()}>
              {selectedIsBundled ? "Restore bundled version" : "Delete entry"}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lore-content-arcs" className="text-sm font-medium">Story arc associations</label>
          <Textarea
            id="lore-content-arcs"
            value={arcText}
            onChange={(event) => {
              setArcText(event.target.value);
              setArcTextEdited(true);
            }}
            placeholder="One arc name per line, for example: Zhao Country — The Beginning"
            className="min-h-20"
          />
          <p className="text-xs text-muted-foreground">
            Add every relevant arc, one per line. Reuse an existing spelling to keep the Arc Explorer groups consistent.
          </p>
          {arcSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5" aria-label="Existing story arcs">
              {arcSuggestions.map((arc) => (
                <button
                  key={arc}
                  type="button"
                  onClick={() => setArcText((current) => getDistinctLoreArcs([...parseArcText(current), arc]).join("\n"))}
                  className="rounded border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {arc}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lore-content-json" className="text-sm font-medium">Entry details (JSON)</label>
          <Textarea
            id="lore-content-json"
            value={editorValue}
            onChange={(event) => setEditorValue(event.target.value)}
            className="min-h-[28rem] font-mono text-xs"
            spellCheck={false}
          />
          <p className="text-xs text-muted-foreground">
            For an existing entry, include only the fields you want to change; omitted fields stay unchanged. New entries need a name, and other fields are optional.
            Use <code>alignment</code> or <code>role</code> for a character’s role. String lists such as tags, techniques, and artifacts use JSON arrays.
            {selectedIsBundled && !selectedIsSaved ? " Saving creates a database override; the bundled entry remains available to restore." : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => void handleSave()} disabled={isLoading || isSaving}>
            {isSaving ? "Saving..." : selectedId ? "Save changes" : "Publish new entry"}
          </Button>
          <Button variant="ghost" onClick={() => void loadRecords()} disabled={isLoading}>Refresh</Button>
          {isLoading && <span className="text-sm text-muted-foreground">Loading saved entries...</span>}
        </div>
      </CardContent>
    </Card>
  );
}
