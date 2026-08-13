import { motion } from "framer-motion";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(178,94,46,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(239,68,68,0.08),_transparent_35%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card/80 p-8 text-center shadow-2xl shadow-primary/10 backdrop-blur-sm"
      >
        <motion.div
          initial={{ rotate: -8, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary"
        >
          <SearchX className="h-8 w-8" />
        </motion.div>

        <p className="mb-2 text-sm font-heading uppercase tracking-[0.35em] text-primary">404</p>
        <h1 className="mb-3 text-4xl font-heading text-foreground">Lost in the cultivation realm</h1>
        <p className="mb-6 text-sm text-muted-foreground font-body">
          The page <span className="font-medium text-foreground">{location.pathname}</span> could not be found.
          Return to the main path or continue exploring the latest updates.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-heading text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <Link
            to="/watch"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-heading text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore Watch
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
