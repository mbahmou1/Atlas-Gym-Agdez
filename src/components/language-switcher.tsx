"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={cn("flex items-center gap-1", className)} role="group">
      <Button
        type="button"
        variant={locale === "ar" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-2.5 text-xs font-bold"
        onClick={() => setLocale("ar")}
      >
        عربي
      </Button>
      <Button
        type="button"
        variant={locale === "en" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-2.5 text-xs font-bold"
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
    </div>
  );
}
