import { NextRequest, NextResponse } from "next/server";
import { createResetCode } from "@/lib/reset-codes";
import { sendPasswordResetCode } from "@/lib/email";
import { findAccountByEmail } from "@/lib/password-reset";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalized = String(email || "").trim().toLowerCase();
    if (!normalized.includes("@")) {
      return NextResponse.json({ error: "أدخل بريداً إلكترونياً صحيحاً" }, { status: 400 });
    }

    const account = await findAccountByEmail(normalized);
    if (!account) {
      return NextResponse.json({ error: "لا يوجد حساب مرتبط بهذا البريد" }, { status: 404 });
    }

    const code = createResetCode(normalized);
    const sent = await sendPasswordResetCode(normalized, code);
    if (!sent.ok) return NextResponse.json({ error: sent.error }, { status: 503 });

    return NextResponse.json({
      success: true,
      message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
