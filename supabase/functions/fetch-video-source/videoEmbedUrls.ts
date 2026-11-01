const blockedPageHosts = [
  "luciferdonghua.in",
  "luciferdonghua.org",
  "anime4i.com",
];

const allowedEmbedHosts = [
  "dailymotion.com",
  "dailymotion.net",
  "ok.ru",
  "vk.com",
  "youtube.com",
  "youtu.be",
  "streamtape.com",
];

const allowedEmbedHostLabels = [
  "dood",
  "filelions",
  "streamwish",
  "mixdrop",
  "hxfile",
  "vidmoly",
];

export function isAllowedEmbedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    if (url.username || url.password) return false;

    const host = url.hostname.toLowerCase();
    if (blockedPageHosts.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
      return false;
    }

    if (allowedEmbedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) {
      return true;
    }

    if (allowedEmbedHostLabels.some((fragment) =>
      host.split(".").some((label) => label.startsWith(fragment)))) {
      return true;
    }

    return /\.(?:m3u8|mp4|mkv|webm|mpd)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function findAllowedIframeUrl(html: string): string | null {
  const iframePattern = /<iframe\b[^>]*(?:src|data-src)=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(iframePattern)) {
    const rawUrl = match[1].replace(/&amp;/g, "&").trim();
    const url = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;
    if (isAllowedEmbedUrl(url)) return url;
  }
  return null;
}
