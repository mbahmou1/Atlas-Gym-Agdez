"use client";

import { MessageCircle } from "lucide-react";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp-site";

export function FloatingWhatsApp() {
  return (
    <a
      href={getSiteWhatsAppUrl("contact")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 active:scale-95"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
