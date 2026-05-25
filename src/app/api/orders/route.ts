import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (store.useLocalDb()) return NextResponse.json(await store.listOrders());
    const supabase = getSupabase();
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(orders);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_address, notes, items } = body;
    if (!customer_name || !customer_phone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (store.useLocalDb()) {
      const order = await store.createOrder({
        customer_name,
        customer_phone,
        customer_address: customer_address || "Agdez",
        notes,
        items,
      });
      return NextResponse.json(order, { status: 201 });
    }

    /* Supabase: simplified — use store pattern in production */
    return NextResponse.json({ error: "Use local DB or extend Supabase orders" }, { status: 501 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
