import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (store.useLocalDb()) {
      const product = await store.updateProduct(id, body);
      if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(product);
    }
    const { data, error } = await getSupabase()
      .from("products")
      .update(body)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (store.useLocalDb()) {
      await store.deleteProduct(id);
      return NextResponse.json({ success: true });
    }
    const { error } = await getSupabase().from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
