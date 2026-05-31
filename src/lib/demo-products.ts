import type { Product } from "./types";
import { PRODUCT_IMAGES } from "./product-images";

const now = new Date().toISOString();

/** معرفات ثابتة — ضرورية على Vercel (بلا ملف data/atlasgym.json) */
const PRODUCT_IDS: Record<string, string> = {
  "whey-protein-gold": "b4d34222-9314-41a8-922e-62104baa7783",
  "creatine-monohydrate": "8127b4f0-cffe-4c6c-803a-58fee468ac3f",
  "multivitamin-elite": "6a0efc23-8e42-44eb-9493-8ab4c403815a",
  "bcaa-recovery": "ff73d129-9532-4a9d-a8c3-ede7f0bb45dc",
  "shaker-bottle-pro": "25fde0c2-db74-4966-bab4-abef2b5b84c4",
};

function product(
  name: string,
  slug: string,
  description: string,
  price: number,
  category: Product["category"],
  featured: boolean,
  best_seller: boolean,
  rating: number,
  reviews: number
): Product {
  return {
    id: PRODUCT_IDS[slug] ?? slug,
    name,
    slug,
    description,
    price,
    image_url: PRODUCT_IMAGES[slug] ?? "",
    category,
    featured,
    best_seller,
    stock: 50,
    rating,
    reviews,
    created_at: now,
  };
}

export function getDemoProducts(): Product[] {
  return [
    product(
      "Whey Protein Gold",
      "whey-protein-gold",
      "بروتين مصل اللبن — 24g بروتين للحصة. مثالي لبناء العضلات والتعافي بعد التمرين.",
      450,
      "protein",
      true,
      true,
      4.9,
      128
    ),
    product(
      "Creatine Monohydrate",
      "creatine-monohydrate",
      "كرياتين نقي — قوة أكبر، تكرارات أكثر، و حجم عضلي مع الوقت.",
      180,
      "creatine",
      true,
      true,
      5.0,
      85
    ),
    product(
      "Multivitamin Elite",
      "multivitamin-elite",
      "فيتامينات و معادن يومية — دعم صحة ولياقة كاملة.",
      150,
      "vitamins",
      false,
      false,
      4.9,
      73
    ),
    product(
      "BCAA Recovery",
      "bcaa-recovery",
      "أحماض أمينية — تعافي أسرع و أقل تعب بين المجموعات.",
      240,
      "protein",
      false,
      false,
      4.8,
      59
    ),
    product(
      "Shaker Bottle Pro",
      "shaker-bottle-pro",
      "شاكر 700ml عملي — ما كيسربش، سهل التنظيف.",
      60,
      "accessories",
      false,
      false,
      5.0,
      112
    ),
  ];
}
