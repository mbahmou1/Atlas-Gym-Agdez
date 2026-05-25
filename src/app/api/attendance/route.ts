import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (store.useLocalDb()) return NextResponse.json(await store.listAttendance());
    const { data, error } = await getSupabase().from("attendance").select("*, member:members(id, name, photo_url)").order("check_in", { ascending: false }).limit(100);
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { member_id } = await request.json();
    if (!member_id) return NextResponse.json({ error: "member_id required" }, { status: 400 });
    if (store.useLocalDb()) {
      return NextResponse.json(await store.createAttendance(member_id), { status: 201 });
    }
    const { data, error } = await getSupabase().from("attendance").insert({ member_id }).select("*, member:members(id, name)").single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
