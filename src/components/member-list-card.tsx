"use client";

import { MoreVertical } from "lucide-react";
import { MemberAvatar } from "@/components/member-avatar";
import { SubscriptionCountdown } from "@/components/subscription-countdown";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useLanguage } from "@/components/language-provider";
import { getDaysRemaining, getSubscriptionProgress } from "@/lib/subscription-status";
import type { Member } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MemberListCardProps {
  member: Member;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MemberListCard({ member, onEdit, onDelete }: MemberListCardProps) {
  const { t } = useLanguage();
  const isActive = member.status === "active";
  const daysRemaining = member.subscription_end ? getDaysRemaining(member.subscription_end) : 0;
  const progress = getSubscriptionProgress(member.subscription_start, member.subscription_end);

  return (
    <div className="gym-card p-4">
      <div className="flex gap-3">
        <MemberAvatar name={member.name} photoUrl={member.photo_url} size="lg" square />
        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[15px] truncate">{member.name}</h3>
              {member.phone && (
                <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">
                  {member.phone}
                </p>
              )}
            </div>
            <button
              type="button"
              className="p-1 text-muted-foreground shrink-0"
              onClick={onEdit}
              aria-label={t("modify")}
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {progress && (
            <SubscriptionCountdown
              daysRemaining={progress.daysRemaining}
              totalDays={progress.totalDays}
              daysElapsed={progress.daysElapsed}
              progress={progress.progress}
            />
          )}

          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-orange-50 text-orange-700"
              )}
            >
              {isActive ? t("active") : t("expired")}
            </span>
          </div>

          <WhatsAppButton
            phone={member.phone}
            daysRemaining={daysRemaining}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white"
          />

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs text-red-500 font-medium text-center"
            >
              {t("delete")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
