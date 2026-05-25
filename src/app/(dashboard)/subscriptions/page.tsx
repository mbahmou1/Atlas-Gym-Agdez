"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MemberAvatar } from "@/components/member-avatar";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription, Member, PlanType } from "@/lib/types";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";

const PLAN_KEYS: Record<PlanType, "monthly" | "quarterly" | "sixMonths" | "yearly"> = {
  monthly: "monthly",
  quarterly: "quarterly",
  six_months: "sixMonths",
  yearly: "yearly",
};

const PLAN_OPTIONS: Array<{ value: PlanType; label: string; price: number }> = [
  { value: "monthly", label: "شهر واحد", price: 100 },
  { value: "quarterly", label: "3 أشهر", price: 250 },
  { value: "six_months", label: "6 أشهر", price: 500 },
  { value: "yearly", label: "عام كامل", price: 900 },
];

function getPlanPrice(planType: PlanType) {
  return PLAN_OPTIONS.find((plan) => plan.value === planType)?.price ?? 100;
}

export default function SubscriptionsPage() {
  const { t } = useLanguage();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [expired, setExpired] = useState<Subscription[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewMemberId, setRenewMemberId] = useState("");
  const [planType, setPlanType] = useState<PlanType>("monthly");
  const [amount, setAmount] = useState("100");
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const [all, exp, mems] = await Promise.all([
        apiJson<Subscription[]>("/api/subscriptions"),
        apiJson<Subscription[]>("/api/subscriptions?status=expired"),
        apiJson<Member[]>("/api/members"),
      ]);
      setSubscriptions(all);
      setExpired(exp);
      setMembers(mems);
    } catch (err) {
      setSubscriptions([]);
      setExpired([]);
      setMembers([]);
      setPageError(getErrorMessage(err, t("errorLoadSubscriptions")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRenew() {
    if (!renewMemberId) return;
    setSaving(true);
    setFormError("");
    try {
      await apiJson("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: renewMemberId,
          plan_type: planType,
          amount: Number(amount),
        }),
      });
      setRenewOpen(false);
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const activeSubs = subscriptions.filter((s) => s.status === "active");

  return (
    <>
      <PageHeader
        title={t("subscriptionsTitle")}
        subtitle={t("subscriptionsSubtitle")}
        actions={
          <Button
            size="sm"
            onClick={() => {
              setFormError("");
              setPlanType("monthly");
              setAmount("100");
              setRenewOpen(true);
            }}
          >
            <RefreshCw className="h-4 w-4" />
            {t("renew")}
          </Button>
        }
      />
      <div className="p-4 lg:p-6 space-y-6">
        {pageError && (
          <ErrorBanner message={pageError} onDismiss={() => setPageError("")} />
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t("active")}</p>
              <p className="text-2xl font-bold text-emerald-400">{activeSubs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t("expired")}</p>
              <p className="text-2xl font-bold text-amber-400">{expired.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t("monthlyPlan")}</p>
              <p className="text-2xl font-bold">{formatCurrency(100)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("activeSubscriptions")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <p className="p-4 text-sm text-muted-foreground">{t("loading")}</p>
            ) : activeSubs.length === 0 ? (
              <EmptyState icon={CreditCard} title={t("noActiveSubscriptions")} />
            ) : (
              <div className="divide-y divide-border">
                {activeSubs.map((s) => (
                  <SubRow key={s.id} sub={s} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-amber-400">{t("expiredSubscriptions")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {expired.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">{t("noExpiredSubscriptions")}</p>
            ) : (
              <div className="divide-y divide-border">
                {expired.map((s) => (
                  <SubRow key={s.id} sub={s} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("renewSubscription")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {formError && <ErrorBanner message={formError} onDismiss={() => setFormError("")} />}
            <div className="space-y-2">
              <Label>{t("member")}</Label>
              <Select value={renewMemberId} onValueChange={setRenewMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectMember")} />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("plan")}</Label>
              <Select
                value={planType}
                onValueChange={(v) => {
                  const nextPlan = v as PlanType;
                  setPlanType(nextPlan);
                  setAmount(String(getPlanPrice(nextPlan)));
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map((plan) => (
                    <SelectItem key={plan.value} value={plan.value}>
                      {plan.label} — {formatCurrency(plan.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("amountMad")}</Label>
              <input
                className="flex h-9 w-full rounded-md border border-input bg-muted px-3 text-sm font-bold text-primary"
                type="number"
                value={amount}
                readOnly
              />
            </div>
            <Button className="w-full" onClick={handleRenew} disabled={saving || !renewMemberId}>
              {saving ? t("renewing") : t("renewSubscription")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SubRow({ sub }: { sub: Subscription }) {
  const { t } = useLanguage();
  const member = sub.member as Member | undefined;
  const planName = t(PLAN_KEYS[sub.plan_type] ?? "monthly");

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        {member && (
          <MemberAvatar name={member.name} photoUrl={member.photo_url} size="sm" />
        )}
        <div>
          <p className="font-medium text-sm">{member?.name ?? t("unknown")}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {t("planLabel", { plan: planName })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge variant={sub.status === "active" ? "success" : "warning"}>
          {sub.status === "active" ? t("active") : t("expired")}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDate(sub.end_date)} · {formatCurrency(sub.amount)}
        </p>
      </div>
    </div>
  );
}
