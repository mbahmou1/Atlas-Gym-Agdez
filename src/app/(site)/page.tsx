import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Dumbbell, HeartPulse, MapPin, ShoppingBag, Star, Users } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { MotionSection } from "@/components/site/motion-section";
import { GlassCard } from "@/components/site/glass-card";
import { SectionTitle } from "@/components/site/section-title";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { HOME_FEATURE_IMAGES, MEMBERSHIP_PLANS, SITE } from "@/lib/site-config";
import { formatCurrency } from "@/lib/utils";

const QUICK_LINKS = [
  {
    href: "/gym",
    label: "القاعة",
    desc: "معدات، اشتراك، مدربون",
    icon: Dumbbell,
  },
  {
    href: "/shop",
    label: "المكملات",
    desc: "متجر للجميع — دفع عند التسليم و واتساب",
    icon: ShoppingBag,
  },
  {
    href: "/contact",
    label: "اتصل بنا",
    desc: "العنوان، الخريطة، ساعات العمل",
    icon: MapPin,
  },
];

const COACH = {
  name: "نصير عباسي",
  role: "مدرب القاعة — كمال الأجسام واللياقة",
};

const HOME_TESTIMONIALS = [
  { name: "مروان المرابط", text: "أحسن قاعة ف أكدز — معدات نظيفة و أجواء مزيانة." },
  { name: "محمد اباحمو", text: "المدرب ساعدني نوصل للهدف ف 3 شهور." },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <MotionSection className="px-4 md:px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-center text-muted-foreground max-w-xl mx-auto">
            مرحبا بك ف {SITE.brandLine}. اختر القسم المناسب:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {QUICK_LINKS.map(({ href, label, desc, icon: Icon }) => (
              <Link key={href} href={href}>
                <GlassCard className="h-full transition-colors hover:border-primary/25 hover:shadow-[0_0_0_1px_rgba(196,160,82,0.2)]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold">{label}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface/80 px-4 md:px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            title="أسعار الاشتراك"
            subtitle="اختر العرض المناسب وابدأ التدريب معنا اليوم."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEMBERSHIP_PLANS.map((plan) => (
              <GlassCard
                key={plan.id}
                className={
                  plan.popular
                    ? "relative border-primary ring-2 ring-primary/30"
                    : "relative"
                }
              >
                {plan.popular && (
                  <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
                    الأكثر طلباً
                  </span>
                )}
                <h3 className="text-xl font-black">{plan.nameAr}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.period}</p>
                <p className="mt-4 text-3xl font-black text-primary">
                  {formatCurrency(plan.price)}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  دخول للقاعة، استعمال المعدات، ومتابعة داخلية حسب الهدف.
                </p>
                <WhatsAppCta
                  intent="membership"
                  data={{ plan: `${plan.nameAr} — ${plan.price} درهم` }}
                  label="اشترك عبر واتساب"
                  className="mt-5 w-full"
                />
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 md:px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <GlassCard className="relative overflow-hidden border-primary/30 p-0">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/15 via-transparent to-transparent" />
            <div className="relative grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-8">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-black text-primary-foreground">
                  <CalendarDays className="h-4 w-4" />
                  قريباً
                </span>
                <div>
                  <h2 className="text-2xl font-black leading-tight md:text-4xl">
                    أوقات خاصة للنساء المهتمات برياضة الفتنس
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    نحضر لإطلاق حصص فتنس منظمة في أوقات خاصة للنساء، مع مدربة شخصية
                    لمتابعة التمارين، تحسين اللياقة، وشد الجسم بطريقة آمنة واحترافية.
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <span className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    برنامج مناسب للمبتدئات
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    إشراف مدربة شخصية
                  </span>
                </div>
                <WhatsAppCta
                  intent="contact"
                  label="سجلي اهتمامك عبر واتساب"
                  className="w-full sm:w-auto"
                />
              </div>
              <div className="relative h-72 overflow-hidden rounded-2xl border border-primary/20">
                <Image
                  src={HOME_FEATURE_IMAGES.womenFitness}
                  alt="أوقات خاصة للنساء في الفتنس"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17120d]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 rounded-xl border border-primary/25 bg-[#17120d]/70 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/10 backdrop-blur">
                  فتنس نسائي قريباً
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </MotionSection>

      <MotionSection className="px-4 md:px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            title="التدريب الشخصي"
            subtitle="متابعة شهرية مع المدرب الشخصي وبرنامج مناسب لهدفك."
          />
          <GlassCard className="grid gap-6 border-primary/20 md:grid-cols-2 md:items-center">
            <div className="relative h-64 overflow-hidden rounded-2xl border border-primary/15">
              <Image
                src={HOME_FEATURE_IMAGES.coaching}
                alt="التدريب الشخصي"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black">خطة واضحة ونتائج قابلة للقياس</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                نوفر متابعة شهرية تشمل تقييم المستوى، برنامج تمرين مناسب، توجيهات غذائية
                مبسطة، وتصحيح طريقة التمرين داخل القاعة للوصول لهدفك بأمان.
              </p>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <span>• بناء العضلات وزيادة القوة</span>
                <span>• إنقاص الوزن وتحسين اللياقة</span>
                <span>• متابعة تقنية التمرين وتجنب الإصابات</span>
              </div>
              <WhatsAppCta
                intent="membership"
                label="احجز تدريب شخصي عبر واتساب"
                className="w-full sm:w-auto"
              />
            </div>
          </GlassCard>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface/80 px-4 md:px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="المدرب" subtitle="إشراف مباشر داخل القاعة." />
          <div className="mx-auto grid max-w-sm gap-6">
            <GlassCard className="space-y-4 border-primary/30 bg-gradient-to-b from-card to-card/50 p-8 text-center shadow-xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">{COACH.name}</h3>
                <p className="mt-1 font-semibold text-primary">{COACH.role}</p>
              </div>
              <div className="border-t border-border/50 pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  متابعة احترافية داخل القاعة، تصحيح الوضعيات، وتوجيه حسب المستوى
                  والهدف: كتلة عضلية، تنحيف، أو لياقة عامة.
                </p>
              </div>
              <WhatsAppCta
                intent="membership"
                label="تواصل مع المدرب عبر واتساب"
                className="w-full"
              />
            </GlassCard>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 md:px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="آراء الأعضاء" subtitle="تجارب حقيقية من داخل القاعة." />
          <div className="grid gap-6 md:grid-cols-2">
            {HOME_TESTIMONIALS.map((testimonial) => (
              <GlassCard key={testimonial.name}>
                <div className="mb-2 flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="mt-3 font-bold">{testimonial.name}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>
    </>
  );
}
