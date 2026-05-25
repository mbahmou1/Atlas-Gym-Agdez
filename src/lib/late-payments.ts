import { parseISO } from "date-fns";
import type { Member, Subscription, LatePaymentItem, LatePaymentsResponse, PaymentUrgency } from "./types";
import {
  getDaysRemaining,
  getPaymentUrgency,
  getStatusLabel,
  getSubscriptionProgress,
  shouldShowOnLatePayments,
  matchesMonthYear,
} from "./subscription-status";

export interface LatePaymentsFilters {
  search?: string;
  month?: number;
  year?: number;
  status?: "all" | "expired" | "expiring";
}

function latestSubscriptionByMember(subscriptions: Subscription[]): Map<string, Subscription> {
  const map = new Map<string, Subscription>();
  for (const sub of subscriptions) {
    const existing = map.get(sub.member_id);
    if (!existing || sub.end_date > existing.end_date) map.set(sub.member_id, sub);
  }
  return map;
}

export function buildLatePaymentItems(
  members: Member[],
  subscriptions: Subscription[],
  filters: LatePaymentsFilters
): LatePaymentsResponse {
  const latest = latestSubscriptionByMember(subscriptions);
  const items: LatePaymentItem[] = [];

  for (const member of members) {
    const sub = latest.get(member.id);
    const endDate = sub?.end_date ?? member.subscription_end;
    if (!endDate) continue;

    const startDate = sub?.start_date ?? member.subscription_start;
    const daysRemaining = getDaysRemaining(endDate);
    const urgency = getPaymentUrgency(daysRemaining);

    if (!shouldShowOnLatePayments(daysRemaining)) continue;

    const progress = getSubscriptionProgress(startDate, endDate);

    if (filters.status === "expired" && urgency !== "expired") continue;
    if (filters.status === "expiring" && urgency !== "warning") continue;
    if (filters.month !== undefined && !matchesMonthYear(endDate, filters.month, filters.year)) continue;
    if (filters.month === undefined && filters.year !== undefined) {
      const y = parseISO(endDate.includes("T") ? endDate : `${endDate}T00:00:00`).getFullYear();
      if (y !== filters.year) continue;
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const phone = (member.phone || "").toLowerCase();
      if (!member.name.toLowerCase().includes(q) && !phone.includes(q)) continue;
    }

    items.push({
      member,
      subscription_id: sub?.id ?? null,
      subscription_start: startDate,
      end_date: endDate,
      days_remaining: daysRemaining,
      urgency,
      status_label: getStatusLabel(daysRemaining),
      amount: sub?.amount ?? 300,
      plan_type: sub?.plan_type ?? null,
      total_days: progress?.totalDays ?? null,
      days_elapsed: progress?.daysElapsed ?? null,
      subscription_progress: progress?.progress ?? null,
    });
  }

  items.sort((a, b) => a.days_remaining - b.days_remaining);

  const expiredCount = items.filter((i) => i.urgency === "expired").length;
  const expiringSoonCount = items.filter((i) => i.urgency === "warning").length;
  const revenueLost = items
    .filter((i) => i.urgency === "expired")
    .reduce((s, i) => s + Number(i.amount), 0);

  return {
    items,
    summary: { expiredCount, expiringSoonCount, revenueLost },
  };
}

export function urgencyBorderClass(urgency: PaymentUrgency): string {
  if (urgency === "expired") return "border-l-4 border-l-red-500 shadow-red-500/10";
  if (urgency === "warning") return "border-l-4 border-l-orange-500 shadow-orange-500/10";
  return "border-l-4 border-l-emerald-500";
}

export function urgencyBadgeClass(urgency: PaymentUrgency): string {
  if (urgency === "expired") return "bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/30";
  if (urgency === "warning") return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30";
  return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
}
