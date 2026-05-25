"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Users } from "lucide-react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { MemberListCard } from "@/components/member-list-card";
import { MemberAvatar } from "@/components/member-avatar";
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
import type { Member, PlanType } from "@/lib/types";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";

const emptyForm = {
  name: "",
  phone: "",
  photo_url: "",
  plan_type: "monthly" as PlanType,
  amount: "100",
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

export default function MembersPage() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  const loadMembers = useCallback(async (q?: string) => {
    setLoading(true);
    setPageError("");
    try {
      const url = q ? `/api/members?search=${encodeURIComponent(q)}` : "/api/members";
      const data = await apiJson<Member[]>(url);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMembers([]);
      setPageError(getErrorMessage(err, t("errorLoadMembers")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timer = setTimeout(() => loadMembers(search), 300);
    return () => clearTimeout(timer);
  }, [search, loadMembers]);

  function openAdd() {
    setFormError("");
    setEditing(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setPhotoPreview(null);
    setDialogOpen(true);
  }

  function openEdit(member: Member) {
    setFormError("");
    setEditing(member);
    setForm({
      name: member.name,
      phone: member.phone || "",
      photo_url: member.photo_url || "",
      plan_type: "monthly",
      amount: "100",
    });
    setPhotoFile(null);
    setPhotoPreview(member.photo_url || null);
    setDialogOpen(true);
  }

  function onPhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function uploadPhoto(): Promise<string | null> {
    if (!photoFile) return form.photo_url || null;
    const fd = new FormData();
    fd.append("file", photoFile);
    const data = await apiJson<{ url: string }>("/api/upload", {
      method: "POST",
      body: fd,
    });
    return data.url;
  }

  async function handleSave() {
    setSaving(true);
    setFormError("");
    try {
      const photo_url = await uploadPhoto();
      const body = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        photo_url: photo_url || null,
        plan_type: form.plan_type,
        amount: Number(form.amount),
      };
      const url = editing ? `/api/members/${editing.id}` : "/api/members";
      await apiJson(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing
            ? { name: body.name, phone: body.phone, photo_url: body.photo_url }
            : body
        ),
      });
      setDialogOpen(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      loadMembers(search);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteMemberConfirm"))) return;
    setPageError("");
    try {
      await apiJson(`/api/members/${id}`, { method: "DELETE" });
      loadMembers(search);
    } catch (err) {
      setPageError(getErrorMessage(err, t("errorDeleteMember")));
    }
  }

  return (
    <>
      <MobileTopBar />
      <div className="mx-auto w-full max-w-lg lg:max-w-4xl">
        <div className="bg-card px-4 pt-5 pb-4 border-b border-border">
          <h1 className="text-xl font-bold">{t("membersTitle")}</h1>
        </div>
        <div className="p-4 space-y-3 bg-background min-h-[60vh]">
          {pageError && (
            <ErrorBanner message={pageError} onDismiss={() => setPageError("")} />
          )}
          <Button onClick={openAdd} className="h-12 w-full gym-btn-primary gap-2">
            <Plus className="h-5 w-5" />
            {t("add")}
          </Button>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="gym-input w-full ps-10 bg-card"
              placeholder={t("searchMembers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="gym-input h-12 bg-card w-full">
              <SelectValue placeholder={t("allGroups")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allGroups")}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="gym-input h-12 bg-card w-full">
              <SelectValue placeholder={t("allSubscriptionStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSubscriptionStatuses")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="expired">{t("expired")}</SelectItem>
            </SelectContent>
          </Select>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="gym-card h-24 animate-pulse bg-muted/30" />
              ))}
            </div>
          ) : members.length === 0 ? (
            <EmptyState icon={Users} title={t("noMembers")} description={t("noMembersDesc")} />
          ) : (
            <div className="space-y-3">
              {members.map((m) => (
                <MemberListCard
                  key={m.id}
                  member={m}
                  onEdit={() => openEdit(m)}
                  onDelete={() => handleDelete(m.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t("editMember") : t("addMember")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {formError && <ErrorBanner message={formError} onDismiss={() => setFormError("")} />}
            <div className="space-y-2">
              <Label>{t("nameRequired")}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("phone")}</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t("phonePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("photoUpload")}</Label>
              <div className="flex items-center gap-4">
                <MemberAvatar
                  name={form.name || "?"}
                  photoUrl={photoPreview}
                  size="lg"
                  square
                />
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onPhotoPick}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t("photoHint")}</p>
                </div>
              </div>
            </div>
            {!editing && (
              <>
                <div className="space-y-2">
                  <Label>{t("plan")}</Label>
                  <Select
                    value={form.plan_type}
                    onValueChange={(v) => {
                      const nextPlan = v as PlanType;
                      setForm({
                        ...form,
                        plan_type: nextPlan,
                        amount: String(getPlanPrice(nextPlan)),
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_OPTIONS.map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                          {plan.label} — {plan.price} درهم
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("amountMad")}</Label>
                  <Input
                    type="number"
                    value={form.amount}
                    readOnly
                    className="bg-muted font-bold text-primary"
                  />
                </div>
              </>
            )}
            <Button className="w-full" onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving ? t("saving") : editing ? t("update") : t("addMember")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
