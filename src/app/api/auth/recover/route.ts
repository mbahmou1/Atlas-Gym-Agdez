import { NextResponse } from "next/server";

/** الطريقة القديمة (بدون رمز) — لم تعد مدعومة */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "استعمل إرسال الرمز إلى البريد ثم تأكيد الرمز وكلمة السر الجديدة من صفحة تسجيل الدخول.",
    },
    { status: 410 }
  );
}
