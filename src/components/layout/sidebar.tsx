"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Wallet, LogOut, X, AlertCircle, Package, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useLanguage } from "@/components/language-provider";
import type { MessageKey } from "@/lib/i18n/translate";

const navItems: { href: string; labelKey: MessageKey; icon: typeof LayoutDashboard }[] = [
  { href: "/dashboard", labelKey: "navDashboard", icon: LayoutDashboard },
  { href: "/members", labelKey: "navMembers", icon: Users },
  { href: "/subscriptions", labelKey: "navSubscriptions", icon: CreditCard },
  { href: "/payments", labelKey: "navPayments", icon: Wallet },
  { href: "/late-payments", labelKey: "navLatePayments", icon: AlertCircle },
  { href: "/products", labelKey: "navProducts", icon: Package },
  { href: "/orders", labelKey: "navOrders", icon: ShoppingBag },
];

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <div className="flex h-28 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center min-w-0">
            <BrandLogo size="md" />
          </Link>
          <button className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ href, labelKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(labelKey)}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } catch {
                /* proceed */
              }
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" />
            {t("navLogout")}
          </Button>
        </div>
      </aside>
    </>
  );
}
