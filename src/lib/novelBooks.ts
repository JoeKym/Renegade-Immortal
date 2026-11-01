export const NOVEL_BOOK_OPTIONS = [
  { number: 1, label: "Volume 1", title: "The Mediocre Youth", startChapter: 1, endChapter: 64 },
  { number: 2, label: "Volume 2", title: "The Bloody Image of Cultivation", startChapter: 65, endChapter: 140 },
  { number: 3, label: "Volume 3", title: "Famous in the Sea of Devils", startChapter: 141, endChapter: 200 },
  { number: 4, label: "Volume 4", title: "Clean Sweep", startChapter: 201, endChapter: 405 },
  { number: 5, label: "Volume 5", title: "Cultivation Planet Crystal", startChapter: 406, endChapter: 471 },
  { number: 6, label: "Volume 6", title: "Arriving on Tian Yun", startChapter: 472, endChapter: 658 },
  { number: 7, label: "Volume 7", title: "Fame Shakes Allheaven Star System", startChapter: 659, endChapter: 920 },
  { number: 8, label: "Volume 8", title: "Alliance's Secret", startChapter: 921, endChapter: 1140 },
  { number: 9, label: "Volume 9", title: "Peak of the Cloud Sea", startChapter: 1141, endChapter: 1478 },
  { number: 10, label: "Volume 10", title: "Rampage Through the Inner Realm", startChapter: 1479, endChapter: 1613 },
  { number: 11, label: "Volume 11", title: "Mysteries of the Ancient Era", startChapter: 1614, endChapter: 1793 },
  { number: 12, label: "Volume 12", title: "Tenth Sun of the Immortal Astral Continent", startChapter: 1794, endChapter: 2002 },
  { number: 13, label: "Volume 13", title: "Light of the coming end", startChapter: 2003, endChapter: 2088 },
] as const;

export const NOVEL_BOOK_NUMBERS = NOVEL_BOOK_OPTIONS.map(({ number }) => number);

export type NovelBookNumber = (typeof NOVEL_BOOK_OPTIONS)[number]["number"];

export function isNovelBookNumber(value: unknown): value is NovelBookNumber {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    NOVEL_BOOK_OPTIONS.some((book) => book.number === value);
}

export function getNovelBookOption(value: number) {
  return NOVEL_BOOK_OPTIONS.find((book) => book.number === value);
}

export function getNovelBookForChapter(chapter: number): NovelBookNumber | undefined {
  return NOVEL_BOOK_OPTIONS.find(
    (book) => chapter >= book.startChapter && chapter <= book.endChapter,
  )?.number;
}

export function getNovelBookLabel(value: number): string | undefined {
  return getNovelBookOption(value)?.label;
}

export function parseNovelBookNumber(value: unknown): NovelBookNumber | undefined {
  if (isNovelBookNumber(value)) return value;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  const match = normalized.match(/^(?:web\s*)?volume\s*(1[0-3]|[1-9])$/i)
    ?? normalized.match(/^(1[0-3]|[1-9])$/);
  return match ? Number(match[1]) as NovelBookNumber : undefined;
}
