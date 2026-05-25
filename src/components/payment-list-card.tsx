"use client";

import { MoreVertical } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { formatCurrency } from "@/lib/utils";
import type { Payment, Member } from "@/lib/types";

interface PaymentListCardProps {
  payment: Payment;
}

function formatShortDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

export function PaymentListCard({ payment }: PaymentListCardProps) {
  const { t } = useLanguage();
  const member = payment.member as Member | undefined;
  const ref = `RCP-${payment.payment_date.replace(/-/g, "")}-${payment.id.slice(0, 5).toUpperCase()}`;

  return (
    <div className="gym-card p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs text-muted-foreground font-medium">{ref}</span>
        <button type="button" className="text-muted-foreground p-1">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 font-bold text-[15px]">{member?.name ?? "—"}</p>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-sm text-muted-foreground">
          <p>{t("monthly")}</p>
          <p className="font-medium text-foreground/80">{formatShortDate(payment.payment_date)}</p>
        </div>
        <p className="text-lg font-bold text-primary">{formatCurrency(payment.amount)}</p>
      </div>
    </div>
  );
}
