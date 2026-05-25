"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserCheck, AlertCircle, TrendingUp } from "lucide-react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { StatWidget } from "@/components/ui/stat-widget";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats, LatePaymentsResponse } from "@/lib/types";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lateCount, setLateCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const [statsData, late] = await Promise.all([
          apiJson<DashboardStats>("/api/dashboard/stats"),
          apiJson<LatePaymentsResponse>("/api/late-payments"),
        ]);
        setStats(statsData);
        setLateCount(
          (late.summary?.expiredCount ?? 0) + (late.summary?.expiringSoonCount ?? 0)
        );
      } catch (err) {
        setStats(null);
        setLateCount(0);
        setError(getErrorMessage(err, t("errorLoadDashboard")));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <MobileTopBar />
      <div className="mx-auto w-full max-w-lg lg:max-w-4xl p-4 pb-8 space-y-4">
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("dashboardWelcome")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboardSubtitle")}</p>
        </div>

        <div className="space-y-3">
          <StatWidget
            label={t("statTotalMembers")}
            value={loading ? "—" : stats?.totalMembers ?? 0}
            icon={Users}
            iconClassName="text-blue-500"
          />
          <StatWidget
            label={t("statActiveMembers")}
            value={loading ? "—" : stats?.activeSubscriptions ?? 0}
            icon={UserCheck}
            iconClassName="text-emerald-500"
          />
          <Link href="/late-payments" className="block transition-transform active:scale-[0.99]">
            <StatWidget
              label={t("statLatePayments")}
              value={loading ? "—" : lateCount}
              icon={AlertCircle}
              iconClassName="text-red-500"
            />
          </Link>
          <StatWidget
            label={t("statMonthlyRevenue")}
            value={loading ? "—" : formatCurrency(stats?.monthlyRevenue ?? 0)}
            icon={TrendingUp}
            iconClassName="text-blue-500"
          />
        </div>
      </div>
    </>
  );
}
