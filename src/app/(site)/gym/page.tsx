import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Dumbbell, MapPin, Phone, Shield, Star, Users, Zap } from "lucide-react";
import { MotionSection } from "@/components/site/motion-section";
import { SectionTitle } from "@/components/site/section-title";
import { GlassCard } from "@/components/site/glass-card";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { GYM_IMAGES, HOME_FEATURE_IMAGES, MEMBERSHIP_PLANS, SITE } from "@/lib/site-config";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "القاعة",
  description: "أطلس أكدز جيم — معدات، اشتراك، مدربون ف أكدز.",
};

const COACHES = [{ name: "نصير عباسي", role: "مدرب القاعة — كمال الأجسام واللياقة" }];

const GYM_TESTIMONIALS = [
  { name: "مروان المرابط", text: "أحسن قاعة ف أكدز — معدات نظيفة و أجواء مزيانة." },
  { name: "محمد اباحمو", text: "المدرب ساعدني نوصل للهدف ف 3 شهور." },
];

export default function GymPage() {
  return (
    <div className="pt-5 md:pt-8">
      <section className="relative mx-auto max-w-6xl px-4 pb-6 md:px-6 md:pb-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-primary/20">
          <Image src={GYM_IMAGES[0]} alt={SITE.brandLine} fill className="object-cover" priority sizes="100vw" />
          <div className="hero-overlay absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-3xl font-black text-white md:text-4xl">{SITE.gymTitleAr}</h1>
            <p className="mt-2 text-lg font-bold text-primary tracking-widest">ATLAS AGDEZ GYM</p>
          </div>
        </div>
      </section>

      <MotionSection className="px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Dumbbell, title: "معدات حديثة", desc: "أوزان و أجهزة احترافية" },
              { icon: Users, title: "مدرب خبير", desc: "نصير عباسي — برامج حسب مستواك" },
              { icon: Shield, title: "بيئة محترمة", desc: "راحة و تركيز" },
              { icon: Zap, title: "تحفيز", desc: "جو إيجابي" },
            ].map(({ icon: Icon, title, desc }) => (
              <GlassCard key={title} className="text-center">
                <Icon className="mx-auto h-6 w-6 text-primary mb-3" />
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface/80 px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="معرض الصور" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {GYM_IMAGES.map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-primary/10">
                <Image src={src} alt={`Gym ${i + 1}`} fill className="object-cover" sizes="300px" />
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="المعدات" />
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-primary/15">
              <Image src={HOME_FEATURE_IMAGES.equipment} alt="معدات" fill className="object-cover" sizes="500px" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["أوزان حرة", "أجهزة القوة", "كارديو", "تدريب وظيفي", "دش و خزائن", "تمدد"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-primary/10 bg-card px-4 py-4 text-center text-sm font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface/80 px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="تدريب شخصي" subtitle="خطط غذائية و برامج تمرين." />
          <GlassCard className="flex flex-col gap-4 md:flex-row md:items-center border-primary/20">
            <div className="relative h-48 flex-1 overflow-hidden rounded-xl md:h-56">
              <Image src={HOME_FEATURE_IMAGES.coaching} alt="تدريب" fill className="object-cover" sizes="400px" />
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                متابعة أسبوعية و برنامج حسب هدفك: تنحيف، كتلة، أو أداء أفضل.
              </p>
              <WhatsAppCta intent="membership" label="احجز استشارة — واتساب" />
            </div>
          </GlassCard>
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="أسعار الاشتراك" />
          <div className="grid gap-6 md:grid-cols-3">
            {MEMBERSHIP_PLANS.map((plan) => (
              <GlassCard key={plan.id} className={plan.popular ? "border-primary ring-2 ring-primary/30" : ""}>
                {plan.popular && (
                  <span className="mb-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    الأكثر شعبية
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.nameAr}</h3>
                <p className="text-sm text-muted-foreground">{plan.period}</p>
                <p className="mt-3 text-3xl font-black text-primary">{formatCurrency(plan.price)}</p>
                <WhatsAppCta
                  intent="membership"
                  data={{ plan: `${plan.nameAr} — ${plan.price} درهم` }}
                  label="اشترك — واتساب"
                  className="mt-5 w-full"
                />
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface/80 px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="المدرب" />
          <div className="mx-auto grid max-w-sm gap-6">
            {COACHES.map((c) => (
              <GlassCard key={c.name} className="text-center p-8 space-y-4 shadow-xl border-primary/30 bg-gradient-to-b from-card to-card/50">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground">{c.name}</h3>
                  <p className="mt-1 font-semibold text-primary">{c.role}</p>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    التدريب الشخصي: متابعة شهرية مع المدرب الشخصي، برامج غذائية وتدريبية مخصصة لتحقيق أهدافك سواء في بناء العضلات أو إنقاص الوزن.
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="آراء الأعضاء" />
          <div className="grid gap-6 md:grid-cols-2">
            {GYM_TESTIMONIALS.map((t) => (
              <GlassCard key={t.name}>
                <div className="mb-2 flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-3 font-bold">{t.name}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 pb-20 pt-8 md:px-6 md:pt-10">
        <div className="mx-auto max-w-6xl">
          <GlassCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-primary/20">
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {SITE.address}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                {SITE.hours.display}
              </p>
              <p className="flex items-center gap-2" dir="ltr">
                <Phone className="h-4 w-4 text-primary" />
                {SITE.phone}
              </p>
            </div>
            <WhatsAppCta intent="membership" label="انضم للقاعة" />
          </GlassCard>
        </div>
      </MotionSection>
    </div>
  );
}
