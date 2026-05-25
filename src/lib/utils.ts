import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    const d = date.includes("T") ? parseISO(date) : parseISO(date + "T00:00:00");
    return isValid(d) ? format(d, "MMM d, yyyy") : "—";
  } catch {
    return "—";
  }
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    const d = parseISO(date);
    return isValid(d) ? format(d, "MMM d, yyyy HH:mm") : "—";
  } catch {
    return "—";
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}
