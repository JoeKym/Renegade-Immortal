import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { AmbientQiParticles } from "./hero/AmbientQiParticles";

interface PageHeroProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden border-b border-border/70 bg-gradient-to-b from-card/70 via-background/50 to-background py-14 md:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.12),transparent_65%)]" />
      <AmbientQiParticles isHovered={false} sectionRef={sectionRef} clickBurst={0} />
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.h1
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55 }}
          className="mb-4 font-heading text-3xl font-semibold tracking-wide text-primary sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mx-auto max-w-3xl font-body text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg"
        >
          {subtitle}
        </motion.p>
        {children}
      </div>
    </section>
  );
}
