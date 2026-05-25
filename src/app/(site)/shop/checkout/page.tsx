"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/site/glass-card";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp-site";
import { SectionTitle } from "@/components/site/section-title";

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Agdez");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submitOrder(openWhatsApp: boolean) {
    if (!name || !phone || items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          notes,
          items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error("Order failed");

      const itemsText = items
        .map((i) => `• ${i.name} x${i.quantity} = ${formatCurrency(i.price * i.quantity)}`)
        .join("\n");

      if (openWhatsApp) {
        const url = getSiteWhatsAppUrl("order", {
          name,
          phone,
          address,
          items: itemsText,
          total: `${totalPrice}`,
        });
        window.open(url, "_blank");
      }

      clearCart();
      setDone(true);
    } catch {
      alert("خطأ ف إرسال الطلب. عاود جرب.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <GlassCard>
          <h1 className="text-2xl font-black text-primary">تم إرسال الطلب!</h1>
          <p className="mt-2 text-muted-foreground">غادي نتواصلو معاك قريباً.</p>
          <Link href="/shop" className="mt-6 inline-block text-primary font-bold">
            متابعة التسوق
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">السلة فارغة.</p>
        <Link href="/shop" className="mt-4 inline-block font-bold text-primary">
          الذهاب للمتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <SectionTitle title="إتمام الطلب" subtitle="الدفع عند التسليم فقط." />

      <div className="grid gap-8 lg:grid-cols-2">
        <GlassCard className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border-b border-border pb-4 last:border-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{item.name}</p>
                <p className="text-sm text-primary">{formatCurrency(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="rounded border border-border p-1"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="rounded border border-border p-1"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ms-auto text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xl font-black text-end">
            المجموع: <span className="text-primary">{formatCurrency(totalPrice)}</span>
          </p>
        </GlassCard>

        <GlassCard>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitOrder(true);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">الهاتف</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">💵 الدفع عند التسليم</p>
            <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "أكد الطلب + واتساب"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => submitOrder(false)}
            >
              أكد بدون واتساب
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
