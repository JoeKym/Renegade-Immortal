import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useDonghuaCatalog } from "@/contexts/DonghuaCatalogContext";
import type { DonghuaSeries } from "@/data/donghuaData";
import { Loader2, Plus, Save, Tv } from "lucide-react";

type ReleaseDay = NonNullable<DonghuaSeries["releaseDay"]>;
type StatusTag = NonNullable<DonghuaSeries["statusTag"]>;

const releaseDays: ReleaseDay[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Multiple",
];
const statusTags: StatusTag[] = [
  "Ongoing", "Ongoing (Nian Fan)", "Completed", "Completed Special Series",
  "Completed / Ongoing Season 2", "Hiatus", "Movie", "Special",
];

interface CatalogForm {
  id: string;
  title: string;
  thumbnail: string;
  aliases: string;
  knownTotalEpisodes: string;
  anchorDate: string;
  statusTag: StatusTag;
  releaseDay: ReleaseDay | "";
  releaseTime: string;
  releaseSchedule: string;
  parentSeriesId: string;
  anime4i: string;
  luciferDonghuaOrg: string;
  luciferDonghuaIn: string;
}

function toLocalDateTime(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function createForm(series?: DonghuaSeries): CatalogForm {
  return {
    id: series?.id || "",
    title: series?.title || "",
    thumbnail: series?.thumbnail || "",
    aliases: series?.aliases?.join(", ") || "",
    knownTotalEpisodes: String(series?.knownTotalEpisodes ?? 0),
    anchorDate: toLocalDateTime(series?.anchorDate) || toLocalDateTime(new Date().toISOString()),
    statusTag: series?.statusTag || "Ongoing",
    releaseDay: series?.releaseDay || "",
    releaseTime: series?.releaseTime || "",
    releaseSchedule: series?.releaseSchedule || "",
    parentSeriesId: series?.parentSeriesId || "",
    anime4i: series?.streamingLinks?.anime4i || "",
    luciferDonghuaOrg: series?.streamingLinks?.luciferDonghuaOrg || "",
    luciferDonghuaIn: series?.streamingLinks?.luciferDonghuaIn || "",
  };
}

function validHttpsUrl(value: string): boolean {
  if (!value) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default function DonghuaCatalogAdmin() {
  const { series, refresh } = useDonghuaCatalog();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(() => createForm());
  const [saving, setSaving] = useState(false);

  const selectedSeries = useMemo(
    () => series.find((item) => item.id === selectedId),
    [series, selectedId],
  );
  const parentOptions = series.filter((item) => item.id !== form.id);
  const updateForm = <K extends keyof CatalogForm>(key: K, value: CatalogForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const beginNew = () => {
    setSelectedId(null);
    setForm(createForm());
  };

  const beginEdit = (item: DonghuaSeries) => {
    setSelectedId(item.id);
    setForm(createForm(item));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = form.id.trim().toLowerCase();
    const title = form.title.trim();
    const episodeCount = Number(form.knownTotalEpisodes);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      toast.error("Use a lowercase URL slug with letters, numbers, and hyphens.");
      return;
    }
    if (!title || !form.thumbnail.trim()) {
      toast.error("Title and cover image URL are required.");
      return;
    }
    if (!Number.isInteger(episodeCount) || episodeCount < 0) {
      toast.error("Episode count must be a non-negative whole number.");
      return;
    }
    if (!form.anchorDate || Number.isNaN(new Date(form.anchorDate).getTime())) {
      toast.error("Set the date and time the current episode count is accurate as of.");
      return;
    }
    if (![form.anime4i, form.luciferDonghuaOrg, form.luciferDonghuaIn].every(validHttpsUrl)) {
      toast.error("Streaming source links must be valid HTTPS URLs.");
      return;
    }
    if (selectedId && id !== selectedId) {
      toast.error("An existing title's ID cannot be changed.");
      return;
    }

    const existing = selectedSeries;
    const payload: DonghuaSeries = {
      ...existing,
      id,
      title,
      searchQuery: existing?.searchQuery || title,
      anilistSearch: existing?.anilistSearch || title,
      jikanSearch: existing?.jikanSearch || title,
      nextEpisodeSlug: existing?.nextEpisodeSlug || id,
      serverSlug: existing?.serverSlug || id,
      thumbnail: form.thumbnail.trim(),
      aliases: form.aliases.split(",").map((alias) => alias.trim()).filter(Boolean),
      knownTotalEpisodes: episodeCount,
      anchorEpisode: episodeCount,
      anchorDate: new Date(form.anchorDate).toISOString(),
      statusTag: form.statusTag,
      releaseDay: form.releaseDay || undefined,
      releaseTime: form.releaseTime.trim() || undefined,
      releaseSchedule: form.releaseSchedule.trim() || undefined,
      parentSeriesId: form.parentSeriesId || undefined,
      streamingLinks: {
        anime4i: form.anime4i.trim() || undefined,
        luciferDonghuaOrg: form.luciferDonghuaOrg.trim() || undefined,
        luciferDonghuaIn: form.luciferDonghuaIn.trim() || undefined,
      },
    };

    try {
      setSaving(true);
      const { error } = await supabase.from("donghua_catalog").upsert({
        id,
        payload,
        is_published: true,
        updated_by: user?.id || null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      setSelectedId(id);
      toast.success(`${title} saved and published.`);
      try {
        await refresh();
      } catch (error) {
        console.error("Donghua catalog entry was saved, but the catalog could not be refreshed:", error);
        toast.warning("Saved successfully, but the public catalog did not refresh. Reload the page to see the update.");
      }
    } catch (error) {
      console.error("Could not save donghua catalog entry:", error);
      toast.error("Could not save the catalog entry. Confirm the donghua catalog migration is installed and retry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Tv className="h-5 w-5 text-primary" />
            Donghua Catalog
          </CardTitle>
          <CardDescription>
            Edit tracked shows, movies, episode counts, schedules, and streaming sources.
          </CardDescription>
          <Button type="button" onClick={beginNew} className="mt-2 gap-2 self-start">
            <Plus size={16} /> Add title
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {series.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                selectedId === item.id ? "border-primary/50 bg-primary/5" : "border-border"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate font-heading text-sm">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.statusTag || "Tracked"} • {item.knownTotalEpisodes ?? 0} episodes
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => beginEdit(item)}>
                Edit
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-heading">{selectedId ? "Edit title" : "Add a donghua title"}</CardTitle>
          <CardDescription>
            Changes publish immediately to the tracker and watch pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="catalog-id">URL slug</Label>
              <Input
                id="catalog-id"
                value={form.id}
                onChange={(event) => updateForm("id", event.target.value)}
                disabled={Boolean(selectedId)}
                placeholder="my-donghua-title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-title">Title</Label>
              <Input id="catalog-title" value={form.title} onChange={(event) => updateForm("title", event.target.value)} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="catalog-thumbnail">Cover image URL</Label>
              <Input id="catalog-thumbnail" type="url" value={form.thumbnail} onChange={(event) => updateForm("thumbnail", event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-episodes">Current episode count</Label>
              <Input id="catalog-episodes" type="number" min="0" step="1" value={form.knownTotalEpisodes} onChange={(event) => updateForm("knownTotalEpisodes", event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-anchor-date">Count accurate as of</Label>
              <Input id="catalog-anchor-date" type="datetime-local" value={form.anchorDate} onChange={(event) => updateForm("anchorDate", event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-status">Status</Label>
              <select id="catalog-status" value={form.statusTag} onChange={(event) => updateForm("statusTag", event.target.value as StatusTag)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {statusTags.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-release-day">Release day</Label>
              <select id="catalog-release-day" value={form.releaseDay} onChange={(event) => updateForm("releaseDay", event.target.value as ReleaseDay | "")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">No regular release day</option>
                {releaseDays.map((day) => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-release-time">Release time and timezone</Label>
              <Input id="catalog-release-time" value={form.releaseTime} onChange={(event) => updateForm("releaseTime", event.target.value)} placeholder="1:00 PM (EAT)" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="catalog-schedule">Schedule note</Label>
              <Input id="catalog-schedule" value={form.releaseSchedule} onChange={(event) => updateForm("releaseSchedule", event.target.value)} placeholder="Weekly release or hiatus note" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="catalog-aliases">Aliases (comma-separated)</Label>
              <Textarea id="catalog-aliases" value={form.aliases} onChange={(event) => updateForm("aliases", event.target.value)} rows={2} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="catalog-parent">Related series (for movies and specials)</Label>
              <select id="catalog-parent" value={form.parentSeriesId} onChange={(event) => updateForm("parentSeriesId", event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">None</option>
                {parentOptions.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="catalog-anime4i">Anime4i source URL</Label>
              <Input id="catalog-anime4i" type="url" value={form.anime4i} onChange={(event) => updateForm("anime4i", event.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="catalog-lucifer-org">LuciferDonghua.org source URL</Label>
              <Input id="catalog-lucifer-org" type="url" value={form.luciferDonghuaOrg} onChange={(event) => updateForm("luciferDonghuaOrg", event.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="catalog-lucifer-in">LuciferDonghua.in source URL</Label>
              <Input id="catalog-lucifer-in" type="url" value={form.luciferDonghuaIn} onChange={(event) => updateForm("luciferDonghuaIn", event.target.value)} />
            </div>
            <Button type="submit" className="gap-2 sm:col-span-2" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save and publish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
