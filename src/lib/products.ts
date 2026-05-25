import * as store from "@/lib/store";
import type { Product } from "@/lib/types";

export async function getProducts(filters?: {
  search?: string;
  category?: string;
  featured?: boolean;
}): Promise<Product[]> {
  if (store.useLocalDb()) return store.listProducts(filters);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.featured) params.set("featured", "true");
  const res = await fetch(`${base}/api/products?${params}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (store.useLocalDb()) return store.getProductBySlug(slug);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/products?slug=${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}
