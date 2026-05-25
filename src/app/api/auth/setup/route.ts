import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email || "admin@atlasgym.com";
    const password = body.password || "admin123";
    const name = body.name || "Gym Admin";
    const phone = body.phone || "0687048566";

    if (store.useLocalDb()) {
      const result = await store.createAdmin(email, password, name, phone);
      if ("error" in result) return NextResponse.json(result, { status: 400 });
      return NextResponse.json({ success: true, email, password });
    }

    const supabase = getSupabase();
    const { count } = await supabase.from("users").select("*", { count: "exact", head: true });
    if (count && count > 0) return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    const { error } = await supabase.from("users").insert({
      email,
      phone,
      password_hash: await hashPassword(password),
      name,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, email, password });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
