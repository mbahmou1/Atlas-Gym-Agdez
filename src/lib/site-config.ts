export const SITE = {
  name: "LOUIYNE GYM",
  gymTitleAr: "قاعة كمال الأجسام",
  brandLine: "LOUIYNE GYM",
  tagline: "قوة. انضباط. نتائج.",
  phone: "0687048566",
  whatsapp: "212687048566",
  email: "contact@atlasgym.agdez",
  address: "أكدز أمام اعدادية النخيل",
  addressShort: "أكدز أمام اعدادية النخيل",
  /** إحداثيات القاعة — للتوجيه الديناميكي من موقع الزائر */
  coords: { lat: 30.694, lng: -6.437 },
  /** موقع القاعة على Google Maps (الوجهة الثابتة للتوجيه) */
  mapsUrl: "https://maps.app.goo.gl/th86DbAAqRRr5Hxm7",
  /** إحداثيات القاعة — أكدز (لحساب المسافة والتوجيه) */
  latitude: 30.694,
  longitude: -6.437,
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

/** صور القاعة — LOUIYNE GYM (صور حقيقية) */
export const GYM_IMAGES = [
  "/images/gym/gym-interior-1.png",
  "/images/gym/gym-interior-2.png",
  "/images/gym/gym-flyer.png",
  "/images/gym/hero-banner.png",
] as const;

export const HERO_IMAGE = "/images/gym/hero-banner.png";

export const HOME_FEATURE_IMAGES = {
  about: GYM_IMAGES[0],
  coaching: GYM_IMAGES[0],
  equipment: GYM_IMAGES[1],
  supplements: "https://images.unsplash.com/photo-1593095948074-1c55f10a3526?w=900&q=85",
  womenFitness:
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&q=85&auto=format&fit=crop",
} as const;
