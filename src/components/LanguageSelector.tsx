import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";

export function LanguageSelector() {
  const { language, setLanguage, currentLanguage, supportedLanguages, isRTL } = useT();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors text-xs font-medium"
        aria-label="Select language"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Globe size={14} className="text-muted-foreground" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="uppercase">{language}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 z-50 min-w-[160px] max-h-[300px] overflow-y-auto rounded-lg bg-popover border border-border shadow-lg"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="p-1">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      language === lang.code
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {language === lang.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
