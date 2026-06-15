"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/site/product-card";
import { SectionTitle } from "@/components/site/section-title";
import { Input } from "@/components/ui/input";
import { SITE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const CATEGORIES: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "protein", label: "بروتين" },
  { id: "creatine", label: "كرياتين" },
  { id: "vitamins", label: "فيتامينات" },
  { id: "accessories", label: "إكسسوارات" },
];

export function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");

  const filtered = useMemo(() => {
    let list = initialProducts;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialProducts, search, category]);

  const featured = initialProducts.filter((p) => p.featured);
  const showFeatured = featured.length > 0 && category === "all" && !search;
  const featuredIds = new Set(featured.map((p) => p.id));
  const catalogProducts = showFeatured
    ? filtered.filter((p) => !featuredIds.has(p.id))
    : filtered;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <SectionTitle
        eyebrow="المتجر"
        title={`مكملات ${SITE.brandLine}`}
        subtitle="مكملات للرجال و للنساء — دفع عند التسليم أو واتساب."
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10 h-12"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              category === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {showFeatured && (
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-bold tracking-wide text-primary">منتجات مميزة</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {catalogProducts.length > 0 && (
        <>
          {showFeatured && (
            <h2 className="mb-4 text-lg font-bold tracking-wide text-foreground">كل المنتجات</h2>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">ما لقينا حتى منتج.</p>
      )}

      <p className="mt-12 text-center text-sm text-muted-foreground border-t border-border pt-8">
        &ldquo;المكملات واصلة بسرعة و الثمن مناسب&rdquo; — وهيبة الفيلالي
      </p>
    </div>
  );
}
