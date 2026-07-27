import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function proxyImageUrl(url: string | undefined | null): string {
  if (!url) return "/placeholder.svg";
  if (!/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("https://wsrv.nl/")) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
}
