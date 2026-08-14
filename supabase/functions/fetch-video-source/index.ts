declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ServerConfig {
  name: string;
  label: string;
  getPageUrl: (episode: number, slug: string) => string;
  extractEmbed: (html: string) => string | null;
}

const normalizeServerSlug = (slug: string): string => {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'renegade-immortal';
};

const getSlugWithSeriesAlias = (slug: string): string => {
  const normalized = normalizeServerSlug(slug);
  if (normalized.includes('renegade-immortal')) {
    return normalized.includes('xian-ni') ? normalized : `${normalized}-xian-ni`;
  }
  if (normalized.includes('xian-ni')) {
    return normalized.replace(/-xian-ni$/, '') || 'renegade-immortal';
  }
  return normalized;
};

const buildAnime4iCandidates = (episode: number, slug: string): string[] => {
  const normalizedSlug = normalizeServerSlug(slug);
  const baseCandidates = [
    normalizedSlug,
    `${normalizedSlug}-xian-ni`,
    'renegade-immortal',
    'renegade-immortal-xian-ni',
  ].filter(Boolean);

  const urls = new Set<string>();
  for (const base of baseCandidates) {
    urls.add(`https://anime4i.com/${base}-episode-${episode}-english-subtitles`);
    urls.add(`https://anime4i.com/${base}-episode-${episode}`);
    urls.add(`https://anime4i.com/${base}-episode-${episode}-english-sub/`);
    urls.add(`https://anime4i.com/${base}-xian-ni-episode-${episode}-english-subtitles`);
  }

  return [...urls];
};

const normalizeMediaUrl = (value: string): string | null => {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed || trimmed.startsWith('data:')) return null;

  const protocolRelative = trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;

  try {
    return new URL(protocolRelative).toString();
  } catch {
    return protocolRelative.startsWith('http') ? protocolRelative : null;
  }
};

const isAllowedEmbedUrl = (value: string): boolean => {
  const normalized = value.toLowerCase();

  if (
    normalized.includes('dm-event.net') ||
    normalized.includes('doubleclick.net') ||
    normalized.includes('googlesyndication.com')
  ) {
    return false;
  }

  const allowedHosts = [
    'dailymotion.com',
    'ok.ru',
    'vk.com',
    'youtube.com',
    'youtu.be',
    'streamtape.com',
    'mp4',
    'm3u8',
    'embed',
    'video',
    'player',
  ];

  return allowedHosts.some((host) => normalized.includes(host));
};

const extractAnyMediaUrl = (html: string): string | null => {
  const patternCandidates = [
    /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi,
    /<iframe[^>]+data-src=["']([^"']+)["'][^>]*>/gi,
    /<source[^>]+src=["']([^"']+)["'][^>]*>/gi,
    /file\s*:\s*["']([^"']+)["']/gi,
    /src\s*:\s*["']([^"']+)["']/gi,
    /https?:\/\/[^\s"'<>]+(?:m3u8|mp4|mkv|webm|mpd|embed|player|stream|video)[^\s"'<>]*/gi,
  ];

  const candidates = new Set<string>();

  for (const pattern of patternCandidates) {
    for (const match of html.matchAll(pattern)) {
      const value = normalizeMediaUrl(match[1] ?? match[0]);
      if (value && isAllowedEmbedUrl(value)) {
        candidates.add(value);
      }
    }
  }

  return [...candidates][0] || null;
};

const buildLuciferDonghuaCandidates = (episode: number, slug: string): string[] => {
  const base = getSlugWithSeriesAlias(slug);
  const patterns = [
    `${base}-episode-${episode}-english-sub`,
    `${base}-episode-${episode}-english-subtitles`,
    `${base}-episode-${episode}-english-subtitle`,
    `${base}-episode-${episode}`,
  ];

  return [...new Set(patterns.map((path) => `https://luciferdonghua.org/${path}/`))];
};

const servers: ServerConfig[] = [
  {
    name: 'anime4i',
    label: 'Anime4i',
    getPageUrl: (ep, slug) => `https://anime4i.com/${getSlugWithSeriesAlias(slug)}-episode-${ep}-english-subtitles`,
    extractEmbed: (html) => {
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+(?:player|embed)[^"']*)["'][^>]*>/i);
      if (iframeMatch) return normalizeMediaUrl(iframeMatch[1]) || null;
      return extractAnyMediaUrl(html);
    },
  },
  {
    name: 'luciferdonghua',
    label: 'LuciferDonghua',
    getPageUrl: (ep, slug) => buildLuciferDonghuaCandidates(ep, slug)[0],
    extractEmbed: (html) => {
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (iframeMatch) {
        const normalized = normalizeMediaUrl(iframeMatch[1]);
        if (normalized && isAllowedEmbedUrl(normalized)) return normalized;
      }
      return extractAnyMediaUrl(html);
    },
  },
  {
    name: 'myanime',
    label: 'MyAnime',
    getPageUrl: (ep, slug) => {
      const mySlug = getSlugWithSeriesAlias(slug).includes('renegade-immortal')
        ? 'xian-ni-renegade-immortal-2023'
        : getSlugWithSeriesAlias(slug);
      return `https://myanime.live/${mySlug}-episode-${ep}-english-sub/`;
    },
    extractEmbed: (html) => {
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
      return iframeMatch ? normalizeMediaUrl(iframeMatch[1]) || null : null;
    },
  },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { episode, server, donghuaSlug } = await req.json();
    const slug = donghuaSlug || 'renegade-immortal-xian-ni';

    if (!episode || typeof episode !== 'number') {
      return new Response(
        JSON.stringify({ success: false, error: 'Episode number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serversToTry = server
      ? servers.filter(s => s.name === server)
      : servers;

    if (serversToTry.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Unknown server: ${server}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: { server: string; embedUrl: string | null; error?: string }[] = [];

    for (const srv of serversToTry) {
      try {
        const candidateUrls = srv.name === 'anime4i'
          ? buildAnime4iCandidates(episode, slug)
          : [srv.getPageUrl(episode, slug)];

        let foundEmbed: string | null = null;

        for (const pageUrl of candidateUrls) {
          console.log(`Fetching ${srv.name}: ${pageUrl}`);

          const response = await fetch(pageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            redirect: 'follow',
          });

          if (!response.ok) {
            console.log(`${srv.name} returned ${response.status} for ${pageUrl}`);
            continue;
          }

          const html = await response.text();
          console.log(`${srv.name} HTML length for ${pageUrl}: ${html.length}`);

          const embedUrl = srv.extractEmbed(html);
          if (embedUrl) {
            foundEmbed = embedUrl;
            break;
          }
        }

        if (foundEmbed) {
          const finalUrl = foundEmbed.startsWith('//') ? `https:${foundEmbed}` : foundEmbed;
          console.log(`${srv.name} embed found: ${finalUrl}`);
          return new Response(
            JSON.stringify({
              success: true,
              server: srv.name,
              label: srv.label,
              embedUrl: finalUrl,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        results.push({ server: srv.name, embedUrl: null, error: 'No embed URL found' });
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : 'Unknown error';
        console.error(`${srv.name} error:`, errMsg);
        results.push({ server: srv.name, embedUrl: null, error: errMsg });
      }
    }

    // Return fallback URLs for direct access
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Could not extract embed from any server',
        results,
        fallbackUrls: servers.map(s => ({ name: s.name, label: s.label, url: s.getPageUrl(episode, slug) })),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
