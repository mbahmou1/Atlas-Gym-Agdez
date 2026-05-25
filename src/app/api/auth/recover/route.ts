import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const { identifier, newPassword } = await request.json();
    if (!identifier || !newPassword) {
      return NextResponse.json(
        { error: "البريد أو رقم الهاتف وكلمة السر الجديدة مطلوبة" },
        { status: 400 }
      );
    }
    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { error: "كلمة السر خاصها تكون على الأقل 6 أحرف" },
        { status: 400 }
      );
    }
    if (!store.useLocalDb()) {
      return NextResponse.json(
        { error: "استرجاع كلمة السر من الواجهة مفعل حالياً للنسخة المحلية فقط" },
        { status: 400 }
      );
    }

    const result = await store.resetPasswordByIdentifier(identifier, newPassword);
    if ("error" in result) return NextResponse.json(result, { status: 404 });
    return NextResponse.json({
      success: true,
      message: "تم تحديث كلمة السر بنجاح. يمكنك تسجيل الدخول الآن.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
