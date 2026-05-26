"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/site/glass-card";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <GlassCard className="group flex h-full flex-col overflow-hidden p-0">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17120d]/85 via-transparent to-transparent" />
        <div className="absolute start-3 top-3 flex gap-2">
          {product.featured && <Badge className="bg-primary text-primary-foreground">مميز</Badge>}
          {product.best_seller && (
            <Badge variant="secondary" className="bg-white/10 text-white">
              الأكثر مبيعاً
            </Badge>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-bold leading-tight transition-colors hover:text-primary">{product.name}</h3>
        </Link>
        {product.rating && (
          <div className="flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} تقييم)</span>
          </div>
        )}
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
          <Button
            size="sm"
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
              })
            }
          >
            <ShoppingCart className="h-4 w-4" />
            أضف
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
