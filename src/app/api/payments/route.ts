import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (store.useLocalDb()) return NextResponse.json(await store.listPayments());
    const { data, error } = await getSupabase().from("payments").select("*, member:members(id, name, phone)").order("payment_date", { ascending: false });
    if (error) throw error;
    const totalRevenue = data?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
    return NextResponse.json({ payments: data, totalRevenue });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { member_id, amount, payment_date, method = "cash", notes } = body;
    if (!member_id || !amount) return NextResponse.json({ error: "member_id and amount required" }, { status: 400 });
    if (store.useLocalDb()) {
      return NextResponse.json(await store.createPayment({ member_id, amount, payment_date, method, notes }), { status: 201 });
    }
    const { data, error } = await getSupabase().from("payments").insert({
      member_id, amount, payment_date: payment_date || new Date().toISOString().split("T")[0], method, notes: notes || null,
    }).select("*, member:members(id, name)").single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add payment" }, { status: 500 });
  }
}
