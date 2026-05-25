"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getWhatsAppUrl, getWhatsAppApiUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone: string | null | undefined;
  daysRemaining: number;
  className?: string;
}

export function WhatsAppButton({ phone, daysRemaining, className }: WhatsAppButtonProps) {
  const { locale, t } = useLanguage();
  const href = getWhatsAppUrl(phone, daysRemaining, locale) || getWhatsAppApiUrl(phone, daysRemaining, locale);

  if (!href) {
    return (
      <p className="text-xs text-center text-muted-foreground py-2 rounded-lg bg-muted/50">
        {t("whatsappNoPhone")}
      </p>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98]"
      }
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      {t("whatsapp")}
    </a>
  );
}
