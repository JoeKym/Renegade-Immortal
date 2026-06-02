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

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/gi, '/')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const normalizeUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const decoded = decodeHtml(value.trim());
  if (!decoded) return null;
  if (decoded.startsWith('//')) return `https:${decoded}`;
  if (decoded.startsWith('/')) return null;
  return decoded;
};

const firstMatch = (html: string, patterns: RegExp[]): string | null => {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    const candidate = normalizeUrl(match?.[1]);
    if (candidate) return candidate;
  }
  return null;
};

const parseAnime4i = (html: string) =>
  firstMatch(html, [
    /window\.__PLAYER_URL__\s*=\s*["']([^"']+)["']/i,
    /["']embed(?:_url)?["']\s*:\s*["']([^"']+)["']/i,
    /<iframe[^>]+src=["']([^"']*anime4i[^"']*\/(?:embed|player)[^"']*)["']/i,
    /<iframe[^>]+src=["']([^"']+)["']/i,
  ]);

const parseLucifer = (html: string) =>
  firstMatch(html, [
    /https:\/\/geo\.dailymotion\.com\/player\.html\?video=([a-zA-Z0-9]+)/i,
    /dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/i,
    /["'](?:main|active)?_?player(?:Url)?["']\s*:\s*["']([^"']+)["']/i,
    /<iframe[^>]+src=["']([^"']*(?:dailymotion|embed|player)[^"']*)["']/i,
  ])?.replace(/^([a-zA-Z0-9_-]+)$/, 'https://geo.dailymotion.com/player.html?video=$1') || null;

const parseDonghuaStream = (html: string) =>
  firstMatch(html, [
    /id=["']player_iframe["'][^>]+src=["']([^"']+)["']/i,
    /["']source["']\s*:\s*["']([^"']+)["']/i,
    /<iframe[^>]+src=["']([^"']*(?:stream|embed|player)[^"']*)["']/i,
  ]);

const parseEvaSub = (html: string) =>
  firstMatch(html, [
    /["']videoUrl["']\s*:\s*["']([^"']+)["']/i,
    /<iframe[^>]+src=["']([^"']+)["']/i,
  ]);

const parseAnimeCube = (html: string) =>
  firstMatch(html, [
    /data-embed=["']([^"']+)["']/i,
    /["']iframe_url["']\s*:\s*["']([^"']+)["']/i,
    /<iframe[^>]+src=["']([^"']+)["']/i,
  ]);

const parseMyAnime = (html: string) =>
  firstMatch(html, [
    /class=["']jw-video[^>]+src=["']([^"']+)["']/i,
    /["']stream_url["']\s*:\s*["']([^"']+)["']/i,
    /<iframe[^>]+src=["']([^"']+)["']/i,
  ]);

const servers: ServerConfig[] = [
  {
    name: 'anime4i',
    label: 'Anime4i',
    getPageUrl: (ep, slug) => `https://anime4i.com/${slug}-episode-${ep}-english-subtitles`,
    extractEmbed: parseAnime4i,
  },
  {
    name: 'luciferdonghua',
    label: 'Lucifer Donghua',
    getPageUrl: (ep, slug) => `https://luciferdonghua.org/${slug}-episode-${ep}-english-sub/`,
    extractEmbed: parseLucifer,
  },
  {
    name: 'donghuastream',
    label: 'DonghuaStream',
    getPageUrl: (ep, slug) => {
      // Some series might have slightly different slug patterns on donghuastream
      const dsSlug = slug.includes('renegade-immortal') ? 'renegade-immortal' : slug;
      return `https://donghuastream.org/episode/${dsSlug}-episode-${ep}/`;
    },
    extractEmbed: parseDonghuaStream,
  },
  {
    name: 'luciferdonghua-in',
    label: 'LuciferDonghua.in',
    getPageUrl: (ep, slug) => `https://luciferdonghua.in/${slug}-episode-${ep}-lucifer-donghua/`,
    extractEmbed: parseLucifer,
  },
  {
    name: 'evasub',
    label: 'EvaSub',
    getPageUrl: (ep, slug) => `http://evasub.com/${slug}-episode-${ep}-english-sub/`,
    extractEmbed: parseEvaSub,
  },
  {
    name: 'animecube',
    label: 'Anime Cube',
    getPageUrl: (ep, slug) => {
      const cubeSlug = slug.includes('renegade-immortal') ? 'renegade-immortal' : slug;
      return `https://animecube.live/anime/${cubeSlug}?season=tab-1&episode=${cubeSlug}-tab-1-ep-${ep}`;
    },
    extractEmbed: parseAnimeCube,
  },
  {
    name: 'myanime',
    label: 'MyAnime',
    getPageUrl: (ep, slug) => {
       // MyAnime URLs often have dates, making them hard to predict. 
       // Fallback to a search-like pattern if possible, or just use the slug.
       const mySlug = slug.includes('renegade-immortal') ? 'xian-ni-renegade-immortal-2023' : slug;
       return `https://myanime.live/${mySlug}-episode-${ep}-english-sub/`;
    },
    extractEmbed: parseMyAnime,
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
        const pageUrl = srv.getPageUrl(episode, slug);
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
          await response.text(); // consume body
          console.log(`${srv.name} returned ${response.status}`);
          results.push({ server: srv.name, embedUrl: null, error: `HTTP ${response.status}` });
          continue;
        }

        const html = await response.text();
        console.log(`${srv.name} HTML length: ${html.length}`);
        
        const embedUrl = srv.extractEmbed(html);

        if (embedUrl) {
          const finalUrl = normalizeUrl(embedUrl);
          if (!finalUrl) {
            results.push({ server: srv.name, embedUrl: null, error: 'Invalid embed URL format' });
            continue;
          }
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
        } else {
          console.log(`${srv.name}: no embed found`);
          results.push({ server: srv.name, embedUrl: null, error: 'No embed URL found' });
        }
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
