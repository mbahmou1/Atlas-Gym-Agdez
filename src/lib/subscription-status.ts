import { differenceInDays, parseISO, startOfDay } from "date-fns";

export type PaymentUrgency = "expired" | "warning" | "active";

function parseDate(date: string) {
  return startOfDay(parseISO(date.includes("T") ? date : `${date}T00:00:00`));
}

export function getDaysRemaining(endDate: string): number {
  return differenceInDays(parseDate(endDate), startOfDay(new Date()));
}

export function getSubscriptionProgress(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return null;
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const today = startOfDay(new Date());
  const totalDays = Math.max(1, differenceInDays(end, start) + 1);
  const daysRemaining = differenceInDays(end, today);
  const daysElapsed = Math.max(0, differenceInDays(today, start));
  const progress = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));
  return { totalDays, daysRemaining, daysElapsed, progress };
}

export function getPaymentUrgency(daysRemaining: number): PaymentUrgency {
  if (daysRemaining < 0) return "expired";
  if (daysRemaining <= 10) return "warning";
  return "active";
}

/** Show on late-payments list: last 10 days of subscription or expired */
export function shouldShowOnLatePayments(daysRemaining: number): boolean {
  return daysRemaining <= 10;
}

export function getStatusLabel(daysRemaining: number): string {
  if (daysRemaining < 0) {
    const days = Math.abs(daysRemaining);
    return days === 1 ? "منتهي من يوم" : `منتهي من ${days} أيام`;
  }
  if (daysRemaining === 0) return "ينتهي اليوم";
  return daysRemaining === 1 ? "باقي يوم واحد" : `باقي ${daysRemaining} أيام`;
}

export function getDaysBadge(daysRemaining: number): string {
  const n = Math.abs(daysRemaining);
  return `${n} Jour${n > 1 ? "s" : ""}`;
}

export function getDaysLabelAr(daysRemaining: number): string {
  const n = Math.abs(daysRemaining);
  if (daysRemaining < 0) {
    return n === 1 ? "منتهي من يوم" : `منتهي من ${n} أيام`;
  }
  if (daysRemaining === 0) return "ينتهي اليوم";
  return n === 1 ? "باقي يوم واحد" : `باقي ${n} أيام`;
}

/** تنازلي يومي حسب مدة الاشتراك: شهر، 3 أشهر، 6 أشهر، أو عام */
export function getCountdownLabelAr(
  daysRemaining: number,
  totalDays: number,
  daysElapsed: number
): string {
  if (daysRemaining < 0) {
    return `منتهي — مر ${daysElapsed}/${totalDays} يوم`;
  }
  return `تنازلي: ${daysElapsed}/${totalDays} يوم — باقي ${daysRemaining}`;
}

export function formatExpirationDate(endDate: string): string {
  const d = parseISO(endDate.includes("T") ? endDate : `${endDate}T00:00:00`);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function matchesMonthYear(endDate: string, month?: number, year?: number): boolean {
  const d = parseISO(endDate.includes("T") ? endDate : `${endDate}T00:00:00`);
  if (year !== undefined && d.getFullYear() !== year) return false;
  if (month !== undefined && d.getMonth() + 1 !== month) return false;
  return true;
}
