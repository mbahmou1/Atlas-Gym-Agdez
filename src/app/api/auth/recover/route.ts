import { NextRequest, NextResponse } from "next/server";
import { findAccountByEmail, setPasswordByEmail } from "@/lib/password-reset";
import * as store from "@/lib/store";

/** إعادة تعيين مباشرة بالبريد + كلمة سر جديدة (بلا رمز) */
export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();
    const normalized = String(email || "").trim().toLowerCase();

    if (!normalized.includes("@")) {
      return NextResponse.json({ error: "أدخل بريداً إلكترونياً صحيحاً" }, { status: 400 });
    }
    if (!newPassword || String(newPassword).length < 6) {
      return NextResponse.json(
        { error: "كلمة السر الجديدة خاصها تكون على الأقل 6 أحرف" },
        { status: 400 }
      );
    }

    const account = await findAccountByEmail(normalized);
    if (!account) {
      return NextResponse.json({ error: "لا يوجد حساب مرتبط بهذا البريد" }, { status: 404 });
    }

    if (!store.useLocalDb() && !process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("eyJ")) {
      return NextResponse.json(
        { error: "قاعدة البيانات غير مضبوطة على السيرفر. راجع Supabase في Vercel." },
        { status: 503 }
      );
    }

    const result = await setPasswordByEmail(normalized, String(newPassword));
    if ("error" in result) return NextResponse.json(result, { status: 404 });

    return NextResponse.json({
      success: true,
      message: "تم تحديث كلمة السر. يمكنك تسجيل الدخول الآن.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
