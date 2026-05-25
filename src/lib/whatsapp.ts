export function formatPhoneForWhatsApp(phone: string | null | undefined): string | null {
  if (!phone || !String(phone).trim()) return null;
  let digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("00212")) digits = digits.slice(2);
  if (digits.startsWith("212") && digits.length >= 12) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return "212" + digits.slice(1);
  if (digits.length === 9) return "212" + digits;
  if (digits.length === 10 && digits.startsWith("6")) return "212" + digits;
  if (digits.length >= 11) return digits.startsWith("212") ? digits : "212" + digits;
  return null;
}

import type { Locale } from "@/lib/i18n/types";
import { translate } from "@/lib/i18n/translate";

export function getWhatsAppMessage(daysRemaining: number, locale: Locale = "ar"): string {
  if (daysRemaining < 0) return translate(locale, "whatsappMsgExpired");
  return translate(locale, "whatsappMsgReminder", { days: daysRemaining });
}

export function getWhatsAppUrl(
  phone: string | null | undefined,
  daysRemaining: number,
  locale: Locale = "ar"
): string | null {
  const formatted = formatPhoneForWhatsApp(phone);
  if (!formatted) return null;
  const text = encodeURIComponent(getWhatsAppMessage(daysRemaining, locale));
  return `https://wa.me/${formatted}?text=${text}`;
}

export function getWhatsAppApiUrl(
  phone: string | null | undefined,
  daysRemaining: number,
  locale: Locale = "ar"
): string | null {
  const formatted = formatPhoneForWhatsApp(phone);
  if (!formatted) return null;
  const text = encodeURIComponent(getWhatsAppMessage(daysRemaining, locale));
  return `https://api.whatsapp.com/send?phone=${formatted}&text=${text}`;
}
