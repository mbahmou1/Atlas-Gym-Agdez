"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  Users,
  Wallet,
  Globe,
  Bell,
  KeyRound,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { apiJson, getErrorMessage } from "@/lib/api-client";

const FEATURES = [
  {
    icon: Globe,
    title: "موقع خاص بقاعتك",
    desc: "واجهة احترافية للعملاء، مع متجر مكملات اختياري.",
  },
  {
    icon: Users,
    title: "عدد الأعضاء والملفات",
    desc: "سجل كامل: الاسم، الهاتف، الصورة، وحالة الاشتراك.",
  },
  {
    icon: Calendar,
    title: "الاشتراكات والأيام المتبقية",
    desc: "الأيام المتبقية لكل عضو: شهري، 3 أشهر، أو سنوي — بيانات واضحة.",
  },
  {
    icon: Wallet,
    title: "المدفوعات والتأخرات",
    desc: "متابعة الدفع، انتهاء الاشتراك، وتذكيرات عبر واتساب.",
  },
  {
    icon: Bell,
    title: "لوحة تحكم سهلة",
    desc: "من الهاتف أو الحاسوب — دون تعقيد.",
  },
];

export default function LoginPage() {
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const [identifier, setIdentifier] = useState("mbahmou@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [showRecover, setShowRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("mbahmou@gmail.com");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoverStep, setRecoverStep] = useState<"email" | "code">("email");
  const [recoverMessage, setRecoverMessage] = useState("");
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiJson("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      window.location.assign("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, t("errorLogin")));
    } finally {
      setLoading(false);
    }
  }

  async function handleSendResetCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRecoverMessage("");
    setRecoverLoading(true);
    try {
      await apiJson("/api/auth/recover/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoverEmail }),
      });
      setRecoverStep("code");
      setRecoverMessage("تم إرسال رمز من 6 أرقام إلى بريدك. تحقق من Gmail (وصندوق Spam).");
      setResetCode("");
    } catch (err) {
      setError(getErrorMessage(err, "تعذر إرسال الرمز"));
    } finally {
      setRecoverLoading(false);
    }
  }

  async function handleConfirmReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRecoverMessage("");
    if (newPassword !== confirmPassword) {
      setError("كلمة السر الجديدة غير متطابقة");
      return;
    }
    setRecoverLoading(true);
    try {
      await apiJson("/api/auth/recover/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recoverEmail,
          code: resetCode,
          newPassword,
        }),
      });
      setRecoverMessage("تم تحديث كلمة السر. سجّل الدخول الآن.");
      setPassword(newPassword);
      setIdentifier(recoverEmail);
      setShowRecover(false);
      setRecoverStep("email");
      setResetCode("");
      setConfirmPassword("");
    } catch (err) {
      setError(getErrorMessage(err, "تعذر تأكيد الرمز"));
    } finally {
      setRecoverLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />
      <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← العودة للموقع
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="mx-auto mb-6 inline-flex rounded-2xl bg-primary/10 p-4">
            <LayoutDashboard className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black md:text-4xl">خدمة تسيير القاعات</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            هل تملك قاعة رياضية؟ ننشئ لك{" "}
            <strong className="text-foreground">موقعاً خاصاً</strong> و{" "}
            <strong className="text-foreground">نظام إدارة</strong> لمتابعة
            الأعضاء والاشتراكات والأيام المتبقية لكل عضو — كل ذلك من مكان واحد.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mb-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-border/80 bg-card/80">
              <CardContent className="pt-5 pb-5">
                <Icon className="h-6 w-6 text-primary mb-3" />
                <h2 className="font-bold text-sm">{title}</h2>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              مثال: أطلس أكدز جيم — نفس النظام: موقع للعملاء، لوحة للمدير، أعضاء،
              اشتراكات، مدفوعات، ومتجر مكملات.
            </p>
            <WhatsAppCta
              intent="gym-management-service"
              label="أريد هذه الخدمة — واتساب"
              className="mx-auto h-12 px-8 text-base"
            />
          </CardContent>
        </Card>

        {/* دخول الزبناء الحاليين */}
        <div className="border-t border-border pt-8">
          <button
            type="button"
            onClick={() => setShowLogin(!showLogin)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-start font-bold hover:bg-muted/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <BrandLogo size="xs" />
              لديك حساب؟ تسجيل الدخول
            </span>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform ${showLogin ? "rotate-180" : ""}`}
            />
          </button>

          {showLogin && (
            <Card className="mt-4 border-border/60">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-xl">أطلس أكدز جيم</CardTitle>
                <CardDescription>تسجيل دخول المدير — إدارة الصالة</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">البريد الإلكتروني أو رقم الهاتف</Label>
                    <Input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="mbahmou@gmail.com أو 0687048566"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        {t("signingIn")}
                      </>
                    ) : (
                      t("signIn")
                    )}
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setShowRecover(!showRecover);
                    setError("");
                    setRecoverMessage("");
                    setRecoverStep("email");
                    setResetCode("");
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <KeyRound className="h-4 w-4" />
                  هل نسيت كلمة السر؟
                </button>

                {showRecover && (
                  <div className="mt-4 space-y-4 rounded-xl border border-border bg-muted/30 p-4">
                    {recoverStep === "email" ? (
                      <form onSubmit={handleSendResetCode} className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                          سنرسل رمز تحقق إلى بريدك الإلكتروني (Gmail)، ثم تدخل الرمز وكلمة سر جديدة.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="recoverEmail">البريد الإلكتروني</Label>
                          <Input
                            id="recoverEmail"
                            type="email"
                            value={recoverEmail}
                            onChange={(e) => setRecoverEmail(e.target.value)}
                            placeholder="mbahmou@gmail.com"
                            required
                          />
                        </div>
                        {recoverMessage && (
                          <p className="text-center text-sm font-bold text-primary">{recoverMessage}</p>
                        )}
                        <Button type="submit" variant="outline" className="w-full" disabled={recoverLoading}>
                          {recoverLoading ? (
                            <>
                              <Loader2 className="animate-spin" />
                              جاري الإرسال...
                            </>
                          ) : (
                            "إرسال الرمز إلى البريد"
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleConfirmReset} className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                          الرمز مُرسل إلى <strong className="text-foreground">{recoverEmail}</strong>
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="resetCode">رمز التحقق (6 أرقام)</Label>
                          <Input
                            id="resetCode"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                            placeholder="123456"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">كلمة السر الجديدة</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="على الأقل 6 أحرف"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">تأكيد كلمة السر</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        {recoverMessage && (
                          <p className="text-center text-sm font-bold text-primary">{recoverMessage}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={recoverLoading}>
                          {recoverLoading ? (
                            <>
                              <Loader2 className="animate-spin" />
                              جاري التأكيد...
                            </>
                          ) : (
                            "تأكيد وتحديث كلمة السر"
                          )}
                        </Button>
                        <button
                          type="button"
                          className="w-full text-sm text-primary hover:underline"
                          onClick={() => {
                            setRecoverStep("email");
                            setRecoverMessage("");
                            setError("");
                          }}
                        >
                          إرسال رمز جديد
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
