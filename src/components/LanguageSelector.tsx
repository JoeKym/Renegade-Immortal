import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function LanguageSelector() {
  const { language, setLanguage, currentLanguage, supportedLanguages, isRTL } = useT();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-card/90 backdrop-blur-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
            aria-label="Select language"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Globe size={18} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs">
          {currentLanguage.name}
        </TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-full top-0 mr-2 z-50 min-w-[180px] max-h-[400px] overflow-y-auto rounded-lg bg-popover border border-border shadow-lg flex flex-col"
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
