export function isCompletedSeries(statusTag?: string): boolean {
  if (!statusTag) return false;
  return statusTag.toLowerCase().includes("completed");
}

export function getSeriesReleaseDisplay(statusTag?: string, releaseSchedule?: string): string {
  if (isCompletedSeries(statusTag)) return "Completed";
  return releaseSchedule || "Schedule pending";
}
