import { formatPhoneForWhatsApp } from "@/lib/whatsapp";
import { SITE } from "@/lib/site-config";

export type WhatsAppIntent =
  | "contact"
  | "order"
  | "membership"
  | "renew"
  | "product"
  | "gym-management-service";

const BRAND = SITE.brandLine;

export function buildWhatsAppMessage(
  intent: WhatsAppIntent,
  data?: Record<string, string | number>
): string {
  switch (intent) {
    case "contact":
      return `السلام عليكم، بغيت نتواصل مع ${BRAND}. شكراً.`;
    case "membership": {
      const plan = data?.plan ? `\nالباقة: ${data.plan}` : "";
      return `السلام عليكم، بغيت نسجل ف ${BRAND} و نعرف تفاصيل الاشتراك.${plan}\nالعنوان: أكدز أمام مؤسسة الخورزمي.\nشكراً.`;
    }
    case "renew":
      return `السلام عليكم، بغيت نجدد الاشتراك ديالي ف ${BRAND}. شكراً.`;
    case "product":
      return `السلام عليكم، بغيت نطلب: ${data?.product ?? "منتج"}. شكراً.`;
    case "gym-management-service":
      return `السلام عليكم، أملك قاعة رياضية وأرغب في خدمة تسيير القاعات (موقع خاص + أعضاء + اشتراكات + الأيام المتبقية لكل عضو).

يرجى إرسال التفاصيل والسعر. شكراً.`;
    case "order": {
      const items = data?.items ?? "";
      const total = data?.total ?? "";
      const name = data?.name ?? "";
      const phone = data?.phone ?? "";
      const address = data?.address ?? "";
      return `السلام عليكم، طلبية مكملات من ${BRAND}:

الاسم: ${name}
الهاتف: ${phone}
العنوان: ${address}

${items}

المجموع: ${total} درهم
الدفع: عند التسليم

شكراً.`;
    }
    default:
      return `السلام عليكم، ${BRAND}.`;
  }
}

export function getSiteWhatsAppUrl(
  intent: WhatsAppIntent,
  data?: Record<string, string | number>,
  phone: string = SITE.whatsapp
): string {
  const formatted = formatPhoneForWhatsApp(phone);
  const target = formatted ?? SITE.whatsapp;
  const text = encodeURIComponent(buildWhatsAppMessage(intent, data));
  return `https://wa.me/${target}?text=${text}`;
}
