/** صور مناسبة لكل منتج حسب الاسم والنوع */
export const PRODUCT_IMAGES: Record<string, string> = {
  "whey-protein-gold":
    "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=900&q=85&auto=format&fit=crop",
  "creatine-monohydrate":
    "https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?w=900&q=85&auto=format&fit=crop",
  "pre-workout-ignite":
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3aee?w=900&q=85&auto=format&fit=crop",
  "mass-gainer-pro":
    "https://images.unsplash.com/photo-1622484217878-0089d322b4f7?w=900&q=85&auto=format&fit=crop",
  "multivitamin-elite":
    "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=900&q=85&auto=format&fit=crop",
  "bcaa-recovery":
    "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=900&q=85&auto=format&fit=crop",
  "shaker-bottle-pro":
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=900&q=85&auto=format&fit=crop",
};

export function getProductImage(slug: string): string | undefined {
  return PRODUCT_IMAGES[slug];
}
