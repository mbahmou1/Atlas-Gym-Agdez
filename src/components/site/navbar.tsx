"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Menu, ShoppingCart, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "الرئيسية", match: (p: string) => p === "/" },
  { href: "/gym", label: "القاعة", match: (p: string) => p === "/gym" },
  { href: "/shop", label: "المكملات", match: (p: string) => p.startsWith("/shop") },
  { href: "/contact", label: "اتصل بنا", match: (p: string) => p === "/contact" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 md:h-24 md:px-6">
        <Link href="/" className="flex min-w-0 max-w-[58%] items-center gap-2 sm:max-w-none sm:gap-3">
          <BrandLogo size="xs" className="sm:hidden" />
          <BrandLogo size="sm" className="hidden sm:block" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[11px] font-black uppercase tracking-wide text-primary sm:text-lg sm:tracking-wider">
              Atlas Agdez Gym
            </span>
            <span className="block truncate text-[10px] font-bold text-foreground sm:text-sm">
              قاعة كمال الأجسام
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, match }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium text-foreground/90 transition-colors",
                match(pathname)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop/checkout"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/login" className="hidden sm:block">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
            >
              <LayoutDashboard className="h-4 w-4" />
              تسيير القاعات
            </Button>
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border px-4 py-4 md:hidden">
          {links.map(({ href, label, match }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted",
                match(pathname) && "bg-primary/15 text-primary font-bold"
              )}
            >
              {label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="mt-2 block">
            <Button variant="outline" className="w-full gap-2 border-primary/40 text-primary">
              <LayoutDashboard className="h-4 w-4" />
              تسيير القاعات
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
