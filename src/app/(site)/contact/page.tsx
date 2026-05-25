import type { Metadata } from "next";
import { Clock, Phone } from "lucide-react";
import { MotionSection } from "@/components/site/motion-section";
import { SectionTitle } from "@/components/site/section-title";
import { GlassCard } from "@/components/site/glass-card";
import { LocationBlock } from "@/components/site/location-block";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { FaqSection } from "@/components/site/faq";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: `${SITE.address} — ${SITE.phone}`,
};

export default function ContactPage() {
  return (
    <div className="pt-8 pb-20">
      <MotionSection className="px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <SectionTitle title="اتصل بنا" subtitle="العنوان، الهاتف، و الخريطة." />
          <GlassCard className="space-y-5 border-primary/20">
            <LocationBlock variant="card" className="border-0 bg-transparent p-0 w-full" />
            <p className="flex items-center gap-3" dir="ltr">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              {SITE.phone}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              {SITE.hours.display}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <WhatsAppCta intent="contact" label="تواصل عبر واتساب" variant="primary" className="w-full sm:w-auto" />
            </div>
          </GlassCard>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface/80 px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <SectionTitle eyebrow="FAQ" title="أسئلة شائعة" />
          <FaqSection />
        </div>
      </MotionSection>
    </div>
  );
}
