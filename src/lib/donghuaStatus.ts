import type { DonghuaSeries } from "@/data/donghuaData";

export function isCompletedSeries(statusTag?: string): boolean {
  if (!statusTag) return false;
  return statusTag.toLowerCase().includes("completed");
}

export function isBetweenSeasons(statusTag?: string): boolean {
  if (!statusTag) return false;
  const normalized = statusTag.toLowerCase();
  return normalized.includes("between seasons") || normalized.includes("ongoing season");
}

export function isReleaseScheduleFinished(releaseSchedule?: string): boolean {
  if (!releaseSchedule) return false;
  const normalized = releaseSchedule.toLowerCase();
  return normalized.includes("completed") || normalized.includes("ended") || normalized.includes("finished");
}

export function shouldShowReleaseCountdown(
  series: Pick<DonghuaSeries, "statusTag" | "releaseSchedule" | "releaseDay">,
  aniStatus?: string | null,
): boolean {
  if (isCompletedSeries(series.statusTag)) return false;
  if (isBetweenSeasons(series.statusTag)) return false;
  if (isReleaseScheduleFinished(series.releaseSchedule)) return false;
  if (aniStatus === "FINISHED") return false;
  if (!series.releaseDay) return false;
  return true;
}

export function getWatchPageStatusLabel(
  series: Pick<DonghuaSeries, "statusTag" | "releaseSchedule">,
): string | null {
  if (isBetweenSeasons(series.statusTag)) return "Between Seasons";
  if (isCompletedSeries(series.statusTag)) return "Completed";
  if (isReleaseScheduleFinished(series.releaseSchedule)) return "Completed";
  return null;
}

export function getSeriesReleaseDisplay(statusTag?: string, releaseSchedule?: string): string {
  if (isBetweenSeasons(statusTag)) return releaseSchedule || "Between Seasons";
  if (isCompletedSeries(statusTag)) return "Completed";
  if (isReleaseScheduleFinished(releaseSchedule)) return "Completed";
  return releaseSchedule || "Schedule pending";
}
