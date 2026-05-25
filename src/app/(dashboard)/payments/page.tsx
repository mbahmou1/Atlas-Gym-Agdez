"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Wallet, Download, Search } from "lucide-react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { PaymentListCard } from "@/components/payment-list-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Payment, Member, PaymentMethod } from "@/lib/types";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";
import { getMonthName } from "@/lib/i18n/messages";

export default function PaymentsPage() {
  const { t, locale } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    member_id: "",
    amount: "300",
    payment_date: new Date().toISOString().split("T")[0],
    method: "cash" as PaymentMethod,
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const [payData, memData] = await Promise.all([
        apiJson<{ payments: Payment[] }>("/api/payments"),
        apiJson<Member[]>("/api/members"),
      ]);
      setPayments(payData.payments ?? []);
      setMembers(Array.isArray(memData) ? memData : []);
    } catch (err) {
      setPayments([]);
      setMembers([]);
      setPageError(getErrorMessage(err, t("errorLoadPayments")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd() {
    if (!form.member_id) return;
    setSaving(true);
    setFormError("");
    try {
      await apiJson("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      setDialogOpen(false);
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const now = new Date();
  const monthName = getMonthName(locale, now.getMonth());
  const year = now.getFullYear();

  return (
    <>
      <MobileTopBar />
      <div className="mx-auto w-full max-w-lg lg:max-w-4xl">
        <div className="bg-card px-4 pt-5 pb-4 border-b border-border">
          <h1 className="text-xl font-bold capitalize">
            {t("paymentsTitle", { month: monthName, year })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? t("loading") : t("results", { count: payments.length })}
          </p>
        </div>
        <div className="p-4 space-y-3 bg-background min-h-[60vh]">
          {pageError && (
            <ErrorBanner message={pageError} onDismiss={() => setPageError("")} />
          )}
          <Button
            onClick={() => {
              setFormError("");
              setDialogOpen(true);
            }}
            className="w-full h-12 gym-btn-primary gap-2"
          >
            <Plus className="h-5 w-5" />
            {t("add")}
          </Button>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="gym-input w-full ps-10 bg-card" placeholder={t("searchPayments")} />
          </div>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
            <Select defaultValue={String(now.getMonth() + 1)}>
              <SelectTrigger className="gym-input h-12 bg-card capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {getMonthName(locale, i)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={String(year)}>
              <SelectTrigger className="gym-input h-12 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(year)}>{year}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-12 w-12 p-0 gym-input bg-card">
              <Download className="h-5 w-5" />
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="gym-card h-28 animate-pulse bg-muted/30" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <EmptyState icon={Wallet} title={t("noPayments")} />
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <PaymentListCard key={p.id} payment={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addPayment")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {formError && <ErrorBanner message={formError} onDismiss={() => setFormError("")} />}
            <div className="space-y-2">
              <Label>{t("member")}</Label>
              <Select value={form.member_id} onValueChange={(v) => setForm({ ...form, member_id: v })}>
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
              <Label>{t("amountMad")}</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t("date")}</Label>
              <Input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t("method")}</Label>
              <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v as PaymentMethod })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{t("cash")}</SelectItem>
                  <SelectItem value="card">{t("card")}</SelectItem>
                  <SelectItem value="transfer">{t("transfer")}</SelectItem>
                  <SelectItem value="other">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("notes")}</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={t("optional")} />
            </div>
            <Button className="w-full" onClick={handleAdd} disabled={saving || !form.member_id}>
              {saving ? t("saving") : t("addPayment")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
