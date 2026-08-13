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
  YouTube: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  TikTok: "https://images.unsplash.com/photo-1531746790731-6c087fecd65d?auto=format&fit=crop&w=1200&q=80",
  Instagram: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
  Facebook: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  Telegram: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
  "Google News": "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  "X / Twitter": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  Web: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
};

export const RENEGADE_IMMORTAL_SOCIAL_FEED: SocialFeedItem[] = [
  {
    id: "yt-rt-renegade-immortal",
    platform: "YouTube",
    type: "video",
    title: "Renegade Immortal episode release recap",
    summary: "Latest fan recap and episode roundup covering the newest Renegade Immortal release cycle and key story beats.",
    url: "https://www.youtube.com/results?search_query=Renegade+Immortal+episode+release",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65d?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-08-03T16:00:00Z",
    tags: ["x", "reaction", "community"],
  },
];

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

  return {
    id: `${platform}-${url}`,
    platform,
    type: inferType(platform),
    title,
    summary,
    url,
    image: item?.image || FALLBACK_IMAGES[platform] || FALLBACK_IMAGES.Web,
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
