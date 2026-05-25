import { NextRequest, NextResponse } from "next/server";
import * as store from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const featured = searchParams.get("featured") === "true";
    const slug = searchParams.get("slug")?.trim();

    if (store.useLocalDb()) {
      if (slug) {
        const product = await store.getProductBySlug(slug);
        if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(product);
      }
      return NextResponse.json(
        await store.listProducts({ search, category, featured: featured || undefined })
      );
    }

    const supabase = getSupabase();
    if (slug) {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
      if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(data);
    }

    let query = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (category) query = query.eq("category", category);
    if (featured) query = query.eq("featured", true);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (store.useLocalDb()) {
      const product = await store.createProduct(body);
      return NextResponse.json(product, { status: 201 });
    }
    const { data, error } = await getSupabase().from("products").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
