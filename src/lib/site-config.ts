export const SITE = {
  name: "أطلس أكدز جيم",
  gymTitleAr: "قاعة كمال الأجسام",
  brandLine: "أطلس أكدز جيم",
  tagline: "قوة. انضباط. نتائج.",
  phone: "0687048566",
  whatsapp: "212687048566",
  email: "contact@atlasgym.agdez",
  address: "أكدز أمام اعدادية النخيل",
  addressShort: "أكدز أمام اعدادية النخيل",
  mapsUrl: "https://maps.app.goo.gl/MRkkzK35maaNhQfd8?g_st=iw",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10945!2d-6.437!3d30.694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQxJzM4LjQiTiA2wrAyNicxMy4yIlc!5e0!3m2!1sar!2sma!4v1",
  hours: {
    label: "من الاثنين إلى الأحد",
    time: "09:00 – 00:00",
    display: "من الاثنين إلى الأحد: 09:00 – 00:00",
  },
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
} as const;

export const MEMBERSHIP_PLANS = [
  { id: "monthly", nameAr: "شهر واحد", price: 100, period: "1 شهر", popular: false },
  { id: "three-months", nameAr: "3 أشهر", price: 250, period: "3 أشهر", popular: true },
  { id: "six-months", nameAr: "6 أشهر", price: 500, period: "6 أشهر", popular: false },
  { id: "yearly", nameAr: "سنوي", price: 900, period: "12 شهر", popular: false },
] as const;

/** صور قاعة — رجال، معدات، أجواء احترافية */
export const GYM_IMAGES = [
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=85",
  "https://images.unsplash.com/photo-1540497077202-7bf8a2694f90?w=900&q=85",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2ee61f?w=900&q=85",
  "https://images.unsplash.com/photo-1534438327276-e14cbf17dda3?w=900&q=85&auto=format",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85",
] as const;

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=90";

export const HOME_FEATURE_IMAGES = {
  about: GYM_IMAGES[3],
  coaching: GYM_IMAGES[0],
  equipment: GYM_IMAGES[2],
  supplements: "https://images.unsplash.com/photo-1593095948074-1c55f10a3526?w=900&q=85",
  womenFitness:
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&q=85&auto=format&fit=crop",
} as const;
