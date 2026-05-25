/**
 * Copy local data/atlasgym.json → Supabase (production).
 *
 * Prerequisites:
 *   1. Run supabase/schema.sql (+ patch-existing.sql if needed) in Supabase SQL Editor
 *   2. Set in .env.local: USE_LOCAL_DB=false + Supabase keys
 *
 * Usage:
 *   node scripts/migrate-to-supabase.js
 *   node scripts/migrate-to-supabase.js --skip-demo   # skip members with phone 0609...
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const ROOT = path.join(__dirname, "..");
const DB_PATH = path.join(ROOT, "data", "atlasgym.json");
const skipDemo = process.argv.includes("--skip-demo");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function isDemoMember(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.startsWith("0609");
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes("your-project")) {
    console.error("Missing Supabase keys in .env.local (URL + SUPABASE_SERVICE_ROLE_KEY).");
    process.exit(1);
  }

  if (!fs.existsSync(DB_PATH)) {
    console.error("Missing", DB_PATH);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log("Migrating to Supabase…", skipDemo ? "(demo members skipped)" : "");

  if (db.users?.length) {
    const { error } = await supabase.from("users").upsert(
      db.users.map((u) => ({
        id: u.id,
        email: u.email,
        phone: u.phone ?? null,
        password_hash: u.password_hash,
        name: u.name,
        created_at: u.created_at,
      })),
      { onConflict: "email" }
    );
    if (error) throw new Error("users: " + error.message);
    console.log("✓ users:", db.users.length);
  }

  let members = db.members || [];
  if (skipDemo) members = members.filter((m) => !isDemoMember(m.phone));
  if (members.length) {
    const { error } = await supabase.from("members").upsert(members, { onConflict: "id" });
    if (error) throw new Error("members: " + error.message);
    console.log("✓ members:", members.length);
  }

  let subs = db.subscriptions || [];
  if (skipDemo) {
    const kept = new Set(members.map((m) => m.id));
    subs = subs.filter((s) => kept.has(s.member_id));
  }
  if (subs.length) {
    const { error } = await supabase.from("subscriptions").upsert(subs, { onConflict: "id" });
    if (error) throw new Error("subscriptions: " + error.message);
    console.log("✓ subscriptions:", subs.length);
  }

  let payments = db.payments || [];
  if (skipDemo) {
    const kept = new Set(members.map((m) => m.id));
    payments = payments.filter((p) => kept.has(p.member_id));
  }
  if (payments.length) {
    const { error } = await supabase.from("payments").upsert(payments, { onConflict: "id" });
    if (error) throw new Error("payments: " + error.message);
    console.log("✓ payments:", payments.length);
  }

  if (db.products?.length) {
    const { error } = await supabase.from("products").upsert(
      db.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        price: p.price,
        image_url: p.image_url || "",
        category: p.category,
        featured: !!p.featured,
        best_seller: !!p.best_seller,
        stock: p.stock ?? 50,
        rating: p.rating ?? null,
        reviews: p.reviews ?? null,
        created_at: p.created_at,
      })),
      { onConflict: "slug" }
    );
    if (error) throw new Error("products: " + error.message);
    console.log("✓ products:", db.products.length);
  }

  if (db.orders?.length) {
    const { error: oErr } = await supabase.from("orders").upsert(db.orders, { onConflict: "id" });
    if (oErr) throw new Error("orders: " + oErr.message);
    console.log("✓ orders:", db.orders.length);
  }

  if (db.order_items?.length) {
    const { error } = await supabase.from("order_items").upsert(db.order_items, { onConflict: "id" });
    if (error) throw new Error("order_items: " + error.message);
    console.log("✓ order_items:", db.order_items.length);
  }

  console.log("\nDone. Set USE_LOCAL_DB=false on Vercel and redeploy.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
