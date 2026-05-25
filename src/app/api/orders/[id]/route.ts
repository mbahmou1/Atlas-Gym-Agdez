import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import type { OrderStatus } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = (await request.json()) as { status: OrderStatus };
    if (store.useLocalDb()) {
      const order = await store.updateOrderStatus(id, status);
      if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(order);
    }
    const { data, error } = await getSupabase()
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
