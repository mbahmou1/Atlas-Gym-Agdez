import { NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import { startOfMonth, endOfMonth, format } from "date-fns";

export async function GET() {
  try {
    if (store.useLocalDb()) return NextResponse.json(await store.getDashboardStats());

    const supabase = getSupabase();
    const now = new Date();
    const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
    const [membersRes, activeRes, expiredRes, paymentsRes] = await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "expired"),
      supabase.from("payments").select("amount").gte("payment_date", monthStart).lte("payment_date", monthEnd),
    ]);
    const monthlyRevenue = paymentsRes.data?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
    return NextResponse.json({
      totalMembers: membersRes.count ?? 0,
      activeSubscriptions: activeRes.count ?? 0,
      expiredSubscriptions: expiredRes.count ?? 0,
      monthlyRevenue,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
