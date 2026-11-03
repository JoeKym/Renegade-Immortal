import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RoleBadge({ role, size = "sm" }: { role: string; size?: "sm" | "xs" }) {
  if (role === "admin") {
    return (
      <Badge
        variant="outline"
        className={`border-destructive/50 text-destructive bg-destructive/10 font-heading tracking-wider ${size === "xs" ? "text-[8px] px-1 py-0" : "text-[10px] px-1.5 py-0"}`}
      >
        <Shield size={size === "xs" ? 7 : 8} className="mr-0.5" />
        Admin
      </Badge>
    );
  }
  if (role === "moderator") {
    return (
      <Badge
        variant="outline"
        className={`border-accent/50 text-accent-foreground bg-accent/20 font-heading tracking-wider ${size === "xs" ? "text-[8px] px-1 py-0" : "text-[10px] px-1.5 py-0"}`}
      >
        <Shield size={size === "xs" ? 7 : 8} className="mr-0.5" />
        Moderator
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={`border-primary/30 text-primary/60 bg-primary/5 font-heading tracking-wider ${size === "xs" ? "text-[8px] px-1 py-0" : "text-[10px] px-1.5 py-0"}`}
    >
      User
    </Badge>
  );
}
