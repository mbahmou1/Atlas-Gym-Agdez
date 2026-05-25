import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (store.useLocalDb()) {
      const data = await store.updateMember(id, body);
      if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(data);
    }
    const { data, error } = await getSupabase().from("members").update({
      name: body.name, phone: body.phone, photo_url: body.photo_url,
      subscription_start: body.subscription_start, subscription_end: body.subscription_end,
      status: body.status, updated_at: new Date().toISOString(),
    }).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (store.useLocalDb()) {
      await store.deleteMember(id);
      return NextResponse.json({ success: true });
    }
    const { error } = await getSupabase().from("members").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
