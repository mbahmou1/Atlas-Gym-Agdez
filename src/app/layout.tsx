import type { Metadata } from "next";
import Script from "next/script";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { CartProvider } from "@/components/cart-provider";
import { SITE } from "@/lib/site-config";

const fontBody = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const fontHeading = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | قاعة و مكملات`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "أطلس أكدز جيم — قاعة كمال أجسام و متجر مكملات ف أكدز. اشتراك، تدريب، بروتين، كرياتين، و المزيد.",
  keywords: ["جيم", "أكدز", "مكملات", "لياقة", "المغرب", "أطلس أكدز"],
  openGraph: {
    title: SITE.name,
    description: "قاعة و مكملات ف أكدز",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <Script id="force-dark-mode" strategy="beforeInteractive">
        {`try{document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");localStorage.setItem("atlasgym-theme","dark");}catch(e){}`}
      </Script>
      <body
        className={`${fontBody.variable} ${fontHeading.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
        style={{ backgroundColor: "#12100d", color: "#f7f0e5" }}
      >
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
