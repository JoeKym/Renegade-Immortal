import { supabase } from "@/integrations/supabase/client";
import { DONGHUA_SERIES } from "@/data/donghuaData";

export interface DonghuaArc {
  id: string;
  name: string;
  description: string;
  episode_start: number;
  episode_end: number;
  chapter_start: number;
  chapter_end: number;
  status: "completed" | "now_airing" | "upcoming";
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface DonghuaEpisode {
  id: string;
  episode_number: number;
  chapter_start: number;
  chapter_end: number;
  air_date: string | null;
  status: "aired" | "upcoming";
  created_at: string;
}

export interface DonghuaProgress {
  id: string;
  current_episode: number;
  total_episodes: number;
  current_chapter: number;
  total_chapters: number;
  last_updated: string;
}

const STORAGE_PROGRESS_KEY = "admin_donghua_progress";
const STORAGE_ARCS_KEY = "admin_donghua_arcs";

const DEFAULT_PROGRESS_DATA: DonghuaProgress = {
  id: "default-progress",
  current_episode: 160,
  total_episodes: 433,
  current_chapter: 795,
  total_chapters: 2137,
  last_updated: new Date().toISOString(),
};

// Sync progress with DONGHUA_SERIES memory object
function syncWithDonghuaSeries(progress: DonghuaProgress) {
  const renegade = DONGHUA_SERIES.find((s) => s.id === "renegade-immortal");
  if (renegade) {
    renegade.knownTotalEpisodes = progress.current_episode;
    renegade.episodesSeason = `Episodes 1–${progress.current_episode}+ | Ongoing`;
  }
}

// Fetch all arcs
export const getDonghuaArcs = async (): Promise<DonghuaArc[]> => {
  try {
    const { data, error } = await supabase
      .from("donghua_arcs")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      localStorage.setItem(STORAGE_ARCS_KEY, JSON.stringify(data));
      return data;
    }
  } catch (_err) {
    // Fallback below
  }

  const cached = localStorage.getItem(STORAGE_ARCS_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_e) { }
  }

  return [];
};

export const ensureDonghuaProgress = async (): Promise<DonghuaProgress> => {
  const existing = await getDonghuaProgress();
  if (existing) return existing;
  return updateDonghuaProgress(DEFAULT_PROGRESS_DATA);
};

// Fetch current progress
export const getDonghuaProgress = async (): Promise<DonghuaProgress | null> => {
  try {
    const { data, error } = await supabase
      .from("donghua_progress")
      .select("*")
      .single();

    if (!error && data) {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(data));
      syncWithDonghuaSeries(data);
      return data;
    }
  } catch (_e) {
    // Fallback to localStorage below
  }

  const cached = localStorage.getItem(STORAGE_PROGRESS_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      syncWithDonghuaSeries(parsed);
      return parsed;
    } catch (_e) { }
  }

  syncWithDonghuaSeries(DEFAULT_PROGRESS_DATA);
  return DEFAULT_PROGRESS_DATA;
};

// Fetch episode release breakdown
export const getEpisodeBreakdown = async (): Promise<DonghuaEpisode[]> => {
  const { data, error } = await supabase
    .from("donghua_episodes")
    .select("*")
    .order("episode_number", { ascending: true });

  if (error) {
    console.error("Error fetching episode breakdown:", error);
    return [];
  }

  return data || [];
};

// Update progress (admin only)
export const updateDonghuaProgress = async (
  progress: Partial<DonghuaProgress>
): Promise<DonghuaProgress> => {
  const existingCached = localStorage.getItem(STORAGE_PROGRESS_KEY);
  const currentObj = existingCached ? JSON.parse(existingCached) : DEFAULT_PROGRESS_DATA;

  const updated: DonghuaProgress = {
    ...currentObj,
    ...progress,
    last_updated: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(updated));
  syncWithDonghuaSeries(updated);
  window.dispatchEvent(new CustomEvent("donghua_progress_updated", { detail: updated }));

  try {
    const { data: existing } = await supabase
      .from("donghua_progress")
      .select("id")
      .maybeSingle();

    const updateData = {
      ...updated,
      ...(existing?.id ? { id: existing.id } : {}),
    };

    const { data, error } = await supabase
      .from("donghua_progress")
      .upsert(updateData)
      .select()
      .single();

    if (!error && data) {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(data));
      syncWithDonghuaSeries(data);
      return data;
    }
  } catch (err) {
    console.warn("Supabase progress update fallback to local:", err);
  }

  return updated;
};

// Update arc status (admin only)
export const updateArcStatus = async (
  arcId: string,
  status: DonghuaArc["status"]
): Promise<DonghuaArc> => {
  const cachedArcs = await getDonghuaArcs();
  const targetArc = cachedArcs.find((a) => a.id === arcId);
  const updatedArc: DonghuaArc = targetArc
    ? { ...targetArc, status, updated_at: new Date().toISOString() }
    : {
      id: arcId,
      name: "Arc",
      description: "",
      episode_start: 1,
      episode_end: 50,
      chapter_start: 1,
      chapter_end: 300,
      status,
      order_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

  const updatedArcs = cachedArcs.map((a) => (a.id === arcId ? updatedArc : a));
  localStorage.setItem(STORAGE_ARCS_KEY, JSON.stringify(updatedArcs));
  window.dispatchEvent(new CustomEvent("donghua_arcs_updated", { detail: updatedArcs }));

  try {
    const { data, error } = await supabase
      .from("donghua_arcs")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", arcId)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Supabase arc status update fallback:", err);
  }

  return updatedArc;
};

// Add new episode (admin only)
export const addEpisode = async (
  episode: Omit<DonghuaEpisode, "id" | "created_at">
): Promise<DonghuaEpisode> => {
  const { data, error } = await supabase
    .from("donghua_episodes")
    .insert(episode)
    .select()
    .single();

  if (error) {
    console.error("Error adding episode:", error);
    throw error;
  }

  return data;
};

// Get simplified progress stats for display
export const getDonghuaStats = async () => {
  const [progress, arcs] = await Promise.all([
    getDonghuaProgress(),
    getDonghuaArcs(),
  ]);

  if (!progress) {
    return null;
  }

  const currentArc = arcs.find(
    (arc) =>
      progress.current_episode >= arc.episode_start &&
      progress.current_episode <= arc.episode_end
  );

  return {
    currentEpisode: progress.current_episode,
    totalEpisodes: progress.total_episodes,
    currentChapter: progress.current_chapter,
    totalChapters: progress.total_chapters,
    episodeProgress: Math.round(
      (progress.current_episode / progress.total_episodes) * 100
    ),
    chapterProgress: Math.round(
      (progress.current_chapter / progress.total_chapters) * 100
    ),
    currentArc: currentArc || null,
  };
};
