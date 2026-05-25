import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SITE } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="relative bg-surface">
      <div className="brand-bar w-full" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div className="space-y-4">
          <BrandLogo size="lg" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {SITE.name} — قاعة رياضية حديثة ومكملات غذائية أصلية في أكدز.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">روابط</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/gym" className="hover:text-foreground">
                القاعة
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-foreground">
                المكملات
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                اتصل بنا
              </Link>
            </li>
            <li>
              <Link href="/login" className="font-semibold text-primary hover:underline">
                خدمة تسيير القاعات
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">معلومات</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="font-semibold text-foreground">{SITE.gymTitleAr}</li>
            <li className="font-bold text-foreground">{SITE.brandLine}</li>
            <li>{SITE.address}</li>
            <li>
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                الموقع على الخريطة
              </a>
            </li>
            <li dir="ltr">{SITE.phone}</li>
            <li>{SITE.email}</li>
            <li>{SITE.hours.display}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
