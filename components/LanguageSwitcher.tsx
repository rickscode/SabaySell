"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'km' ? 'en' : 'km');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="hidden sm:flex items-center gap-1.5 text-sm font-medium"
      title="Switch language / ប្តូរភាសា"
    >
      <Languages className="w-4 h-4" />
      <span className={language === 'km' ? 'font-semibold' : 'text-muted-foreground'}>
        ខ្មែរ
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={language === 'en' ? 'font-semibold' : 'text-muted-foreground'}>
        EN
      </span>
    </Button>
  );
}

// Mobile version - more compact
export function LanguageSwitcherMobile() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'km' ? 'en' : 'km');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="sm:hidden"
      title="Switch language / ប្តូរភាសា"
    >
      <Languages className="w-5 h-5" />
    </Button>
  );
}
