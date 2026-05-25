import type { Locale } from "./types";
import { translate } from "./translate";

export function getDaysBadge(locale: Locale, daysRemaining: number): string {
  const n = Math.abs(daysRemaining);
  return translate(locale, "daysBadge", { n });
}

export function getCountdownLabel(
  locale: Locale,
  daysRemaining: number,
  totalDays: number,
  daysElapsed: number
): string {
  if (daysRemaining < 0) {
    return translate(locale, "countdownExpired", {
      elapsed: daysElapsed,
      total: totalDays,
    });
  }
  return translate(locale, "countdownActive", {
    elapsed: daysElapsed,
    total: totalDays,
    remaining: daysRemaining,
  });
}

export function getDayUnit(locale: Locale, count: number): string {
  const n = Math.abs(count);
  if (locale === "ar") return n === 1 ? translate(locale, "day") : translate(locale, "days");
  return n === 1 ? translate(locale, "day") : translate(locale, "days");
}
