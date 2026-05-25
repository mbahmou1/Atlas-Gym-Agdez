"use client";

import { MessageCircle } from "lucide-react";
import { getSiteWhatsAppUrl, type WhatsAppIntent } from "@/lib/whatsapp-site";
import { cn } from "@/lib/utils";

export function WhatsAppCta({
  intent,
  data,
  label = "واتساب",
  className,
  variant = "primary",
}: {
  intent: WhatsAppIntent;
  data?: Record<string, string | number>;
  label?: string;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const href = getSiteWhatsAppUrl(intent, data);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform active:scale-[0.98]",
        variant === "primary"
          ? "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20"
          : "border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10",
        className
      )}
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      {label}
    </a>
  );
}
