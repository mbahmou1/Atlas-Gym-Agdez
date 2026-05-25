import { NextRequest, NextResponse } from "next/server";
import { verifyResetCode } from "@/lib/reset-codes";
import { setPasswordByEmail } from "@/lib/password-reset";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();
    const normalized = String(email || "").trim().toLowerCase();
    const otp = String(code || "").trim();

    if (!normalized.includes("@")) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "الرمز يجب أن يكون 6 أرقام" }, { status: 400 });
    }
    if (!newPassword || String(newPassword).length < 6) {
      return NextResponse.json(
        { error: "كلمة السر الجديدة خاصها تكون على الأقل 6 أحرف" },
        { status: 400 }
      );
    }

    const check = verifyResetCode(normalized, otp);
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

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
