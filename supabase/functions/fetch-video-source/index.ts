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
  if (normalized.includes('renegade-immortal') || normalized.includes('xian-ni')) {
    return normalized.replace(/-xian-ni$/, '').replace(/^-xian-ni$/, '') || 'renegade-immortal';
  }
  return normalized;
};

const servers: ServerConfig[] = [
  {
    name: 'anime4i',
    label: 'Anime4i',
    getPageUrl: (ep, slug) => `https://anime4i.com/${getSlugWithSeriesAlias(slug)}-episode-${ep}-english-subtitles`,
    extractEmbed: (html) => {
      // Anime4i-specific extraction: look for player iframes
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+(?:player|embed)[^"']*)["'][^>]*>/i);
      if (iframeMatch) return iframeMatch[1];
      const genericMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
      return genericMatch?.[1] || null;
    },
  },
  {
    name: 'luciferdonghua',
    label: 'Lucifer Donghua',
    getPageUrl: (ep, slug) => `https://luciferdonghua.org/${getSlugWithSeriesAlias(slug)}-episode-${ep}-english-sub/`,
    extractEmbed: (html) => {
      // LuciferDonghua uses Dailymotion embeds - look for geo.dailymotion.com player URL
      const dmMatch = html.match(/src=["'](https:\/\/geo\.dailymotion\.com\/player\.html\?video=[^"']+)["']/i);
      if (dmMatch) return dmMatch[1];
      // Also check dailymotion embed format
      const dmEmbed = html.match(/dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/i);
      if (dmEmbed) return `https://geo.dailymotion.com/player.html?video=${dmEmbed[1]}`;
      // Check base64 encoded server options
      const optionMatch = html.match(/option\s+value="([A-Za-z0-9+/=]{20,})"/g);
      if (optionMatch) {
        for (const opt of optionMatch) {
          const b64 = opt.match(/value="([^"]+)"/)?.[1];
          if (b64) {
            try {
              const decoded = atob(b64);
              const iframeSrc = decoded.match(/src=["']([^"']+)["']/i);
              if (iframeSrc) return iframeSrc[1];
            } catch { /* skip invalid base64 */ }
          }
        }
      }
      // Generic iframe fallback
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+(?:player|embed|video)[^"']*)["']/i);
      if (iframeMatch) return iframeMatch[1];
      return null;
    },
  },
  {
    name: 'luciferdonghua-alt',
    label: 'Lucifer Donghua (Alt)',
    getPageUrl: (ep, slug) => `https://luciferdonghua.org/${getSlugWithSeriesAlias(slug)}-episode-${ep}-english-subtitles/`,
    extractEmbed: (html) => {
      // Same extraction as above
      const dmMatch = html.match(/src=["'](https:\/\/geo\.dailymotion\.com\/player\.html\?video=[^"']+)["']/i);
      if (dmMatch) return dmMatch[1];
      const optionMatch = html.match(/option\s+value="([A-Za-z0-9+/=]{20,})"/g);
      if (optionMatch) {
        for (const opt of optionMatch) {
          const b64 = opt.match(/value="([^"]+)"/)?.[1];
          if (b64) {
            try {
              const decoded = atob(b64);
              const iframeSrc = decoded.match(/src=["']([^"']+)["']/i);
              if (iframeSrc) return iframeSrc[1];
            } catch { /* skip */ }
          }
        }
      }
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (iframeMatch) return iframeMatch[1];
      return null;
    },
  },
  {
    name: 'donghuastream',
    label: 'DonghuaStream',
    getPageUrl: (ep, slug) => {
      const dsSlug = getSlugWithSeriesAlias(slug);
      return `https://donghuastream.org/episode/${dsSlug}-episode-${ep}/`;
    },
    extractEmbed: (html) => {
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
      return iframeMatch?.[1] || null;
    },
  },
  {
    name: 'luciferdonghua-in',
    label: 'LuciferDonghua.in',
    getPageUrl: (ep, slug) => `https://luciferdonghua.in/${getSlugWithSeriesAlias(slug)}-episode-${ep}-lucifer-donghua/`,
    extractEmbed: (html) => {
      // Similar to luciferdonghua - look for Dailymotion or iframe embeds
      const dmMatch = html.match(/src=["'](https:\/\/geo\.dailymotion\.com\/player\.html\?video=[^"']+)["']/i);
      if (dmMatch) return dmMatch[1];
      const dmEmbed = html.match(/dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/i);
      if (dmEmbed) return `https://geo.dailymotion.com/player.html?video=${dmEmbed[1]}`;
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+(?:player|embed|video)[^"']*)["']/i);
      if (iframeMatch) return iframeMatch[1];
      return null;
    },
  },
  {
    name: 'evasub',
    label: 'EvaSub',
    getPageUrl: (ep, slug) => `http://evasub.com/${getSlugWithSeriesAlias(slug)}-episode-${ep}-english-sub/`,
    extractEmbed: (html) => {
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
      return iframeMatch?.[1] || null;
    },
  },
  {
    name: 'animecube',
    label: 'Anime Cube',
    getPageUrl: (ep, slug) => {
      const cubeSlug = getSlugWithSeriesAlias(slug);
      return `https://animecube.live/anime/${cubeSlug}?season=tab-1&episode=${cubeSlug}-tab-1-ep-${ep}`;
    },
    extractEmbed: (html) => {
      const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
      return iframeMatch?.[1] || null;
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
      return iframeMatch?.[1] || null;
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
          const finalUrl = embedUrl.startsWith('//') ? `https:${embedUrl}` : embedUrl;
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
