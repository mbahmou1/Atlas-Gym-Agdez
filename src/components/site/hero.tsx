"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { LocationBlock } from "@/components/site/location-block";
import { HERO_IMAGE, SITE } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-8">
        <div className="relative aspect-[1097/368] w-full overflow-hidden rounded-2xl border border-primary/20 shadow-[0_8px_40px_rgba(196,160,82,0.12)]">
          <Image
            src={HERO_IMAGE}
            alt={SITE.brandLine}
            fill
            priority
            className="object-contain bg-[#0a1628]"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-10 text-center md:px-6 md:py-14">
        <div className="space-y-6 w-full">
          <LocationBlock variant="hero" />

          <h1 className="font-display max-w-3xl mx-auto text-4xl font-extrabold leading-tight md:text-5xl">
            <span className="text-gradient-brand">حوّل جسمك.</span>
            <br />
            <span className="text-foreground">ادفع حدودك.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            {SITE.tagline} — قاعة مجهزة و متجر مكملات أصلية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <WhatsAppCta
              intent="membership"
              label="انضم للقاعة"
              className="h-12 px-8 text-base"
            />
            <Link href="/shop">
              <Button
                size="lg"
                className="group h-14 border-0 bg-gradient-to-r from-amber-300 via-primary to-yellow-500 px-7 text-base font-black text-black shadow-[0_0_35px_rgba(196,160,82,0.45)] transition-all hover:scale-[1.03] hover:brightness-110"
              >
                <Sparkles className="h-5 w-5" />
                ادخل لمتجر المكملات
                <ShoppingBag className="h-5 w-5" />
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
