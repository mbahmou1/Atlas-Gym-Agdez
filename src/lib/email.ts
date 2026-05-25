export async function sendPasswordResetCode(to: string, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Atlas Agdez Gym <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      ok: false,
      error:
        "إرسال البريد غير مفعّل. أضف RESEND_API_KEY و EMAIL_FROM في Vercel (أو .env.local).",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "رمز إعادة تعيين كلمة السر — أطلس أكدز جيم",
      html: `
        <div dir="rtl" style="font-family:Tahoma,sans-serif;line-height:1.6">
          <h2>أطلس أكدز جيم</h2>
          <p>طلبت إعادة تعيين كلمة السر. استعمل هذا الرمز:</p>
          <p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p>
          <p>الرمز صالح لمدة <strong>15 دقيقة</strong>.</p>
          <p style="color:#666;font-size:13px">إن لم تطلب هذا الرمز، تجاهل هذه الرسالة.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Resend error:", res.status, body);
    return { ok: false, error: "تعذر إرسال البريد. تحقق من إعدادات Resend." };
  }

  return { ok: true };
}
