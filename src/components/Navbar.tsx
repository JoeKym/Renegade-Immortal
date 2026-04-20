import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Scroll, Swords, Users, Clock, Globe, BookOpen, Tv, Sparkles, Map, Shield, HelpCircle, ChevronDown, Rss, MessageCircle, UsersRound, Settings, Bot, Newspaper, Play, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { MessagesNavLink } from "./MessagesNavLink";
import { GroupsNavLink } from "./GroupsNavLink";
import { useT } from "@/contexts/TranslationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNav = [
  { path: "/", labelKey: "nav.home", icon: Scroll },
  { path: "/guide", labelKey: "nav.guide", icon: HelpCircle },
  { path: "/characters", labelKey: "nav.characters", icon: Users },
];

const worldDropdown = {
  labelKey: "nav.world",
  icon: Globe,
  items: [
    { path: "/daos", labelKey: "world.daos", icon: Sparkles },
    { path: "/cultivation", labelKey: "world.cultivation", icon: Swords },
    { path: "/artifacts", labelKey: "world.artifacts", icon: Shield },
    { path: "/locations", labelKey: "world.locations", icon: Map },
    { path: "/multiverse", labelKey: "world.multiverse", icon: Globe },
  ],
};

const moreDropdown = {
  labelKey: "nav.more",
  icon: BookOpen,
  items: [
    { path: "/timeline", labelKey: "guide.timeline", icon: Clock },
    { path: "/donghua", labelKey: "watch.donghua", icon: Tv },
    { path: "/lore", labelKey: "nav.lore", icon: BookOpen },
    { path: "/news", labelKey: "nav.news", icon: Newspaper },
    { path: "/watch", labelKey: "nav.watch", icon: Play },
    { path: "/about", labelKey: "footer.about", icon: Info },
  ],
};

const communityNav = { path: "/communities", labelKey: "nav.community", icon: Users };
const feedNav = { path: "/feed", labelKey: "nav.feed", icon: Rss };
const voidyNav = { path: "/voidy", labelKey: "nav.voidy", icon: Bot };

// Full list for mobile
const allNavItems = [
  { path: "/", labelKey: "nav.home", icon: Scroll },
  { path: "/guide", labelKey: "nav.guide", icon: HelpCircle },
  { path: "/characters", labelKey: "nav.characters", icon: Users },
  { path: "/daos", labelKey: "world.daos", icon: Sparkles },
  { path: "/cultivation", labelKey: "world.cultivation", icon: Swords },
  { path: "/artifacts", labelKey: "world.artifacts", icon: Shield },
  { path: "/locations", labelKey: "world.locations", icon: Map },
  { path: "/timeline", labelKey: "guide.timeline", icon: Clock },
  { path: "/multiverse", labelKey: "world.multiverse", icon: Globe },
  { path: "/donghua", labelKey: "watch.donghua", icon: Tv },
  { path: "/lore", labelKey: "nav.world", icon: BookOpen },
  { path: "/news", labelKey: "nav.news", icon: Newspaper },
  { path: "/watch", labelKey: "nav.watch", icon: Play },
  { path: "/communities", labelKey: "nav.community", icon: Users },
  { path: "/feed", labelKey: "nav.feed", icon: Rss },
  { path: "/messages", labelKey: "common.messages", icon: MessageCircle },
  { path: "/groups", labelKey: "common.groups", icon: UsersRound },
  { path: "/voidy", labelKey: "nav.voidy", icon: Bot },
  { path: "/about", labelKey: "footer.about", icon: Info },
  { path: "/settings", labelKey: "settings.title", icon: Settings },
];

function NavDropdown({ dropdown, location, t }: { dropdown: typeof worldDropdown; location: ReturnType<typeof useLocation>; t: (key: string) => string }) {
  const [open, setOpen] = useState(false);
  const isActive = dropdown.items.some(item => location.pathname === item.path);
  const Icon = dropdown.icon;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => { clearTimeout(timeoutRef.current); setOpen(true); };
  const handleLeave = () => { timeoutRef.current = setTimeout(() => setOpen(false), 150); };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-body transition-all duration-300 outline-none ${
          isActive ? "text-primary bg-muted" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
        }`}
      >
        <Icon size={14} />
        {t(dropdown.labelKey)}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="min-w-[160px]"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {dropdown.items.map((item) => {
          const ItemIcon = item.icon;
          const itemActive = location.pathname === item.path;
          return (
            <DropdownMenuItem key={item.path} asChild>
              <Link
                to={item.path}
                className={`flex items-center gap-2 cursor-pointer ${itemActive ? "text-primary" : ""}`}
              >
                <ItemIcon size={14} />
                {t(item.labelKey)}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { t } = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-primary tracking-wider">仙逆</span>
            <span className="hidden sm:inline font-heading text-sm text-foreground tracking-widest uppercase">Renegade Immortal</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body transition-all duration-300 ${
                    isActive ? "text-primary bg-muted" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                >
                  <Icon size={14} />
                  {t(item.labelKey)}
                </Link>
              );
            })}

            <NavDropdown dropdown={worldDropdown} location={location} t={t} />
            <NavDropdown dropdown={moreDropdown} location={location} t={t} />

            <Link
              to={communityNav.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body transition-all duration-300 ${
                location.pathname === communityNav.path || location.pathname.startsWith("/communities")
                  ? "text-primary bg-muted"
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50"
              }`}
            >
              <Users size={14} />
              {t(communityNav.labelKey)}
            </Link>

            <Link
              to={feedNav.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body transition-all duration-300 ${
                location.pathname === feedNav.path
                  ? "text-primary bg-muted"
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50"
              }`}
            >
              <Rss size={14} />
              {t(feedNav.labelKey)}
            </Link>

            <Link
              to={voidyNav.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body transition-all duration-300 ${
                location.pathname === voidyNav.path
                  ? "text-primary bg-muted"
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50"
              }`}
            >
              <Bot size={14} />
              {t(voidyNav.labelKey)}
            </Link>

            <MessagesNavLink iconSize={14} />
            <GroupsNavLink iconSize={14} />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors">
              <Search size={18} />
            </button>
            <ThemeToggle />
            <UserMenu />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-primary transition-colors">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="p-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md font-body transition-all ${
                        isActive ? "text-primary bg-muted" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                      }`}
                    >
                      <Icon size={16} />
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
