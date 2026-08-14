export function normalizeEmbedUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim().replace(/^['"]|['"]$/g, "");
  if (!trimmed) return null;

  const withProtocol = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;

  try {
    const url = new URL(withProtocol);
    return url.toString();
  } catch {
    if (/^https?:\/\//i.test(withProtocol)) {
      return withProtocol;
    }
    return null;
  }
}

function isSupportedVideoHost(url: string): boolean {
  const supportedDomains = [
    "dailymotion.com",
    "ok.ru",
    "vk.com",
    "youtube.com",
    "youtu.be",
    "streamtape.com",
    "mp4",
    "m3u8",
    "jwplayer",
    "embed",
    "video",
    "player",
  ];

  const lowered = url.toLowerCase();
  return supportedDomains.some((domain) => lowered.includes(domain));
}

export function extractVideoEmbedFromHtml(html: string, source?: string): string | null {
  if (!html) return null;

  const candidateUrls = new Set<string>();

  const patterns = [
    /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi,
    /<iframe[^>]+data-src=["']([^"']+)["'][^>]*>/gi,
    /<video[^>]+src=["']([^"']+)["'][^>]*>/gi,
    /<source[^>]+src=["']([^"']+)["'][^>]*>/gi,
    /(?:file|src)\s*:\s*["']([^"']+)["']/gi,
    /https?:\/\/[^\s"'<>]+(?:embed|video|player|stream|mp4|m3u8)[^\s"'<>]*/gi,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const candidate = normalizeEmbedUrl(match[1] ?? match[0]);
      if (candidate) candidateUrls.add(candidate);
    }
  }

  const ordered = [...candidateUrls].filter((url) => {
    if (source && url.includes(source.toLowerCase())) return true;
    return isSupportedVideoHost(url);
  });

  return ordered[0] ?? null;
}
