import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FeedbackReviews } from "./FeedbackReviews";
import { useLocation, Link } from "react-router-dom";
import { Navbar } from "./Navbar";
import { NotificationBell } from "./NotificationBell";
import { LanguageSelector } from "./LanguageSelector";
import { VisitorCounter } from "./VisitorCounter";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import { Shield, Wrench, Clock } from "lucide-react";
import githubIcon from "@/assets/socials/github.svg";
import linktreeIcon from "@/assets/socials/linktree.svg";
import instagramIcon from "@/assets/socials/instagram.svg";
import facebookIcon from "@/assets/socials/facebook.svg";
import twitterIcon from "@/assets/socials/twitter.svg";
import tiktokIcon from "@/assets/socials/tiktok.svg";
import youtubeIcon from "@/assets/socials/youtube.svg";
import spotifyIcon from "@/assets/socials/spotify.svg";
import pinterestIcon from "@/assets/socials/pinterest.svg";
import redditIcon from "@/assets/socials/reddit.svg";
import whatsappIcon from "@/assets/socials/whatsapp.svg";
import emailIcon from "@/assets/socials/email.svg";

import { MaintenanceAnimation } from "./MaintenanceAnimation";

/** Same ambient clip as the original, re-encoded for the web (muted, so no audio track). */
const BG_VIDEO_SRC = "/videos/renegadeimmortal_bg_web.mp4";

let bgVideoEnabled = false;

/** Starts the background video only after the page has loaded, so it never competes with first paint. */
function useDeferredBackgroundVideo() {
  const [src, setSrc] = useState<string | null>(() => (bgVideoEnabled ? BG_VIDEO_SRC : null));

  useEffect(() => {
    if (bgVideoEnabled) return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => {
      bgVideoEnabled = true;
      setSrc(BG_VIDEO_SRC);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(enable, { timeout: 2500 });
      } else {
        timeoutId = window.setTimeout(enable, 1500);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return src;
}

function SvgIcon({ src, className }: { src: string; className?: string }) {
  return <img src={src} alt="" className={className} />;
}

function MaintenanceCountdown({ eta }: { eta: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(eta).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Any moment now...");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eta]);

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock size={16} />
        <span className="font-body text-sm">Estimated time remaining</span>
      </div>
      <span className="font-heading text-2xl text-primary tracking-wider">{timeLeft}</span>
    </div>
  );
}
type SocialLink = {
  name: string;
  url: string;
  svgSrc?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const socialLinks: SocialLink[] = [
  { name: "Linktree", url: "https://linktr.ee/Joekym07", svgSrc: linktreeIcon },
  { name: "Instagram", url: "https://www.instagram.com/ky.money223", svgSrc: instagramIcon },
  { name: "Facebook", url: "https://www.facebook.com/ky.money223", svgSrc: facebookIcon },
  { name: "Twitter / X", url: "https://x.com/JoeKym07", svgSrc: twitterIcon },
  { name: "TikTok", url: "https://www.tiktok.com/@joekym07", svgSrc: tiktokIcon },
  { name: "YouTube", url: "http://www.youtube.com/@qiaojin07", svgSrc: youtubeIcon },
  { name: "Spotify", url: "https://open.spotify.com/user/3175pawgep7gxnrd6ve5vkdfmpdy?si=0aef054eb4ef4f9a", svgSrc: spotifyIcon },
  { name: "Pinterest", url: "https://www.pinterest.com/Joekym07", svgSrc: pinterestIcon },
  { name: "GitHub", url: "https://github.com/JoeKym", svgSrc: githubIcon },
  { name: "Reddit", url: "https://www.reddit.com/user/New_Region_381/", svgSrc: redditIcon },
  { name: "WhatsApp", url: "https://wa.me/254117412271?text=Hi%21%20I%E2%80%99d%20like%20to%20get%20in%20touch%20with%20you.", svgSrc: whatsappIcon },
];

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAdmin } = useAdminCheck();
  const { maintenance, maintenanceEta } = useMaintenanceMode();
  const bgVideoSrc = useDeferredBackgroundVideo();

  useEffect(() => {
    let sessionId = sessionStorage.getItem("pv_session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("pv_session", sessionId);
    }
    const currentTotal = parseInt(localStorage.getItem("total_page_views_count") || "1024", 10);
    localStorage.setItem("total_page_views_count", String(currentTotal + 1));

    supabase.from("page_views").insert({
      page_path: location.pathname,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    }).then(() => {});
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Video Background */}
      {bgVideoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 z-0 h-full w-full object-cover opacity-[0.08] pointer-events-none"
        >
          <source src={bgVideoSrc} type="video/mp4" />
        </video>
      )}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/90 via-background/95 to-background pointer-events-none" />

      <Navbar />

      {maintenance && isAdmin && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-300 px-4 py-2 text-xs sm:text-sm flex items-center justify-between z-50 relative backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span><strong>MAINTENANCE MODE IS ENABLED:</strong> Visitors are seeing the maintenance screen with live animations. You are viewing in Admin bypass mode.</span>
          </div>
          <a href="/admin" className="underline hover:text-amber-100 transition-colors font-semibold ml-2 shrink-0">
            Admin Panel &rarr;
          </a>
        </div>
      )}

      {maintenance && !isAdmin ? (
        <main className="pt-[60px] relative z-10 overflow-hidden">
          <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <motion.div
              className="absolute inset-0 opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute left-[20%] top-[18%] h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute right-[18%] top-[28%] h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 max-w-xl rounded-2xl border border-primary/20 bg-card/70 p-8 shadow-[0_0_60px_rgba(212,175,55,0.18)] backdrop-blur-xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
              >
                <Wrench className="h-10 w-10 text-primary" />
              </motion.div>

              <p className="mb-3 text-xs font-heading uppercase tracking-[0.35em] text-primary/80">Scheduled maintenance</p>
              <h1 className="mb-3 font-heading text-3xl tracking-wider text-foreground">Under Maintenance</h1>
              <p className="mb-6 font-body text-sm text-muted-foreground">
                We're performing scheduled maintenance to improve your experience. Please check back shortly.
              </p>
              
              <MaintenanceAnimation />

              {maintenanceEta && <MaintenanceCountdown eta={maintenanceEta} />}
            </motion.div>
          </div>
        </main>
      ) : (
        <main className="pt-[60px] relative z-10">{children}</main>
      )}

      {/* Floating icons - Language, Admin, Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
        <LanguageSelector />
        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/admin"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-card/90 backdrop-blur-lg border border-border shadow-lg shadow-primary/10 text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
              >
                <Shield size={18} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Admin Dashboard
            </TooltipContent>
          </Tooltip>
        )}
        <div className="bg-card/90 backdrop-blur-lg border border-border rounded-full p-1 shadow-lg shadow-primary/10">
          <NotificationBell />
        </div>
      </div>

      <FeedbackReviews pagePath={location.pathname} />

      <footer className="relative z-10 mt-16 border-t border-border/80 bg-card/30 py-10 md:mt-20 md:py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-heading text-base font-semibold tracking-wide text-primary md:text-lg">仙逆 <span className="text-muted-foreground/60">·</span> Renegade Immortal</p>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              A fan-made reference, donghua release tracker, and community for Er Gen’s Renegade Immortal
              </p>
            </div>
            <p className="text-xs text-muted-foreground/75">Explore the world. Follow the story. Find your Dao.</p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 border-y border-border/70 py-8 md:grid-cols-4 md:gap-8 md:py-9">
            <section>
              <h3 className="mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">Explore</h3>
              <nav aria-label="Explore links" className="flex flex-col gap-2.5 text-sm">
                <Link to="/guide" className="text-muted-foreground hover:text-primary transition-colors">Beginner’s Guide</Link>
                <Link to="/characters" className="text-muted-foreground hover:text-primary transition-colors">Characters</Link>
                <Link to="/arcs" className="text-muted-foreground hover:text-primary transition-colors">Arc Explorer</Link>
                <Link to="/timeline" className="text-muted-foreground hover:text-primary transition-colors">Story Timeline</Link>
                <Link to="/cultivation" className="text-muted-foreground hover:text-primary transition-colors">Cultivation</Link>
                <Link to="/multiverse" className="text-muted-foreground hover:text-primary transition-colors">Multiverse</Link>
              </nav>
            </section>

            <section>
              <h3 className="mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">Donghua & Watch</h3>
              <nav aria-label="Donghua and watch links" className="flex flex-col gap-2.5 text-sm">
                <Link to="/donghua" className="text-muted-foreground hover:text-primary transition-colors">Donghua Tracker</Link>
                <Link to="/donghua-release-timeline" className="text-muted-foreground hover:text-primary transition-colors">Release Timeline</Link>
                <Link to="/watch" className="text-muted-foreground hover:text-primary transition-colors">Watch Episodes</Link>
                <Link to="/donghua-series/theatrical-movies" className="text-muted-foreground hover:text-primary transition-colors">Movies & Specials</Link>
                <Link to="/news" className="text-muted-foreground hover:text-primary transition-colors">News & Updates</Link>
              </nav>
            </section>

            <section>
              <h3 className="mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">Community</h3>
              <nav aria-label="Community links" className="flex flex-col gap-2.5 text-sm">
                <Link to="/communities" className="text-muted-foreground hover:text-primary transition-colors">Communities</Link>
                <Link to="/feed" className="text-muted-foreground hover:text-primary transition-colors">Community Feed</Link>
                <Link to="/members" className="text-muted-foreground hover:text-primary transition-colors">Members</Link>
                <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">Support</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              </nav>
            </section>

            <section>
              <h3 className="mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">Project & Legal</h3>
              <nav aria-label="Project and legal links" className="flex flex-col gap-2.5 text-sm">
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/dmca" className="text-muted-foreground hover:text-primary transition-colors">Copyright & DMCA</Link>
              </nav>
            </section>
          </div>

          <div className="py-7">
            <h3 className="mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">Connect</h3>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <Tooltip key={link.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                    >
                      {link.svgSrc ? (
                        <SvgIcon src={link.svgSrc} className="h-4 w-4" />
                      ) : link.icon ? (
                        <link.icon className="h-3.5 w-3.5" />
                      ) : null}
                      {link.name}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {link.name}
                  </TooltipContent>
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="mailto:mail.jkyme@gmail.com"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                  >
                    <SvgIcon src={emailIcon} className="h-4 w-4" />
                    Email
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Send an email
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center justify-center gap-4 mb-3">
              <VisitorCounter />
            </div>
          )}
          <div className="border-t border-border/60 pt-6">
            <p className="text-xs text-muted-foreground/70">
              All lore content based on the original novel by Er Gen
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Created by{" "}
              <a
                href="https://joekymlabs.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                JoeKym Labs™
              </a>
            </p>
            <div className="mt-6 flex justify-center">
              <a href="https://www.dmca.com/r/kz43k2l" title="DMCA.com Protection Status" className="dmca-badge" target="_blank" rel="noopener noreferrer">
                <img src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png?ID=1aab0c2c-bc16-402b-880c-35e903a38a2c" alt="DMCA.com Protection Status" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}