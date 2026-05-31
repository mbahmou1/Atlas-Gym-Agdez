import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type {
  Member,
  Payment,
  Subscription,
  Attendance,
  User,
  Product,
  Order,
  OrderItem,
  OrderStatus,
} from "./types";
import { getDemoProducts } from "./demo-products";
import { getProductImage } from "./product-images";
import { addMonths, toDateString } from "./utils";

const DB_PATH = path.join(process.cwd(), "data", "atlasgym.json");

/** على Vercel الملف للقراءة فقط — نخزّن في الذاكرة داخل نفس العملية */
let memoryDb: DbData | null = null;

function getPlanMonths(planType?: string): number {
  if (planType === "yearly") return 12;
  if (planType === "six_months") return 6;
  if (planType === "quarterly") return 3;
  return 1;
}

interface DbData {
  users: Array<User & { password_hash: string }>;
  members: Member[];
  subscriptions: Subscription[];
  payments: Payment[];
  attendance: Attendance[];
  products: Product[];
  orders: Order[];
  order_items: OrderItem[];
}

export function useLocalDb(): boolean {
  if (process.env.USE_LOCAL_DB === "true") return true;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !url || !key || url.includes("your-project") || key.includes("your-");
}

async function readDb(): Promise<DbData> {
  if (memoryDb) return memoryDb;
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as DbData;
    const db = ensureShopTables(parsed);
    memoryDb = db;
    if (!parsed.products) {
      try {
        await writeDb(db);
      } catch {
        /* read-only env */
      }
    }
    return db;
  } catch {
    const start = new Date();
    const end = addMonths(start, 1);
    const expiringEnd = new Date();
    expiringEnd.setDate(expiringEnd.getDate() + 3);
    const expiredEnd = new Date();
    expiredEnd.setDate(expiredEnd.getDate() - 10);

    const m1: Member = {
      id: randomUUID(),
      name: "Sara Idrissi",
      phone: "+212 623 456 789",
      photo_url: null,
      subscription_start: toDateString(start),
      subscription_end: toDateString(end),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const m2: Member = {
      id: randomUUID(),
      name: "Ahmed Benali",
      phone: "+212 612 345 678",
      photo_url: null,
      subscription_start: toDateString(addMonths(expiredEnd, -1)),
      subscription_end: toDateString(expiredEnd),
      status: "expired",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const m3: Member = {
      id: randomUUID(),
      name: "Karim Mansouri",
      phone: "+212 656 789 012",
      photo_url: null,
      subscription_start: toDateString(addMonths(expiringEnd, -1)),
      subscription_end: toDateString(expiringEnd),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const hash = await bcrypt.hash("admin123", 10);
    const db: DbData = {
      users: [
        {
          id: randomUUID(),
          email: "mbahmou@gmail.com",
          name: "Gym Admin",
          phone: "0687048566",
          password_hash: hash,
        },
      ],
      members: [m1, m2, m3],
      subscriptions: [
        {
          id: randomUUID(),
          member_id: m1.id,
          plan_type: "monthly",
          start_date: m1.subscription_start!,
          end_date: m1.subscription_end!,
          status: "active",
          amount: 300,
          created_at: new Date().toISOString(),
        },
        {
          id: randomUUID(),
          member_id: m2.id,
          plan_type: "monthly",
          start_date: m2.subscription_start!,
          end_date: m2.subscription_end!,
          status: "expired",
          amount: 300,
          created_at: new Date().toISOString(),
        },
        {
          id: randomUUID(),
          member_id: m3.id,
          plan_type: "monthly",
          start_date: m3.subscription_start!,
          end_date: m3.subscription_end!,
          status: "active",
          amount: 300,
          created_at: new Date().toISOString(),
        },
      ],
      payments: [
        {
          id: randomUUID(),
          member_id: m1.id,
          amount: 300,
          payment_date: toDateString(start),
          method: "cash",
          notes: "Monthly membership",
          created_at: new Date().toISOString(),
        },
        {
          id: randomUUID(),
          member_id: m2.id,
          amount: 300,
          payment_date: m2.subscription_start!,
          method: "cash",
          notes: "Monthly membership",
          created_at: new Date().toISOString(),
        },
      ],
      attendance: [],
      products: getDemoProducts(),
      orders: [],
      order_items: [],
    };
    memoryDb = db;
    try {
      await writeDb(db);
    } catch {
      /* Vercel/serverless: filesystem read-only — use in-memory db */
    }
    return db;
  }
}

function ensureShopTables(db: DbData): DbData {
  if (!db.products?.length) db.products = getDemoProducts();
  if (!db.orders) db.orders = [];
  if (!db.order_items) db.order_items = [];
  
  const demoProducts = getDemoProducts();
  const removedCategories = new Set(["pre-workout", "mass-gainer"]);
  
  db.products = db.products.filter((p) => !removedCategories.has(p.category)).map((p) => {
    const img = getProductImage(p.slug);
    const demo = demoProducts.find(dp => dp.slug === p.slug);
    return { 
      ...p, 
      image_url: img || p.image_url,
      rating: p.rating ?? demo?.rating ?? 4.8,
      reviews: p.reviews ?? demo?.reviews ?? 50
    };
  });
  return db;
}

async function writeDb(db: DbData) {
  memoryDb = db;
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch {
    /* serverless: keep changes in memory only for this instance */
  }
}

export async function verifyLogin(email: string, password: string): Promise<User | null> {
  const db = await readDb();
  const identifier = email.trim().toLowerCase();
  const normalizedPhone = identifier.replace(/\D/g, "");
  const user = db.users.find((u) => {
    const userPhone = (u.phone ?? "").replace(/\D/g, "");
    return u.email.toLowerCase() === identifier || (!!userPhone && userPhone === normalizedPhone);
  });
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
  return { id: user.id, email: user.email, name: user.name, phone: user.phone ?? null };
}

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const user = (await readDb()).users.find((u) => u.email.toLowerCase() === normalized);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, phone: user.phone ?? null };
}

export async function resetPasswordByEmail(email: string, newPassword: string) {
  const db = await readDb();
  const normalized = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (!user) return { error: "لم نعثر على حساب بهذا البريد" };
  user.password_hash = await bcrypt.hash(newPassword, 10);
  await writeDb(db);
  return { success: true, email: user.email, phone: user.phone ?? null };
}

export async function resetPasswordByIdentifier(identifier: string, newPassword: string) {
  const db = await readDb();
  const value = identifier.trim().toLowerCase();
  const normalizedPhone = value.replace(/\D/g, "");
  const user = db.users.find((u) => {
    const userPhone = (u.phone ?? "").replace(/\D/g, "");
    return u.email.toLowerCase() === value || (!!userPhone && userPhone === normalizedPhone);
  });
  if (!user) return { error: "لم نعثر على حساب بهذا البريد أو الرقم" };
  user.password_hash = await bcrypt.hash(newPassword, 10);
  await writeDb(db);
  return { success: true, email: user.email, phone: user.phone ?? null };
}

export async function countUsers() {
  return (await readDb()).users.length;
}

export async function createAdmin(email: string, password: string, name: string, phone?: string) {
  const db = await readDb();
  if (db.users.length > 0) return { error: "Admin already exists" };
  db.users.push({
    id: randomUUID(),
    email,
    name,
    phone: phone ?? null,
    password_hash: await bcrypt.hash(password, 10),
  });
  await writeDb(db);
  return { success: true };
}

export async function listMembers(search?: string) {
  let list = (await readDb()).members;
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (m) => m.name.toLowerCase().includes(q) || (m.phone || "").includes(q)
    );
  }
  return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createMember(data: {
  name: string;
  phone?: string;
  photo_url?: string;
  plan_type?: string;
  amount?: number;
}) {
  const db = await readDb();
  const start = new Date();
  const months = getPlanMonths(data.plan_type);
  const end = addMonths(start, months);
  const member: Member = {
    id: randomUUID(),
    name: data.name,
    phone: data.phone || null,
    photo_url: data.photo_url || null,
    subscription_start: toDateString(start),
    subscription_end: toDateString(end),
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.members.push(member);
  db.subscriptions.push({
    id: randomUUID(),
    member_id: member.id,
    plan_type: (data.plan_type as Subscription["plan_type"]) || "monthly",
    start_date: toDateString(start),
    end_date: toDateString(end),
    status: "active",
    amount: data.amount ?? 100,
    created_at: new Date().toISOString(),
  });
  await writeDb(db);
  return member;
}

export async function updateMember(id: string, data: Partial<Member>) {
  const db = await readDb();
  const i = db.members.findIndex((m) => m.id === id);
  if (i < 0) return null;
  db.members[i] = { ...db.members[i], ...data, updated_at: new Date().toISOString() };
  await writeDb(db);
  return db.members[i];
}

export async function deleteMember(id: string) {
  const db = await readDb();
  db.members = db.members.filter((m) => m.id !== id);
  db.subscriptions = db.subscriptions.filter((s) => s.member_id !== id);
  db.payments = db.payments.filter((p) => p.member_id !== id);
  db.attendance = db.attendance.filter((a) => a.member_id !== id);
  await writeDb(db);
}

export async function listSubscriptions(status?: string) {
  const db = await readDb();
  let subs = db.subscriptions.map((s) => ({
    ...s,
    member: db.members.find((m) => m.id === s.member_id),
  }));
  if (status) subs = subs.filter((s) => s.status === status);
  return subs.sort((a, b) => b.end_date.localeCompare(a.end_date));
}

export async function createSubscription(data: {
  member_id: string;
  plan_type?: string;
  amount?: number;
}) {
  const db = await readDb();
  const start = new Date();
  const months = getPlanMonths(data.plan_type);
  const end = addMonths(start, months);
  const sub: Subscription = {
    id: randomUUID(),
    member_id: data.member_id,
    plan_type: (data.plan_type as Subscription["plan_type"]) || "monthly",
    start_date: toDateString(start),
    end_date: toDateString(end),
    status: "active",
    amount: data.amount ?? 100,
    created_at: new Date().toISOString(),
  };
  db.subscriptions.push(sub);
  const m = db.members.find((x) => x.id === data.member_id);
  if (m) {
    m.subscription_start = sub.start_date;
    m.subscription_end = sub.end_date;
    m.status = "active";
    m.updated_at = new Date().toISOString();
  }
  await writeDb(db);
  return { ...sub, member: m };
}

export async function listPayments() {
  const db = await readDb();
  const payments = db.payments
    .map((p) => ({ ...p, member: db.members.find((m) => m.id === p.member_id) }))
    .sort((a, b) => b.payment_date.localeCompare(a.payment_date));
  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  return { payments, totalRevenue };
}

export async function createPayment(data: {
  member_id: string;
  amount: number;
  payment_date?: string;
  method?: string;
  notes?: string;
}) {
  const db = await readDb();
  const payment: Payment = {
    id: randomUUID(),
    member_id: data.member_id,
    amount: data.amount,
    payment_date: data.payment_date || toDateString(new Date()),
    method: (data.method as Payment["method"]) || "cash",
    notes: data.notes || null,
    created_at: new Date().toISOString(),
  };
  db.payments.push(payment);
  await writeDb(db);
  return { ...payment, member: db.members.find((m) => m.id === data.member_id) };
}

export async function listAttendance() {
  const db = await readDb();
  return db.attendance
    .map((a) => ({ ...a, member: db.members.find((m) => m.id === a.member_id) }))
    .sort((a, b) => b.check_in.localeCompare(a.check_in))
    .slice(0, 100);
}

export async function createAttendance(member_id: string) {
  const db = await readDb();
  const row: Attendance = {
    id: randomUUID(),
    member_id,
    check_in: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  db.attendance.push(row);
  await writeDb(db);
  return { ...row, member: db.members.find((m) => m.id === member_id) };
}

export async function getLatePayments(filters: {
  search?: string;
  month?: number;
  year?: number;
  status?: "all" | "expired" | "expiring";
}) {
  const { buildLatePaymentItems } = await import("./late-payments");
  const db = await readDb();
  return buildLatePaymentItems(db.members, db.subscriptions, filters);
}

export async function getDashboardStats() {
  const db = await readDb();
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const monthlyRevenue = db.payments
    .filter((p) => p.payment_date >= monthStart)
    .reduce((s, p) => s + Number(p.amount), 0);
  const pendingOrders = db.orders.filter((o) => o.status === "pending").length;
  return {
    totalMembers: db.members.length,
    activeSubscriptions: db.members.filter((m) => m.status === "active").length,
    expiredSubscriptions: db.members.filter((m) => m.status === "expired").length,
    monthlyRevenue,
    totalProducts: db.products.length,
    pendingOrders,
    shopRevenue: db.orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total), 0),
  };
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listProducts(filters?: {
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  let list = (await readDb()).products;
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (filters?.category) list = list.filter((p) => p.category === filters.category);
  if (filters?.featured) list = list.filter((p) => p.featured);
  return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getProductBySlug(slug: string) {
  return (await readDb()).products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  return (await readDb()).products.find((p) => p.id === id) ?? null;
}

export async function createProduct(data: Omit<Product, "id" | "created_at" | "slug"> & { slug?: string }) {
  const db = await readDb();
  const product: Product = {
    id: randomUUID(),
    slug: data.slug || slugify(data.name),
    created_at: new Date().toISOString(),
    ...data,
  };
  db.products.push(product);
  await writeDb(db);
  return product;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const db = await readDb();
  const i = db.products.findIndex((p) => p.id === id);
  if (i < 0) return null;
  db.products[i] = { ...db.products[i], ...data };
  await writeDb(db);
  return db.products[i];
}

export async function deleteProduct(id: string) {
  const db = await readDb();
  db.products = db.products.filter((p) => p.id !== id);
  await writeDb(db);
}

export async function listOrders() {
  const db = await readDb();
  return db.orders
    .map((o) => ({
      ...o,
      items: db.order_items.filter((i) => i.order_id === o.id),
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes?: string;
  items: { product_id: string; slug?: string; quantity: number }[];
}) {
  const db = await readDb();
  let total = 0;
  const lineItems: OrderItem[] = [];

  for (const item of data.items) {
    const product =
      db.products.find((p) => p.id === item.product_id) ??
      (item.slug ? db.products.find((p) => p.slug === item.slug) : undefined);
    if (!product) throw new Error(`Product not found: ${item.product_id}`);
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    lineItems.push({
      id: randomUUID(),
      order_id: "",
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const order: Order = {
    id: randomUUID(),
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_address: data.customer_address,
    status: "pending",
    total,
    payment_method: "cod",
    notes: data.notes || null,
    created_at: new Date().toISOString(),
  };

  db.orders.push(order);
  for (const li of lineItems) {
    li.order_id = order.id;
    db.order_items.push(li);
  }
  await writeDb(db);
  return { ...order, items: lineItems };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const db = await readDb();
  const i = db.orders.findIndex((o) => o.id === id);
  if (i < 0) return null;
  db.orders[i].status = status;
  await writeDb(db);
  return {
    ...db.orders[i],
    items: db.order_items.filter((x) => x.order_id === id),
  };
}
