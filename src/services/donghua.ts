import { supabase } from "@/integrations/supabase/client";

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

// Fetch all arcs
export const getDonghuaArcs = async (): Promise<DonghuaArc[]> => {
  const { data, error } = await supabase
    .from("donghua_arcs")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching donghua arcs:", error);
    throw error;
  }

  return data || [];
};

// Fetch current progress
export const getDonghuaProgress = async (): Promise<DonghuaProgress | null> => {
  const { data, error } = await supabase
    .from("donghua_progress")
    .select("*")
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching donghua progress:", error);
    throw error;
  }

  return data;
};

// Fetch episode release breakdown
export const getEpisodeBreakdown = async (): Promise<DonghuaEpisode[]> => {
  const { data, error } = await supabase
    .from("donghua_episodes")
    .select("*")
    .order("episode_number", { ascending: true });

  if (error) {
    console.error("Error fetching episode breakdown:", error);
    throw error;
  }

  return data || [];
};

// Update progress (admin only)
export const updateDonghuaProgress = async (
  progress: Partial<DonghuaProgress>
): Promise<DonghuaProgress> => {
  // Try to get existing record
  const { data: existingRows, error: fetchError } = await supabase
    .from("donghua_progress")
    .select("id")
    .limit(1);

  if (fetchError) {
    console.error("Error fetching existing progress:", fetchError);
    throw fetchError;
  }

  const existing = existingRows?.[0];
  const updateData = {
    ...progress,
    last_updated: new Date().toISOString(),
  };

  let result;
  if (existing?.id) {
    // Update existing record
    result = await supabase
      .from("donghua_progress")
      .update(updateData)
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    // Insert new record
    result = await supabase
      .from("donghua_progress")
      .insert(updateData)
      .select()
      .single();
  }

  if (result.error) {
    console.error("Error updating donghua progress:", result.error);
    throw result.error;
  }

  return result.data;
};

// Update arc status (admin only)
export const updateArcStatus = async (
  arcId: string,
  status: DonghuaArc["status"]
): Promise<DonghuaArc> => {
  const { data, error } = await supabase
    .from("donghua_arcs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", arcId)
    .select()
    .single();

  if (error) {
    console.error("Error updating arc status:", error);
    throw error;
  }

  return data;
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
