"use client";

import { useLanguage } from "@/components/language-provider";
import { getCountdownLabel, getDayUnit } from "@/lib/i18n/subscription-labels";
import { cn } from "@/lib/utils";

interface SubscriptionCountdownProps {
  daysRemaining: number;
  totalDays: number;
  daysElapsed: number;
  progress: number;
  className?: string;
}

export function SubscriptionCountdown({
  daysRemaining,
  totalDays,
  daysElapsed,
  progress,
  className,
}: SubscriptionCountdownProps) {
  const { locale } = useLanguage();
  const isExpired = daysRemaining < 0;
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 10;
  const planLabel =
    totalDays >= 330
      ? "باقة عام"
      : totalDays >= 170
        ? "باقة 6 أشهر"
        : totalDays >= 80
          ? "باقة 3 أشهر"
          : "باقة شهر";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">
          {planLabel} · {getCountdownLabel(locale, daysRemaining, totalDays, daysElapsed)}
        </span>
        <span
          className={cn(
            "font-bold",
            isExpired ? "text-red-600" : isUrgent ? "text-orange-600" : "text-primary"
          )}
        >
          {isExpired ? `${Math.abs(daysRemaining)}+` : daysRemaining}{" "}
          {getDayUnit(locale, daysRemaining)}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isExpired ? "bg-red-500" : isUrgent ? "bg-orange-500" : "bg-primary"
          )}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
