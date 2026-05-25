import { NextRequest, NextResponse } from "next/server";
import { verifyLogin, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, identifier, password } = await request.json();
    const loginIdentifier = identifier || email;
    if (!loginIdentifier || !password) {
      return NextResponse.json({ error: "البريد أو رقم الهاتف وكلمة السر مطلوبان" }, { status: 400 });
    }
    const user = await verifyLogin(loginIdentifier, password);
    if (!user) return NextResponse.json({ error: "معلومات الدخول غير صحيحة" }, { status: 401 });
    await createSession(user);
    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
