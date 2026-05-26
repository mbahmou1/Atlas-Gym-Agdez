import { SiteNavbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/footer";
import { ShopBanner } from "@/components/site/shop-banner";
import { FloatingLocation } from "@/components/site/floating-location";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ShopBanner />
      <SiteNavbar />
      <main className="flex-1 pb-24">{children}</main>
      <SiteFooter />
      <FloatingLocation />
    </div>
  );
}
