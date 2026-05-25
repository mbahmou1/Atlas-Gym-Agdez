"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Plus, Trash2 } from "lucide-react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";
import { EmptyState } from "@/components/empty-state";

const CATEGORIES: ProductCategory[] = ["protein", "creatine", "vitamins", "accessories"];

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  protein: "بروتين",
  creatine: "كرياتين",
  "pre-workout": "قبل التمرين",
  "mass-gainer": "مكسب كتلة",
  vitamins: "فيتامينات",
  accessories: "إكسسوارات",
};

const emptyForm = {
  name: "",
  description: "",
  price: "0",
  image_url: "https://images.unsplash.com/photo-1571019613454-1cb910f99b2b?w=600&q=80",
  category: "protein" as ProductCategory,
  featured: false,
  best_seller: false,
  stock: "50",
};

export default function ProductsAdminPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setError("");
    try {
      setProducts(await apiJson<Product[]>("/api/products"));
    } catch (err) {
      setError(getErrorMessage(err, "تعذر تحميل المنتجات"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiJson("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      setOpen(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "تعذر الحفظ"));
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "products");
      const result = await apiJson<{ url: string }>("/api/upload", {
        method: "POST",
        body,
      });
      setForm((current) => ({ ...current, image_url: result.url }));
    } catch (err) {
      setError(getErrorMessage(err, "تعذر تحميل الصورة"));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا المنتج؟")) return;
    try {
      await apiJson(`/api/products/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "تعذر الحذف"));
    }
  }

  return (
    <>
      <MobileTopBar />
      <div className="mx-auto w-full max-w-lg lg:max-w-4xl p-4 pb-8 space-y-4">
        {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("navProducts")}</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                {t("add")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة منتج</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <Label>الاسم</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>الثمن (درهم)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>الصورة</Label>
                  <div className="mt-2 space-y-2">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                    />
                    {uploading && (
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        جاري تحميل الصورة...
                      </p>
                    )}
                  </div>
                </div>
                {form.image_url && (
                  <div className="overflow-hidden rounded-xl border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image_url} alt="معاينة المنتج" className="h-32 w-full object-cover" />
                  </div>
                )}
                <div>
                  <Label>الفئة</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm({ ...form, category: v as ProductCategory })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CATEGORY_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" /> : t("add")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">{t("loading")}</p>
        ) : products.length === 0 ? (
          <EmptyState icon={Package} title="لا توجد منتجات" description="أضف أول مكمل." />
        ) : (
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id} className="gym-card flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-bold truncate">{p.name}</p>
                  <p className="text-sm text-primary">{formatCurrency(p.price)}</p>
                  <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[p.category]}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive shrink-0"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
