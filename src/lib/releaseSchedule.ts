import type { DonghuaSeries } from "@/data/donghuaData";
import { shouldShowReleaseCountdown } from "@/lib/donghuaStatus";

export interface NextReleaseInfo {
  nextEpisodeNumber: number;
  nextAiringDate: Date;
  nextAiringFormattedCST: string; // e.g. "Sat, Aug 15 at 12:00 PM (EAT / GMT+3)"
  timeUntilFormatted: string;     // e.g. "3d 14h 6s"
  fullCountdownString: string;    // e.g. "Next: Ep 261 in 3d 14h 6s (12:00 PM EAT)"
  chinaTimeDisplay: string;       // e.g. "12:00 PM EAT (GMT+3)"
  showCountdown: boolean;
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

const TIMEZONE_MINUTES: Record<string, number> = {
  EAT: 180,
  "GMT+3": 180,
  "UTC+3": 180,
  CST: 480,
  "GMT+8": 480,
  "UTC+8": 480,
};

function parseReleaseDayCandidates(series: DonghuaSeries): number[] {
  if (series.releaseDay === "Multiple") {
    const scheduleText = `${series.releaseSchedule ?? ""} ${series.releaseTime ?? ""}`.toLowerCase();
    const candidateDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      .filter((day) => scheduleText.includes(day));

    if (candidateDays.length > 0) {
      return candidateDays.map((day) => DAY_MAP[day.charAt(0).toUpperCase() + day.slice(1)]);
    }

    return [2, 6];
  }

  if (series.releaseDay && DAY_MAP[series.releaseDay] !== undefined) {
    return [DAY_MAP[series.releaseDay]];
  }

  return [6];
}

function getReleaseHour(series: DonghuaSeries): number {
  const sourceText = `${series.releaseTime ?? ""} ${series.releaseSchedule ?? ""}`;
  const match = sourceText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 15;

  let hour = parseInt(match[1], 10);
  const isPM = match[3].toUpperCase() === "PM";
  if (isPM && hour < 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return hour;
}

function getReleaseTimezoneMinutes(series: DonghuaSeries): number {
  const sourceText = `${series.releaseTime ?? ""} ${series.releaseSchedule ?? ""}`;
  const match = sourceText.match(/(EAT|CST|GMT[+-]\d{1,2}|UTC[+-]\d{1,2})/i);
  if (!match) return TIMEZONE_MINUTES.EAT;

  const token = match[1].toUpperCase();
  if (TIMEZONE_MINUTES[token]) return TIMEZONE_MINUTES[token];

  const offsetMatch = token.match(/(?:GMT|UTC)([+-])(\d{1,2})/i);
  if (offsetMatch) {
    const sign = offsetMatch[1] === "+" ? 1 : -1;
    return sign * parseInt(offsetMatch[2], 10) * 60;
  }

  return TIMEZONE_MINUTES.EAT;
}

/**
 * Calculates the next release date and live countdown using the schedule's declared timezone.
 * Most of the series in this project are scheduled in EAT (UTC+3), not China Standard Time.
 */
export function getNextReleaseInfo(series: DonghuaSeries, now: Date = new Date()): NextReleaseInfo {
  if (!shouldShowReleaseCountdown(series)) {
    return {
      nextEpisodeNumber: series.knownTotalEpisodes || 0,
      nextAiringDate: new Date(0),
      nextAiringFormattedCST: "Completed",
      timeUntilFormatted: "Completed",
      fullCountdownString: "Completed",
      chinaTimeDisplay: "Completed",
      showCountdown: false,
    };
  }

  const currentEpisodes = series.knownTotalEpisodes || 0;
  const nextEpisodeNumber = currentEpisodes + 1;

  const targetHour = getReleaseHour(series);
  const targetTimezoneMinutes = getReleaseTimezoneMinutes(series);
  const targetOffsetMs = targetTimezoneMinutes * 60 * 1000;
  const localOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  const targetNow = new Date(now.getTime() + (targetOffsetMs - localOffsetMs));

  const daysCandidates = parseReleaseDayCandidates(series);

  let selectedDay = daysCandidates[0];
  let minDaysUntil = 8;

  for (const candidateDay of daysCandidates) {
    let daysUntil = (candidateDay - targetNow.getUTCDay() + 7) % 7;
    if (daysUntil === 0 && targetNow.getUTCHours() >= targetHour) {
      daysUntil = 7;
    }
    if (daysUntil < minDaysUntil) {
      minDaysUntil = daysUntil;
      selectedDay = candidateDay;
    }
  }

  const targetDateUtc = Date.UTC(
    targetNow.getUTCFullYear(),
    targetNow.getUTCMonth(),
    targetNow.getUTCDate() + minDaysUntil,
    targetHour,
    0,
    0,
    0,
  );

  const nextAiringDate = new Date(targetDateUtc - targetOffsetMs);
  const diffMs = Math.max(0, nextAiringDate.getTime() - now.getTime());

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

  const targetDateInZone = new Date(targetDateUtc - targetOffsetMs + targetOffsetMs);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const displayDate = new Date(targetDateUtc - targetOffsetMs + targetOffsetMs);
  const dayName = dayNames[displayDate.getUTCDay()];
  const monthName = monthNames[displayDate.getUTCMonth()];
  const dayNum = displayDate.getUTCDate();

  const formattedHour = targetHour % 12 === 0 ? 12 : targetHour % 12;
  const ampm = targetHour >= 12 ? "PM" : "AM";
  const timeStr = `${formattedHour}:00 ${ampm}`;
  const timezoneLabel = targetTimezoneMinutes === 180 ? "EAT" : "CST";
  const timezoneOffsetLabel = targetTimezoneMinutes === 180 ? "GMT+3" : "GMT+8";

  const nextAiringFormattedCST = `${dayName}, ${monthName} ${dayNum} at ${timeStr} (${timezoneLabel} / ${timezoneOffsetLabel})`;
  const chinaTimeDisplay = `${timeStr} ${timezoneLabel} (${timezoneOffsetLabel})`;
  const fullCountdownString = `Next Ep ${nextEpisodeNumber}: ${timeUntilFormatted} (${timeStr} ${timezoneLabel})`;

  return {
    nextEpisodeNumber,
    nextAiringDate,
    nextAiringFormattedCST,
    timeUntilFormatted,
    fullCountdownString,
    chinaTimeDisplay,
    showCountdown: true,
  };
}
