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

export async function fetchRenegadeImmortalFeed(): Promise<SocialFeedItem[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 250));
  return [...RENEGADE_IMMORTAL_SOCIAL_FEED].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
