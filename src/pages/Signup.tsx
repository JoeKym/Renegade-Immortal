import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useT } from "@/contexts/TranslationContext";

export default function SignupPage() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    // Validate username format (alphanumeric, underscore, hyphen only)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      toast.error("Username can only contain letters, numbers, underscores, and hyphens");
      return;
    }

    setLoading(true);
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || "Cultivator" },
        emailRedirectTo: window.location.origin,
      },
    });

    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    // Update profile with username
    if (authData?.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username: username.trim().toLowerCase() })
        .eq("user_id", authData.user.id);

      if (profileError) {
        toast.error("Account created but failed to set username");
      } else {
        toast.success("Account created! Please check your email to confirm.");
      }
    }

    setLoading(false);
    navigate("/login");
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md gradient-card border border-border rounded-lg p-8"
        >
          <h1 className="font-heading text-2xl text-primary text-center mb-2 tracking-wider">{t("auth.signup")}</h1>
          <p className="text-sm text-muted-foreground font-body text-center mb-6">{t("auth.signup")}</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-heading text-muted-foreground tracking-wider uppercase block mb-1">{t("auth.display_name")}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 50))}
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="Wang Lin"
              />
            </div>
            <div>
              <label className="text-xs font-heading text-muted-foreground tracking-wider uppercase block mb-1">{t("auth.username")} *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20))}
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="your-username"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Required. Letters, numbers, underscores, hyphens only.</p>
            </div>
            <div>
              <label className="text-xs font-heading text-muted-foreground tracking-wider uppercase block mb-1">{t("auth.email")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="cultivator@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-heading text-muted-foreground tracking-wider uppercase block mb-1">{t("auth.password")}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded gradient-gold font-heading text-sm tracking-wider text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? t("common.loading") : t("auth.create_account")}
            </button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground font-body">
            {t("auth.has_account")}{" "}
            <Link to="/login" className="text-primary hover:underline">{t("auth.login")}</Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
