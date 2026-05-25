import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import { buildLatePaymentItems } from "@/lib/late-payments";
import type { Member, Subscription } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const filters = {
      search: params.get("search")?.trim() || undefined,
      month: params.get("month") && params.get("month") !== "all"
        ? Number(params.get("month"))
        : undefined,
      year: params.get("year") ? Number(params.get("year")) : undefined,
      status: (params.get("status") as "all" | "expired" | "expiring") || "all",
    };

    if (store.useLocalDb()) {
      return NextResponse.json(await store.getLatePayments(filters));
    }

    const supabase = getSupabase();
    const [membersRes, subsRes] = await Promise.all([
      supabase.from("members").select("*"),
      supabase.from("subscriptions").select("*"),
    ]);
    if (membersRes.error) throw membersRes.error;
    if (subsRes.error) throw subsRes.error;

    return NextResponse.json(
      buildLatePaymentItems(
        (membersRes.data ?? []) as Member[],
        (subsRes.data ?? []) as Subscription[],
        filters
      )
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch late payments" }, { status: 500 });
  }
}
