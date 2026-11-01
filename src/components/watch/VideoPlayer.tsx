import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, MonitorPlay, RefreshCw,
  Maximize2, ExternalLink, ChevronDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { VideoServerName } from "@/lib/videoSourceSlugs";

interface Server {
  name: VideoServerName;
  providerLabel: string;
  displayName: string;
  description: string;
  directUrl: (ep: number, slug: string) => string;
}

function normalizeSlug(slug: string): string {
  if (slug === "renegade-immortal-xian-ni") return "renegade-immortal";
  if (slug === "eclipse-of-illusion") return "eclipse-of-illusion-s1";
  return slug.replace(/-s\d+$/i, "");
}

function resolveServerSlug(serverName: VideoServerName, donghuaSlug: string, serverSlugs?: Partial<Record<VideoServerName, string>>) {
  if (serverSlugs?.[serverName]) return serverSlugs[serverName]!;
  return normalizeSlug(donghuaSlug);
}

function getFunctionFallbackUrl(data: unknown, serverName: VideoServerName): string | null {
  if (!data || typeof data !== "object" || !("fallbackUrls" in data)) return null;
  const fallbacks = data.fallbackUrls;
  if (!Array.isArray(fallbacks)) return null;
  const match = fallbacks.find(
    (item): item is { name: string; url: string } =>
      Boolean(item && typeof item === "object" &&
        "name" in item && item.name === serverName &&
        "url" in item && typeof item.url === "string"),
  );
  return match?.url ?? null;
}

const SERVERS: Server[] = [
  {
    name: "anime4i",
    providerLabel: "Anime4i",
    displayName: "Wide Library",
    description: "Large episode library; subtitle quality can vary.",
    directUrl: (ep, slug) => `https://anime4i.com/${slug}-episode-${ep}-english-subtitles/`,
  },
  {
    name: "luciferdonghua",
    providerLabel: "Lucifer Donghua (.org)",
    displayName: "Smooth Watch",
    description: "Good subtitles and viewing experience; titles may be removed.",
    directUrl: (ep, slug) =>
      slug.includes("fights-break-sphere")
        ? `https://luciferdonghua.org/${slug}-episod-${ep}-english-subtitle/`
        : `https://luciferdonghua.org/${slug}-episode-${ep}-english-sub/`,
  },
  {
    name: "luciferdonghuain",
    providerLabel: "Lucifer Donghua (.in)",
    displayName: "HD Multi-Sub",
    description: "Good resolution and multiple subtitles; titles may be removed.",
    directUrl: (ep, slug) => `https://luciferdonghua.in/${slug}-episode-${ep}-lucifer-donghua/`,
  },
];

interface VideoPlayerProps {
  episode: number;
  donghuaSlug?: string;
  serverSlugs?: Partial<Record<VideoServerName, string>>;
  availableServers?: VideoServerName[];
  serverEpisodeCounts?: Partial<Record<VideoServerName, number>>;
  seriesTitle?: string;
  onEnded?: () => void;
}

type LoadState = "loading" | "playing" | "error";

export function VideoPlayer({
  episode,
  donghuaSlug = "renegade-immortal",
  serverSlugs,
  availableServers = SERVERS.map((server) => server.name),
  serverEpisodeCounts,
  seriesTitle,
  onEnded,
}: VideoPlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [serverStatuses, setServerStatuses] = useState<Record<string, "ok" | "fail" | "unknown">>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const requestIdRef = useRef(0);
  const preferredServerRef = useRef<VideoServerName | null>(null);
  const isServerAvailable = useCallback((serverName: VideoServerName) =>
    availableServers.includes(serverName) &&
    (serverEpisodeCounts?.[serverName] === undefined || episode <= serverEpisodeCounts[serverName]),
  [availableServers, episode, serverEpisodeCounts]);
  const firstAvailableServer = SERVERS.findIndex((server) => isServerAvailable(server.name));

  const fetchEmbed = useCallback(async (serverIndex: number) => {
    const requestId = ++requestIdRef.current;

    setLoadState("loading");
    setEmbedUrl(null);
    setActiveServer(serverIndex);

    const server = SERVERS[serverIndex];
    if (!server || !isServerAvailable(server.name)) {
      setLoadState("error");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("fetch-video-source", {
        body: { episode, server: server.name, donghuaSlug, serverSlugs, seriesTitle },
      });

      if (requestId !== requestIdRef.current) return;

      if (!error && data?.success && data?.embedUrl) {
        setEmbedUrl(data.embedUrl);
        setLoadState("loading");
        setServerStatuses((prev) => ({ ...prev, [server.name]: "ok" }));
        return;
      }

      // Fallback: Use direct server page URL as iframe fallback
      const direct = getFunctionFallbackUrl(data, server.name) ||
        server.directUrl(episode, resolveServerSlug(server.name, donghuaSlug, serverSlugs));
      setEmbedUrl(direct);
      setLoadState("playing");
      setServerStatuses((prev) => ({ ...prev, [server.name]: "ok" }));
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      console.warn(`Server ${server.name} error fallback:`, e);
      const direct = server.directUrl(episode, resolveServerSlug(server.name, donghuaSlug, serverSlugs));
      setEmbedUrl(direct);
      setLoadState("playing");
      setServerStatuses((prev) => ({ ...prev, [server.name]: "ok" }));
    }
  }, [episode, donghuaSlug, serverSlugs, seriesTitle, isServerAvailable]);

  useEffect(() => {
    setServerStatuses({});
    setEmbedUrl(null);
    const preferredServerIndex = preferredServerRef.current
      ? SERVERS.findIndex((server) => server.name === preferredServerRef.current && isServerAvailable(server.name))
      : -1;
    const serverIndex = preferredServerIndex >= 0 ? preferredServerIndex : firstAvailableServer;
    if (serverIndex < 0) setLoadState("error");
    else fetchEmbed(serverIndex);
    return () => {
      requestIdRef.current += 1;
    };
  }, [episode, donghuaSlug, serverSlugs, availableServers, serverEpisodeCounts, fetchEmbed, firstAvailableServer, isServerAvailable]);

  const handleServerClick = (index: number) => {
    preferredServerRef.current = SERVERS[index].name;
    setServerStatuses((prev) => {
      const copy = { ...prev };
      delete copy[SERVERS[index].name];
      return copy;
    });
    fetchEmbed(index);
  };

  const handleIframeLoad = () => {
    setLoadState("playing");
  };

  const handleRetry = () => {
    setServerStatuses({});
    const currentServer = SERVERS[activeServer];
    if (currentServer && isServerAvailable(currentServer.name)) fetchEmbed(activeServer);
    else if (firstAvailableServer >= 0) fetchEmbed(firstAvailableServer);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="gradient-card border border-border rounded-xl overflow-hidden">
      {/* Video area */}
      <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>

        {/* Loading overlay */}
        {loadState === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <MonitorPlay size={22} className="text-primary absolute inset-0 m-auto" />
            </div>
            <p className="text-sm text-foreground font-heading tracking-wider mb-1">
              {SERVERS[activeServer]?.displayName}
            </p>
            <p className="text-[11px] text-muted-foreground font-body">
              {SERVERS[activeServer]?.providerLabel}
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Loading Episode {episode}...
            </p>
          </div>
        )}

        {/* Error state */}
        {loadState === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6 text-center">
            <AlertTriangle size={36} className="text-destructive mb-3" />
            <p className="text-sm font-heading text-foreground tracking-wider mb-1">Stream Unavailable</p>
            <p className="text-xs text-muted-foreground font-body mb-5">
              All servers failed to load Episode {episode}. Try again or watch on the source site.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-body hover:bg-primary/90 transition-colors"
              >
                <RefreshCw size={13} /> Retry
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SERVERS.filter((srv) => isServerAvailable(srv.name)).map((srv) => (
                <a
                  key={srv.name}
                  href={srv.directUrl(episode, resolveServerSlug(srv.name, donghuaSlug, serverSlugs))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground rounded text-xs font-body transition-colors border border-border"
                >
                  <ExternalLink size={11} /> {srv.providerLabel}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Iframe player */}
        {embedUrl && (
          <iframe
            ref={iframeRef}
            key={`${episode}-${activeServer}-${embedUrl}`}
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            onLoad={handleIframeLoad}
            title={`${seriesTitle || "Episode"} ${episode}`}
          />
        )}

        {/* Fullscreen button */}
        {loadState === "playing" && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <Maximize2 size={15} />
          </button>
        )}
      </div>

      {/* Controls bar */}
      <div className="p-3 border-t border-border bg-card/50">
        {/* Server selector */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <MonitorPlay size={13} className="text-primary" />
            <span className="text-[11px] font-heading text-muted-foreground tracking-wider uppercase">
              Servers
            </span>
          </div>
          <button
            onClick={() => setShowSources((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            <ExternalLink size={11} /> Sources
            <ChevronDown size={11} className={`transition-transform ${showSources ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SERVERS.map((srv, i) => {
            if (!isServerAvailable(srv.name)) return null;
            const status = serverStatuses[srv.name];
            const isActive = activeServer === i && loadState !== "error";
            return (
              <button
                key={srv.name}
                onClick={() => handleServerClick(i)}
                title={`${srv.providerLabel}: ${srv.description}`}
                aria-label={`${srv.displayName} — ${srv.providerLabel}. ${srv.description}`}
                className={`relative rounded px-3 py-1.5 text-left font-body transition-all ${
                  isActive && loadState === "playing"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isActive && loadState === "loading"
                    ? "bg-primary/40 text-primary-foreground"
                    : status === "fail"
                    ? "bg-destructive/10 text-destructive/70 hover:bg-destructive/20 line-through"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                <span className="block text-xs font-semibold">{srv.displayName}</span>
                <span className={`mt-0.5 block text-[10px] ${isActive && loadState !== "error" ? "opacity-80" : "text-muted-foreground"}`}>
                  {srv.providerLabel}
                </span>
                {isActive && loadState === "loading" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Direct source links (collapsible) */}
        {showSources && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border"
          >
            <p className="text-[10px] text-muted-foreground font-body mb-2">Watch on source sites:</p>
            <div className="flex flex-wrap gap-1.5">
              {SERVERS.filter((srv) => isServerAvailable(srv.name)).map((srv) => (
                <a
                  key={srv.name}
                  href={srv.directUrl(episode, resolveServerSlug(srv.name, donghuaSlug, serverSlugs))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted hover:bg-muted/70 text-[10px] font-body text-muted-foreground hover:text-foreground transition-colors border border-border"
                >
                  <ExternalLink size={10} />
                  {srv.providerLabel}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
