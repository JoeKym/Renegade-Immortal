import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useT } from "@/contexts/TranslationContext";

export default function LoginPage() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let authData;
    let error;

    // If not an email format, use Edge Function for username login
    if (!email.includes("@")) {
      const { data, error: invokeError } = await supabase.functions.invoke("login-with-username", {
        body: { username: email, password },
      });

      if (invokeError) {
        toast.error(invokeError.message);
        setLoading(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Set the session from Edge Function response
      if (data?.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        authData = { user: data.user, session: data.session };
      }
    } else {
      // Regular email login
      const result = await supabase.auth.signInWithPassword({ email, password });
      authData = result.data;
      error = result.error;

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
    }

    if (authData?.user) {
      // Fetch user profile for welcome message and username check
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("user_id", authData.user.id)
        .single();

      const displayName = profile?.display_name || profile?.username || "Cultivator";
      toast.success(`Welcome back, ${displayName}!`);

      // Redirect to profile if username is not set
      if (!profile?.username) {
        toast.info("Please set up your username in your profile");
        navigate("/profile");
      } else {
        navigate("/");
      }
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md gradient-card border border-border rounded-lg p-8"
        >
          <h1 className="font-heading text-2xl text-primary text-center mb-2 tracking-wider">{t("auth.login")}</h1>
          <p className="text-sm text-muted-foreground font-body text-center mb-6">{t("auth.login")}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-heading text-muted-foreground tracking-wider uppercase block mb-1">{t("auth.email")} / {t("auth.username")}</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="email@example.com or username"
              />
            </div>
            <div>
              <label className="text-xs font-heading text-muted-foreground tracking-wider uppercase block mb-1">{t("auth.password")}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded gradient-gold font-heading text-sm tracking-wider text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? t("common.loading") : t("auth.login")}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline font-body block">
              {t("auth.forgot_password")}
            </Link>
            <p className="text-xs text-muted-foreground font-body">
              {t("auth.no_account")}{" "}
              <Link to="/signup" className="text-primary hover:underline">{t("auth.signup")}</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
