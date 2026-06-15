import type { Metadata } from "next";
import { ShopClient } from "@/components/site/shop-client";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "متجر المكملات",
  description: "مكملات للرجال و للنساء — بروتين، كرياتين، وفيتامينات — LOUIYNE GYM.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
}
