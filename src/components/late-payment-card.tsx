"use client";

import { MemberAvatar } from "@/components/member-avatar";
import { SubscriptionCountdown } from "@/components/subscription-countdown";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";
import { getDaysBadge } from "@/lib/i18n/subscription-labels";
import { formatExpirationDate } from "@/lib/subscription-status";
import type { LatePaymentItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LatePaymentCardProps {
  item: LatePaymentItem;
}

export function LatePaymentCard({ item }: LatePaymentCardProps) {
  const { locale, t } = useLanguage();
  const { member, urgency, days_remaining, end_date, subscription_start } = item;
  const isExpired = urgency === "expired";
  const totalDays = item.total_days ?? 30;
  const daysElapsed = item.days_elapsed ?? 0;
  const progress = item.subscription_progress ?? 0;

  return (
    <article
      className={cn(
        "gym-card overflow-hidden p-4",
        isExpired && "border-s-[5px] border-s-red-500",
        urgency === "warning" && "border-s-[5px] border-s-orange-400",
        urgency === "active" && days_remaining <= 30 && "border-s-[5px] border-s-blue-400"
      )}
    >
      <div className="flex gap-3">
        <MemberAvatar name={member.name} photoUrl={member.photo_url} size="lg" square />
        <div className="min-w-0 flex-1 flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[16px] text-foreground leading-tight">{member.name}</h3>
            <span
              className={cn(
                "shrink-0 rounded-lg px-2 py-1 text-xs font-bold",
                isExpired
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : days_remaining <= 5
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
              )}
            >
              {getDaysBadge(locale, days_remaining)}
            </span>
          </div>
          {subscription_start && (
            <SubscriptionCountdown
              daysRemaining={days_remaining}
              totalDays={totalDays}
              daysElapsed={daysElapsed}
              progress={progress}
            />
          )}
          {member.phone ? (
            <p className="text-sm font-medium text-foreground" dir="ltr">
              {member.phone}
            </p>
          ) : (
            <p className="text-xs text-amber-600">{t("noPhoneWarning")}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {t("monthEnd")}{" "}
            <span className="font-semibold">{formatExpirationDate(end_date)}</span>
          </p>
          <WhatsAppButton phone={member.phone} daysRemaining={days_remaining} />
        </div>
      </div>
    </article>
  );
}
