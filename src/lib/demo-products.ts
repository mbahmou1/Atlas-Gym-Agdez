import { randomUUID } from "crypto";
import type { Product } from "./types";
import { PRODUCT_IMAGES } from "./product-images";

const now = new Date().toISOString();

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
    id: randomUUID(),
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
