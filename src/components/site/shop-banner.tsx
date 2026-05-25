"use client";

import { Tag, Truck } from "lucide-react";

export function ShopBanner() {
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden py-2.5 relative border-b border-primary/20">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-12 px-6 font-bold tracking-wide text-sm md:text-base">
          <span className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
          <span className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
        </div>
        <div className="flex items-center gap-12 px-6 font-bold tracking-wide text-sm md:text-base" aria-hidden="true">
          <span className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
          <span className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            تخفيضات خيالية في المكملات — التوصيل بالمجان تال باب الدار
          </span>
        </div>
      </div>
    </div>
  );
}
