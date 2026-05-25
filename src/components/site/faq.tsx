"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/site/glass-card";

const FAQ_ITEMS = [
  {
    q: "ما هي ساعات العمل؟",
    a: "من الاثنين إلى الأحد، من 09:00 إلى 00:00.",
  },
  {
    q: "واش المكملات أصلية؟",
    a: "نعم، كنختارو ماركات موثوقة و كنوضحو المكونات على كل منتج.",
  },
  {
    q: "كيفاش نطلب من المتجر؟",
    a: "زيد المنتجات للسلة، عمر المعلومات ف صفحة الدفع، و أكد الطلبية عبر واتساب أو الدفع عند التسليم.",
  },
  {
    q: "شنو طرق الدفع؟",
    a: "الاشتراك ف القاعة: نقداً أو تحويل. المتجر: الدفع عند التسليم ف أكدز والمناطق القريبة.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <GlassCard key={item.q} className="overflow-hidden p-0">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 p-5 text-start font-bold"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-primary transition-transform",
                open === i && "rotate-180"
              )}
            />
          </button>
          {open === i && (
            <p className="border-t border-border px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {item.a}
            </p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
