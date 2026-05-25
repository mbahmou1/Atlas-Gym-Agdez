import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import { addMonths, toDateString } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim();
    if (store.useLocalDb()) return NextResponse.json(await store.listMembers(search));
    let query = getSupabase().from("members").select("*").order("created_at", { ascending: false });
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, photo_url, plan_type = "monthly", amount = 100 } = body;
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    if (store.useLocalDb()) {
      const member = await store.createMember({ name, phone, photo_url, plan_type, amount });
      return NextResponse.json(member, { status: 201 });
    }

    const start = new Date();
    const months =
      plan_type === "yearly" ? 12 : plan_type === "six_months" ? 6 : plan_type === "quarterly" ? 3 : 1;
    const end = addMonths(start, months);
    const { data: member, error } = await getSupabase().from("members").insert({
      name, phone: phone || null, photo_url: photo_url || null,
      subscription_start: toDateString(start), subscription_end: toDateString(end), status: "active",
    }).select().single();
    if (error) throw error;
    await getSupabase().from("subscriptions").insert({
      member_id: member.id, plan_type, start_date: toDateString(start),
      end_date: toDateString(end), status: "active", amount,
    });
    return NextResponse.json(member, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
