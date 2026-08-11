import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function proxyImageUrl(url: string | undefined | null): string {
  if (!url) return "/placeholder.svg";
  if (!/^https?:\/\//i.test(url)) return url;
  if (/^https:\/\/(?:wsrv\.nl|images\.weserv\.nl)\//i.test(url)) return url;
  if (/^https:\/\/s4\.anilist\.co\//i.test(url)) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
}
