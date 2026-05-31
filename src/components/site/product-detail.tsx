"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Star, Loader2, ShieldCheck, Truck, Info, CheckCircle2, Banknote } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { Badge } from "@/components/ui/badge";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { useRouter } from "next/navigation";

function getProductUsage(category: string) {
  switch (category) {
    case "protein":
      return "امزج مكيالاً واحداً (سكوب) مع 250-300 مل من الماء أو الحليب. يُفضل تناوله بعد التمرين مباشرة، أو في الصباح الباكر لدعم الاستشفاء العضلي.";
    case "creatine":
      return "امزج 5 جرام (مكيال واحد) مع الماء أو العصير. يُفضل تناوله يومياً، سواء قبل أو بعد التمرين، أو في أي وقت في أيام الراحة للحفاظ على مخزون الطاقة.";
    case "vitamins":
      return "تناول حبة واحدة يومياً مع وجبة الإفطار أو حسب توجيهات أخصائي التغذية. لا تتجاوز الجرعة الموصى بها.";
    case "accessories":
      return "اغسل المنتج جيداً قبل الاستخدام الأول. آمن للاستخدام في غسالة الصحون. تأكد من إغلاق الغطاء بإحكام قبل الرج.";
    default:
      return "يُرجى قراءة التعليمات الموجودة على العبوة قبل الاستخدام. استشر مدربك أو أخصائي التغذية لتحديد الجرعة المناسبة لك.";
  }
}

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("أكدز");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiJson("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          items: [{ product_id: product.id, slug: product.slug, quantity: qty }],
          total: product.price * qty,
          payment_method: "cod",
        }),
      });
      alert("تم إرسال طلبك بنجاح! سنتواصل معك قريباً.");
      router.push("/shop");
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {product.featured && <Badge>مميز</Badge>}
            {product.best_seller && <Badge variant="secondary">الأكثر مبيعاً</Badge>}
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <h1 className="text-3xl font-black md:text-4xl">{product.name}</h1>
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <span className="font-bold text-lg">{product.rating}</span>
              <span className="text-muted-foreground">أكثر من {product.reviews} تقييم</span>
            </div>
          )}
          <p className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</p>
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Banknote className="h-5 w-5 text-primary" />
              <span>الدفع عند الاستلام</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Truck className="h-5 w-5 text-primary" />
              <span>توصيل 1-2 أيام</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>ضمان 30 يوم</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>منتج مرخص وأصلي</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-lg mb-2">
                <Info className="h-5 w-5 text-primary" />
                عن المنتج
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                هذا المنتج مصمم خصيصاً لتلبية احتياجاتك الرياضية بأعلى معايير الجودة. يساعدك على تحقيق أهدافك سواء في بناء العضلات، زيادة الطاقة، أو تحسين الأداء العام. جميع منتجاتنا أصلية ومضمونة 100%.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-bold text-lg mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                طريقة الاستعمال
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getProductUsage(product.category)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <span className="text-sm font-medium">الكمية</span>
            <div className="flex items-center rounded-xl border border-border">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center hover:bg-muted"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center hover:bg-muted"
                onClick={() => setQty(qty + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleOrder} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5">
            <h3 className="font-bold text-lg mb-2">معلومات التوصيل</h3>
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">المدينة / العنوان</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            
            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full text-base font-bold" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "اطلب الآن"}
              </Button>
            </div>
          </form>

          <WhatsAppCta
            intent="product"
            data={{ product: product.name }}
            label="استفسر عن المنتج عبر واتساب"
            variant="outline"
            className="w-full"
          />

          <div className="mt-6 rounded-2xl bg-primary/5 p-5 border border-primary/10">
            <h3 className="font-bold text-center mb-4">خطوات الطلب البسيطة</h3>
            <div className="flex justify-between items-center text-center text-sm font-medium relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2"></div>
              <div className="flex flex-col items-center gap-2 bg-primary/5 px-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <span>اطلب الآن</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-primary/5 px-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <span>نتصل لتأكيد الطلب</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-primary/5 px-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <span>استلم وادفع</span>
              </div>
            </div>
          </div>

          <Link href="/shop" className="inline-block text-sm text-primary hover:underline mt-4">
            ← رجوع للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
