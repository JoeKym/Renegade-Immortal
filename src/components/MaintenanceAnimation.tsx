import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Sparkles, Wrench, Code2, Cpu, Laptop, Brush } from "lucide-react";

export function MaintenanceAnimation() {
  const [activeScene, setActiveScene] = useState<"coder" | "cleaner" | "both">("both");
  const [codeIndex, setCodeIndex] = useState(0);

  const codeSnippets = [
    "const dao = await transcend(heavens);",
    "refining_bead_matrix.optimize();",
    "cleaning_server_cache... [100%]",
    "import { AncientGod } from '@dao/core';",
    "patching_formation_arrays(v4.2);",
    "system_maintenance.status = 'PEAK';",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [codeSnippets.length]);

  return (
    <div className="w-full max-w-3xl mx-auto my-6 flex flex-col items-center">
      {/* Scene Switcher Buttons */}
      <div className="flex items-center gap-2 mb-6 bg-muted/40 p-1 rounded-full border border-border">
        <button
          onClick={() => setActiveScene("both")}
          className={`px-3 py-1 text-xs font-heading rounded-full transition-colors ${
            activeScene === "both" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setActiveScene("coder")}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-heading rounded-full transition-colors ${
            activeScene === "coder" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 size={12} /> Coder Working
        </button>
        <button
          onClick={() => setActiveScene("cleaner")}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-heading rounded-full transition-colors ${
            activeScene === "cleaner" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Brush size={12} /> Crew Cleaning
        </button>
      </div>

      {/* Animation Canvas */}
      <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-card/80 border border-primary/20 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* SCENE 1: Programmer Coding */}
        {(activeScene === "both" || activeScene === "coder") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center justify-between p-5 rounded-xl border border-border bg-muted/30 relative overflow-hidden ${
              activeScene === "coder" ? "md:col-span-2" : ""
            }`}
          >
            {/* Background glowing particles */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"
            />

            <div className="flex items-center gap-2 mb-3 text-primary font-heading text-xs uppercase tracking-wider">
              <Laptop size={15} /> Lead Programmer Coding...
            </div>

            {/* Coder Avatar SVG & Computer Desk */}
            <div className="relative my-4 w-48 h-36 flex items-center justify-center">
              {/* Monitor */}
              <div className="absolute top-2 w-32 h-24 bg-slate-900 border-2 border-primary/40 rounded-lg p-2 flex flex-col justify-between shadow-lg">
                <div className="flex items-center gap-1 border-b border-primary/20 pb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[8px] text-muted-foreground font-mono ml-1">terminal.sh</span>
                </div>
                <div className="text-[9px] font-mono text-emerald-400 overflow-hidden text-left leading-relaxed">
                  <motion.div
                    key={codeIndex}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    &gt; {codeSnippets[codeIndex]}
                  </motion.div>
                  <div className="flex items-center text-primary mt-1">
                    <span>&gt;&nbsp;</span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-1.5 h-3 bg-primary inline-block"
                    />
                  </div>
                </div>
              </div>

              {/* Programmer Figure */}
              <div className="absolute bottom-0 flex flex-col items-center">
                {/* Head with headphones */}
                <div className="relative w-8 h-8 rounded-full bg-amber-200/90 border border-amber-400 flex items-center justify-center">
                  <div className="absolute -top-1 w-10 h-3 border-t-2 border-primary rounded-t-full" />
                  <div className="absolute -left-1 w-2.5 h-3 bg-primary rounded" />
                  <div className="absolute -right-1 w-2.5 h-3 bg-primary rounded" />
                </div>

                {/* Body typing */}
                <div className="relative w-14 h-10 bg-primary/80 rounded-t-lg mt-1 flex justify-center">
                  {/* Arms typing */}
                  <motion.div
                    animate={{ y: [0, -2, 0, 1, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="w-12 h-3 bg-amber-200/90 rounded-full mt-4 flex justify-between px-1"
                  >
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  </motion.div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-body text-center">
              Writing fresh server logic & optimizing lore database.
            </p>
          </motion.div>
        )}

        {/* SCENE 2: People Cleaning */}
        {(activeScene === "both" || activeScene === "cleaner") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center justify-between p-5 rounded-xl border border-border bg-muted/30 relative overflow-hidden ${
              activeScene === "cleaner" ? "md:col-span-2" : ""
            }`}
          >
            {/* Background glowing particles */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"
            />

            <div className="flex items-center gap-2 mb-3 text-amber-400 font-heading text-xs uppercase tracking-wider">
              <Brush size={15} /> Sanitation Crew Cleaning...
            </div>

            {/* Cleaners Animation SVG */}
            <div className="relative my-4 w-48 h-36 flex items-center justify-around">
              {/* Cleaner 1: Sweeping Floor */}
              <div className="relative flex flex-col items-center">
                {/* Head */}
                <div className="w-7 h-7 rounded-full bg-cyan-200 border border-cyan-400" />
                {/* Body */}
                <div className="w-10 h-8 bg-amber-500/80 rounded-t-lg mt-0.5" />
                {/* Animated Broom */}
                <motion.div
                  animate={{ rotate: [-15, 15, -15] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-0 -right-2 origin-top"
                >
                  <div className="w-1 h-14 bg-amber-800" />
                  <div className="w-4 h-4 bg-yellow-400 rounded-b -ml-1.5 flex justify-around">
                    <Sparkles size={10} className="text-yellow-100 animate-spin" />
                  </div>
                </motion.div>

                {/* Swept Sparkles */}
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute bottom-0 -right-5 text-yellow-300"
                >
                  <Sparkles size={14} />
                </motion.div>
              </div>

              {/* Cleaner 2: Wiping Glass Screen */}
              <div className="relative flex flex-col items-center">
                {/* Screen being wiped */}
                <div className="absolute top-1 w-20 h-24 border border-cyan-400/40 rounded bg-cyan-950/20 backdrop-blur-sm flex items-center justify-center">
                  <motion.div
                    animate={{ opacity: [0.2, 0.9, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-cyan-400 text-[10px] font-heading"
                  >
                    SHINING...
                  </motion.div>
                </div>

                {/* Head */}
                <div className="z-10 w-7 h-7 rounded-full bg-emerald-200 border border-emerald-400 mt-2" />
                {/* Body */}
                <div className="z-10 w-10 h-8 bg-emerald-600/80 rounded-t-lg mt-0.5" />

                {/* Animated Squeegee hand */}
                <motion.div
                  animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="z-20 absolute top-4 right-1"
                >
                  <div className="w-6 h-3 bg-cyan-400 rounded border border-white shadow-sm flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-white" />
                  </div>
                </motion.div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-body text-center">
              Polishing UI components & sweeping away cache dust.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
