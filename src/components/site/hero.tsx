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
    <section className="relative min-h-[92vh] overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt={SITE.brandLine}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center md:px-6">
        <div className="space-y-6 w-full">
          <LocationBlock variant="hero" />

          <h1 className="font-display max-w-3xl mx-auto text-4xl font-extrabold leading-tight md:text-5xl">
            <span className="text-gradient-brand">حوّل جسمك.</span>
            <br />
            <span className="text-white">ادفع حدودك.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/85">
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
