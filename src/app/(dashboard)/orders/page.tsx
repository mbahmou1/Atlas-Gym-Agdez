"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order, OrderStatus } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";
import { EmptyState } from "@/components/empty-state";

export default function OrdersAdminPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      setOrders(await apiJson<Order[]>("/api/orders"));
    } catch (err) {
      setError(getErrorMessage(err, "تعذر تحميل الطلبات"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    try {
      await apiJson(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "تعذر التحديث"));
    }
  }

  return (
    <>
      <MobileTopBar />
      <div className="mx-auto w-full max-w-lg lg:max-w-4xl p-4 pb-8 space-y-4">
        {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
        <h1 className="text-2xl font-bold">{t("navOrders")}</h1>
        <p className="text-sm text-muted-foreground">طلبيات المكملات — دفع عند التسليم</p>

        {loading ? (
          <p className="text-center text-muted-foreground">{t("loading")}</p>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="لا توجد طلبيات"
            description="طلبيات المتجر من صفحة الدفع تظهر هنا."
          />
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="gym-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{o.customer_name}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {o.customer_phone}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(o.created_at)}</p>
                  </div>
                  <Badge>{o.status}</Badge>
                </div>
                <p className="text-lg font-bold text-primary">{formatCurrency(o.total)}</p>
                <p className="text-sm text-muted-foreground">{o.customer_address}</p>
                {o.items && o.items.length > 0 && (
                  <ul className="text-sm space-y-1 border-t border-border pt-2">
                    {o.items.map((i) => (
                      <li key={i.id}>
                        {i.product_name} × {i.quantity}
                      </li>
                    ))}
                  </ul>
                )}
                <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="delivered">تم التسليم</SelectItem>
                    <SelectItem value="cancelled">ملغى</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
