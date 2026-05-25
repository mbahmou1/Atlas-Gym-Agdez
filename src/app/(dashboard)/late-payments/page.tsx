"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { LatePaymentCard } from "@/components/late-payment-card";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LatePaymentsResponse } from "@/lib/types";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";
import { getMonthName } from "@/lib/i18n/messages";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function LatePaymentsPage() {
  const { t, locale } = useLanguage();
  const [data, setData] = useState<LatePaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState(String(currentYear));
  const [status, setStatus] = useState<"all" | "expired" | "expiring">("all");
  const [error, setError] = useState("");

  const monthLabel =
    month === "all"
      ? t("allMonths")
      : getMonthName(locale, Number(month) - 1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams();
      if (month !== "all") q.set("month", month);
      q.set("year", year);
      if (status !== "all") q.set("status", status);
      setData(await apiJson<LatePaymentsResponse>(`/api/late-payments?${q}`));
    } catch (err) {
      setData(null);
      setError(getErrorMessage(err, t("errorLoadLatePayments")));
    } finally {
      setLoading(false);
    }
  }, [month, year, status, t]);

  useEffect(() => {
    load();
  }, [load]);

  const count = data?.items.length ?? 0;

  return (
    <>
      <MobileTopBar />
      <div className="mx-auto w-full max-w-lg lg:max-w-4xl">
        <div className="bg-card px-4 pt-5 pb-4 border-b border-border lg:rounded-none">
          <h1 className="text-xl font-bold text-foreground leading-snug">
            {t("latePaymentsTitle", { month: monthLabel, year })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? t("loading") : t("results", { count })}
          </p>
        </div>

        <div className="p-4 space-y-3 bg-background min-h-[60vh]">
          {error && (
            <ErrorBanner message={error} onDismiss={() => setError("")} />
          )}
          <Select value="all" onValueChange={() => {}}>
            <SelectTrigger className="gym-input w-full h-12 bg-card">
              <SelectValue placeholder={t("allGroups")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allGroups")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="gym-input w-full h-12 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allMonths")}</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {getMonthName(locale, i)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="gym-input w-full h-12 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="gym-input w-full h-12 bg-card">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="expired">{t("expired")}</SelectItem>
              <SelectItem value="expiring">{t("expiringSoon")}</SelectItem>
            </SelectContent>
          </Select>

          {loading ? (
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="gym-card h-36 animate-pulse bg-muted/40" />
              ))}
            </div>
          ) : !data?.items.length ? (
            <EmptyState
              icon={AlertTriangle}
              title={t("noLatePayments")}
              description={t("noLatePaymentsDesc")}
            />
          ) : (
            <div className="space-y-3 pt-1">
              {data.items.map((item) => (
                <LatePaymentCard key={item.member.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
