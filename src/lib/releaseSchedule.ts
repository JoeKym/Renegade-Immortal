import type { DonghuaSeries } from "@/data/donghuaData";

export interface NextReleaseInfo {
  nextEpisodeNumber: number;
  nextAiringDate: Date;
  nextAiringFormattedCST: string; // e.g. "Sat, Aug 15 at 10:00 AM (CST / GMT+8)"
  timeUntilFormatted: string;     // e.g. "3d 14h 6s"
  fullCountdownString: string;    // e.g. "Next: Ep 261 in 3d 14h 6s (10:00 AM CST)"
  chinaTimeDisplay: string;       // e.g. "10:00 AM CST (GMT+8)"
}

const DAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/**
 * Calculates the next release date and live countdown in China Standard Time (CST / GMT+8)
 */
export function getNextReleaseInfo(series: DonghuaSeries, now: Date = new Date()): NextReleaseInfo {
  const currentEpisodes = series.knownTotalEpisodes || 0;
  const nextEpisodeNumber = currentEpisodes + 1;

  // Convert current time to China Time (UTC+8)
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const chinaOffsetMs = 8 * 60 * 60 * 1000;
  const chinaNowMs = utcMs + chinaOffsetMs;
  const chinaNow = new Date(chinaNowMs);

  const currentChinaDay = chinaNow.getUTCDay();
  const currentChinaHour = chinaNow.getUTCHours();

  let targetDay = 6; // Default Saturday
  let targetHour = 10; // Default 10:00 AM CST

  if (series.releaseDay === "Multiple") {
    // For series airing multiple days a week (e.g. Qi Refining: Tuesday & Saturday at 10:00 AM)
    // Find the next upcoming day between Tuesday (2) and Saturday (6)
    const candidates = [2, 6];
    let minDays = 8;
    for (const day of candidates) {
      let days = (day - currentChinaDay + 7) % 7;
      if (days === 0 && currentChinaHour >= targetHour) {
        days = 7;
      }
      if (days < minDays) {
        minDays = days;
        targetDay = day;
      }
    }
  } else if (series.releaseDay && DAY_MAP[series.releaseDay] !== undefined) {
    targetDay = DAY_MAP[series.releaseDay];
  }

  // Parse release hour if specified (e.g. "10:00 AM (GMT+8)")
  if (series.releaseTime) {
    const match = series.releaseTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const isPM = match[3].toUpperCase() === "PM";
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      targetHour = h;
    }
  }

  // Calculate days until next release
  let daysUntil = (targetDay - currentChinaDay + 7) % 7;
  if (daysUntil === 0 && currentChinaHour >= targetHour) {
    daysUntil = 7;
  }

  // Create target date in China Time (UTC+8)
  const chinaNextYear = chinaNow.getUTCFullYear();
  const chinaNextMonth = chinaNow.getUTCMonth();
  const chinaNextDate = chinaNow.getUTCDate() + daysUntil;

  const chinaTargetMs = Date.UTC(chinaNextYear, chinaNextMonth, chinaNextDate, targetHour, 0, 0);

  // Convert back to absolute epoch timestamp
  const targetEpochMs = chinaTargetMs - chinaOffsetMs;
  const nextAiringDate = new Date(targetEpochMs);

  // Calculate countdown
  const diffMs = Math.max(0, targetEpochMs - now.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  let timeUntilFormatted = "";
  if (days > 0) {
    timeUntilFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    timeUntilFormatted = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    timeUntilFormatted = `${minutes}m ${seconds}s`;
  } else {
    timeUntilFormatted = `${seconds}s`;
  }

  // Formatted date string in CST
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const targetChinaDateObj = new Date(chinaTargetMs);
  const dayName = dayNames[targetChinaDateObj.getUTCDay()];
  const monthName = monthNames[targetChinaDateObj.getUTCMonth()];
  const dayNum = targetChinaDateObj.getUTCDate();
  const formattedHour = targetHour % 12 === 0 ? 12 : targetHour % 12;
  const ampm = targetHour >= 12 ? "PM" : "AM";
  const timeStr = `${formattedHour}:00 ${ampm}`;

  const nextAiringFormattedCST = `${dayName}, ${monthName} ${dayNum} at ${timeStr} (CST / GMT+8)`;
  const chinaTimeDisplay = `${timeStr} CST (GMT+8)`;
  const fullCountdownString = `Next Ep ${nextEpisodeNumber}: ${timeUntilFormatted} (${timeStr} CST)`;

  return {
    nextEpisodeNumber,
    nextAiringDate,
    nextAiringFormattedCST,
    timeUntilFormatted,
    fullCountdownString,
    chinaTimeDisplay,
  };
}
