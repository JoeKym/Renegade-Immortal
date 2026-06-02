const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ANILIST_QUERY = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      episodes
      nextAiringEpisode { airingAt episode }
    }
  }
`;

const extractNumber = (text: string, label: string): number | null => {
  const regex = new RegExp(`${label}\\s*:?\\s*(\\d+)`, "i");
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
};

const extractDateLine = (text: string, label: string): string | null => {
  const regex = new RegExp(`${label}\\s*:?\\s*([^\\n]+)`, "i");
  const match = text.match(regex);
  return match?.[1]?.trim() || null;
};

async function fetchFromNextEpisode(slug: string) {
  const page = await fetch(`https://next-episode.net/${slug}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  });

  if (!page.ok) {
    throw new Error(`next-episode HTTP ${page.status}`);
  }

  const html = await page.text();
  const normalized = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{2,}/g, "\n");

  const totalEpisodes = extractNumber(normalized, "Episodes");
  const nextEpisode = extractNumber(normalized, "Episode");
  const dateLine = extractDateLine(normalized, "Date");
  const parsedDate = dateLine ? new Date(dateLine).getTime() : NaN;
  const airedAt = Number.isFinite(parsedDate) ? Math.floor(parsedDate / 1000) : null;
  const premiered = extractDateLine(normalized, "Premiered");

  if (!totalEpisodes || totalEpisodes <= 0) {
    throw new Error("Could not parse episode totals from next-episode");
  }

  return {
    totalEpisodes,
    premiered,
    nextEpisode,
    nextAiringAt: airedAt,
  };
}

async function fetchAniListFallback(query: string) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: { search: query },
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const media = json?.data?.Media;
  if (!media) return null;
  return {
    totalEpisodes: media.episodes || (media.nextAiringEpisode?.episode ? media.nextAiringEpisode.episode - 1 : 0),
    nextEpisode: media.nextAiringEpisode?.episode || null,
    nextAiringAt: media.nextAiringEpisode?.airingAt || null,
  };
}

async function fetchJikanFallback(query: string) {
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
  if (!response.ok) return null;
  const json = await response.json();
  const first = json?.data?.[0];
  if (!first) return null;
  return {
    totalEpisodes: first.episodes || 0,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, query } = await req.json();
    if (!slug || typeof slug !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "slug is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const nextEpisodeData = await fetchFromNextEpisode(slug);
      return new Response(
        JSON.stringify({
          success: true,
          source: "next-episode",
          data: nextEpisodeData,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (nextError) {
      console.error("Next-Episode source failed:", nextError);
    }

    const fallbackQuery = typeof query === "string" && query.trim() ? query.trim() : slug.replace(/-/g, " ");
    const ani = await fetchAniListFallback(fallbackQuery);
    const jikan = await fetchJikanFallback(fallbackQuery);

    const totalEpisodes = Math.max(ani?.totalEpisodes || 0, jikan?.totalEpisodes || 0);
    if (!totalEpisodes) {
      return new Response(
        JSON.stringify({ success: false, error: "No episode data found from any source" }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        source: (jikan?.totalEpisodes || 0) > (ani?.totalEpisodes || 0) ? "jikan" : "anilist",
        data: {
          totalEpisodes,
          premiered: null,
          nextEpisode: ani?.nextEpisode || null,
          nextAiringAt: ani?.nextAiringAt || null,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching episodes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
