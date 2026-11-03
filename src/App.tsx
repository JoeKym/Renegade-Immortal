import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useEffect } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { HelmetProvider } from "react-helmet-async";
import { DonghuaCatalogProvider } from "@/contexts/DonghuaCatalogContext";
import { LoreContentProvider } from "@/contexts/LoreContentContext";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { syncAllSeriesReleaseMetadata } from "@/services/releaseMetadata";

const Index = lazy(() => import("./pages/Index"));
const Characters = lazy(() => import("./pages/Characters"));
const Daos = lazy(() => import("./pages/Daos"));
const Cultivation = lazy(() => import("./pages/Cultivation"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Multiverse = lazy(() => import("./pages/Multiverse"));
const Donghua = lazy(() => import("./pages/Donghua"));
const DonghuaReleaseTimeline = lazy(() => import("./pages/DonghuaReleaseTimeline"));
const Lore = lazy(() => import("./pages/Lore"));
const Guide = lazy(() => import("./pages/Guide"));
const Artifacts = lazy(() => import("./pages/Artifacts"));
const Locations = lazy(() => import("./pages/Locations"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const Suspended = lazy(() => import("./pages/Suspended"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Members = lazy(() => import("./pages/Members"));
const Communities = lazy(() => import("./pages/Communities"));
const CommunityDetail = lazy(() => import("./pages/CommunityDetail"));
const Feed = lazy(() => import("./pages/Feed"));
const Messages = lazy(() => import("./pages/Messages"));
const GroupMessages = lazy(() => import("./pages/GroupMessages"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Support = lazy(() => import("./pages/Support"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const Voidy = lazy(() => import("./pages/VoidyChat"));
const News = lazy(() => import("./pages/News"));
const Watch = lazy(() => import("./pages/Watch"));
const WatchDetail = lazy(() => import("./pages/WatchDetail"));
const DonghuaSeriesList = lazy(() => import("./pages/DonghuaSeries"));
const About = lazy(() => import("./pages/About"));
const DMCA = lazy(() => import("./pages/DMCA"));
const SearchAnalytics = lazy(() => import("./pages/SearchAnalytics"));
const SearchPage = lazy(() => import("./pages/Search"));
const ArcExplorer = lazy(() => import("./pages/ArcExplorer"));

const pageLoaders: Record<string, () => Promise<unknown>> = {
  "/": () => import("./pages/Index"),
  "/characters": () => import("./pages/Characters"),
  "/daos": () => import("./pages/Daos"),
  "/cultivation": () => import("./pages/Cultivation"),
  "/timeline": () => import("./pages/Timeline"),
  "/multiverse": () => import("./pages/Multiverse"),
  "/donghua": () => import("./pages/Donghua"),
  "/donghua-release-timeline": () => import("./pages/DonghuaReleaseTimeline"),
  "/lore": () => import("./pages/Lore"),
  "/guide": () => import("./pages/Guide"),
  "/artifacts": () => import("./pages/Artifacts"),
  "/locations": () => import("./pages/Locations"),
  "/sects": () => import("./pages/Communities"),
  "/feed": () => import("./pages/Feed"),
  "/voidy": () => import("./pages/VoidyChat"),
  "/news": () => import("./pages/News"),
  "/watch": () => import("./pages/Watch"),
  "/about": () => import("./pages/About"),
  "/search": () => import("./pages/Search"),
  "/arcs": () => import("./pages/ArcExplorer"),
};

function prefetchRoute(path: string) {
  pageLoaders[path]?.();
}

const queryClient = new QueryClient();

function LegacySectRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/sects/${id}` : "/sects"} replace />;
}

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background" aria-busy="true">
      <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
    </div>
  );
}

const App = () => {
  useEffect(() => {
    // Warm page chunks when a nav link is hovered/focused, and preload the main pages once idle.
    const onHover = (e: Event) => {
      const a = (e.target as HTMLElement).closest?.("a[href]");
      const href = a?.getAttribute("href");
      if (href?.startsWith("/")) prefetchRoute(href.split("?")[0]);
    };
    document.addEventListener("pointerover", onHover);
    document.addEventListener("focusin", onHover);
    const warm = () => {
      for (const path of ["/guide", "/characters", "/daos", "/donghua", "/lore"]) prefetchRoute(path);
    };
    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(warm)
        : window.setTimeout(warm, 3000);
    return () => {
      document.removeEventListener("pointerover", onHover);
      document.removeEventListener("focusin", onHover);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId as number);
      window.clearTimeout(idleId);
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      syncAllSeriesReleaseMetadata(DONGHUA_SERIES).catch(() => {});
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(sync);
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(sync, 2000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <TranslationProvider>
            <TooltipProvider>
              <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true }}>
                <DonghuaCatalogProvider>
                <LoreContentProvider>
                <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/characters" element={<Characters />} />
                  <Route path="/arcs" element={<ArcExplorer />} />
                  <Route path="/daos" element={<Daos />} />
                  <Route path="/cultivation" element={<Cultivation />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/multiverse" element={<Multiverse />} />
                  <Route path="/donghua" element={<Donghua />} />
                  <Route path="/donghua-release-timeline" element={<DonghuaReleaseTimeline />} />
                  <Route path="/donghua-series" element={<DonghuaSeriesList />} />
                  <Route path="/donghua-series/:sectionId" element={<DonghuaSeriesList />} />
                  <Route path="/lore" element={<Lore />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/artifacts" element={<Artifacts />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/suspended" element={<Suspended />} />
                  <Route path="/fellow-daoists" element={<Members />} />
                  <Route path="/sects" element={<Communities />} />
                  <Route path="/sects/:id" element={<CommunityDetail />} />
                  <Route path="/communities" element={<Navigate to="/sects" replace />} />
                  <Route path="/communities/:id" element={<LegacySectRedirect />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/members" element={<Navigate to="/fellow-daoists" replace />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/peaks" element={<GroupMessages />} />
                  <Route path="/groups" element={<Navigate to="/peaks" replace />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cultivator/:username" element={<UserProfile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/voidy" element={<Voidy />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/watch" element={<Watch />} />
                  <Route path="/watch/:slug" element={<WatchDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/dmca" element={<DMCA />} />
                  <Route path="/admin/search-analytics" element={<SearchAnalytics />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
                </LoreContentProvider>
                </DonghuaCatalogProvider>
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
          </TranslationProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
