import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { User } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";

export function UserMenu() {
  const { t } = useT();
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all text-xs font-heading tracking-wider"
      >
        <User size={14} />
        <span className="hidden sm:inline">{t("auth.login")}</span>
      </Link>
    );
  }

  const profileWithMeta = profile as { username?: string; avatar_url?: string } | null;
  const profileLink = profileWithMeta?.username ? `/cultivator/${profileWithMeta.username}` : "/profile";
  const avatarUrl = profileWithMeta?.avatar_url;
  const displayName = profile?.display_name || t("profile.title");

  return (
    <Link
      to={profileLink}
      className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-border hover:border-primary/50 transition-colors"
      title={displayName}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <User size={16} className="text-muted-foreground" />
        </div>
      )}
    </Link>
  );
}
