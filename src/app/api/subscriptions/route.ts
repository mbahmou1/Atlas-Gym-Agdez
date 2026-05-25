import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import { addMonths, toDateString } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    if (store.useLocalDb()) return NextResponse.json(await store.listSubscriptions(status));
    let query = getSupabase().from("subscriptions").select("*, member:members(*)").order("end_date", { ascending: false });
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { member_id, plan_type = "monthly", amount = 100 } = await request.json();
    if (!member_id) return NextResponse.json({ error: "member_id required" }, { status: 400 });
    if (store.useLocalDb()) {
      return NextResponse.json(await store.createSubscription({ member_id, plan_type, amount }), { status: 201 });
    }
    const start = new Date();
    const months =
      plan_type === "yearly" ? 12 : plan_type === "six_months" ? 6 : plan_type === "quarterly" ? 3 : 1;
    const end = addMonths(start, months);
    const { data, error } = await getSupabase().from("subscriptions").insert({
      member_id, plan_type, start_date: toDateString(start), end_date: toDateString(end), status: "active", amount,
    }).select("*, member:members(*)").single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to renew" }, { status: 500 });
  }
}
