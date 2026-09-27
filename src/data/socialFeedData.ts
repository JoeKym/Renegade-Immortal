import { supabase } from "@/integrations/supabase/client";

export type SocialFeedType = "post" | "video" | "photo" | "news";

export interface SocialFeedItem {
  id: string;
  platform: string;
  type: SocialFeedType;
  title: string;
  summary: string;
  url: string;
  image: string;
  publishedAt: string;
  tags: string[];
}

const FALLBACK_IMAGES: Record<string, string> = {
  YouTube: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx137653-1wHbCVvABGOr.png",
  TikTok: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx196613-20kz65bVsHl7.jpg",
  Instagram: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170724-42bSm066wF6q.png",
  Facebook: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx213356-nYFTX2yeMBd5.jpg",
  Telegram: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx211181-93dehu3v5xHE.png",
  "Google News": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166219-tREIb5l5huVe.png",
  "X / Twitter": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198697-UHaozIRuLiEA.png",
  Web: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx137653-1wHbCVvABGOr.png",
};

export const RENEGADE_IMMORTAL_SOCIAL_FEED: SocialFeedItem[] = [
  {
    id: "yt-rt-renegade-immortal",
    platform: "YouTube",
    type: "video",
    title: "Renegade Immortal episode release recap",
    summary: "Latest fan recap and episode roundup covering the newest Renegade Immortal release cycle and key story beats.",
    url: "https://www.youtube.com/results?search_query=Renegade+Immortal+episode+release",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx137653-1wHbCVvABGOr.png",
    publishedAt: "2026-08-13T15:00:00Z",
    tags: ["episode", "youtube", "recap"],
  },
  {
    id: "tik-tok-renegade-immortal",
    platform: "TikTok",
    type: "video",
    title: "TikTok clip: cultivation battle highlights",
    summary: "Short-form clips highlighting notable battles, intense transformations, and fan reactions from the latest episode drop.",
    url: "https://www.tiktok.com/search?q=Renegade%20Immortal",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx196613-20kz65bVsHl7.jpg",
    publishedAt: "2026-08-11T10:30:00Z",
    tags: ["tiktok", "fight", "highlights"],
  },
  {
    id: "ig-renegade-immortal",
    platform: "Instagram",
    type: "photo",
    title: "Fan poster drop: Renegade Immortal",
    summary: "Character art, poster edits, and theme-inspired content from the Renegade Immortal fan community.",
    url: "https://www.instagram.com/explore/tags/renegadeimmortal/",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170724-42bSm066wF6q.png",
    publishedAt: "2026-08-09T18:20:00Z",
    tags: ["fanart", "instagram", "poster"],
  },
  {
    id: "facebook-community-update",
    platform: "Facebook",
    type: "post",
    title: "Fans discussing the latest episode breakdown",
    summary: "A community thread covering chapter-to-episode comparisons, theories, and the next release expectations.",
    url: "https://www.facebook.com/search/top?q=Renegade%20Immortal",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx213356-nYFTX2yeMBd5.jpg",
    publishedAt: "2026-08-08T12:15:00Z",
    tags: ["discussion", "facebook", "theory"],
  },
  {
    id: "telegram-episode-alert",
    platform: "Telegram",
    type: "post",
    title: "Telegram release alert and discussion thread",
    summary: "Broadcast channel updates for the newest episode, release notes, and global watch reminders.",
    url: "https://t.me/s/renegadeimmortalupdates",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx211181-93dehu3v5xHE.png",
    publishedAt: "2026-08-06T09:45:00Z",
    tags: ["telegram", "release", "watch"],
  },
  {
    id: "google-news-renegade-immortal",
    platform: "Google News",
    type: "news",
    title: "Renegade Immortal news roundup",
    summary: "A consolidated Google News view for the latest media coverage, fan updates, and release chatter around the series.",
    url: "https://news.google.com/search?q=Renegade%20Immortal",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166219-tREIb5l5huVe.png",
    publishedAt: "2026-08-05T07:10:00Z",
    tags: ["news", "google", "coverage"],
  },
  {
    id: "x-renegade-immortal",
    platform: "X / Twitter",
    type: "post",
    title: "Cultivation realm reaction thread",
    summary: "Fan reactions and commentary about the latest episode, cliffhangers, and expected story direction.",
    url: "https://x.com/search?q=Renegade%20Immortal",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198697-UHaozIRuLiEA.png",
    publishedAt: "2026-08-03T16:00:00Z",
    tags: ["x", "reaction", "community"],
  },
];

const extractYouTubeThumbnail = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

const inferPlatform = (url: string, source?: string): string => {
  const text = `${source ?? ""} ${url ?? ""}`.toLowerCase();

  if (text.includes("youtube")) return "YouTube";
  if (text.includes("tiktok")) return "TikTok";
  if (text.includes("instagram")) return "Instagram";
  if (text.includes("facebook")) return "Facebook";
  if (text.includes("telegram") || text.includes("t.me")) return "Telegram";
  if (text.includes("google")) return "Google News";
  if (text.includes("x.com") || text.includes("twitter")) return "X / Twitter";
  if (text.includes("bilibili")) return "Bilibili";
  if (text.includes("myanimelist") || text.includes("anilist") || text.includes("novelupdates")) return "News";

  return source || "Web";
};

const inferType = (platform: string): SocialFeedType => {
  const normalized = platform.toLowerCase();

  if (normalized.includes("youtube") || normalized.includes("tiktok")) return "video";
  if (normalized.includes("instagram")) return "photo";
  if (normalized.includes("google") || normalized.includes("news") || normalized.includes("bilibili")) return "news";

  return "post";
};

const normalizeFirecrawlItem = (item: any, index: number): SocialFeedItem | null => {
  const url = item?.url || item?.link;
  if (!url) return null;

  const platform = inferPlatform(url, item?.source);
  const title = item?.title || `Renegade Immortal update ${index + 1}`;
  const summary = item?.snippet || item?.description || item?.markdown?.replace(/\s+/g, " ").slice(0, 180) || "Latest Renegade Immortal update from the web.";
  const publishedAt = item?.date ? new Date(item.date).toISOString() : new Date().toISOString();

  const extractedThumbnail = 
    item?.thumbnail ||
    item?.image ||
    item?.ogImage ||
    item?.preview ||
    item?.cover ||
    item?.pagemap?.cse_image?.[0]?.src ||
    item?.pagemap?.cse_thumbnail?.[0]?.src ||
    extractYouTubeThumbnail(url);

  return {
    id: `${platform}-${url}`,
    platform,
    type: inferType(platform),
    title,
    summary,
    url,
    image: extractedThumbnail || FALLBACK_IMAGES[platform] || FALLBACK_IMAGES.Web,
    publishedAt,
    tags: [platform.toLowerCase(), "renegade-immortal"],
  };
};

export async function fetchRenegadeImmortalFeed(): Promise<SocialFeedItem[]> {
  try {
    const { data, error } = await supabase.functions.invoke("fetch-news");

    if (!error && data?.success && Array.isArray(data.data) && data.data.length > 0) {
      const normalized = data.data
        .map((item: any, index: number) => normalizeFirecrawlItem(item, index))
        .filter((item): item is SocialFeedItem => Boolean(item));

      if (normalized.length > 0) {
        return [...normalized].sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }
    }
  } catch (error) {
    console.warn("Firecrawl feed unavailable, using fallback social feed.", error);
  }

  return [...RENEGADE_IMMORTAL_SOCIAL_FEED].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
