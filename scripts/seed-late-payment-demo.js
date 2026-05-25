const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const dbPath = path.join(process.cwd(), "data", "atlasgym.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

const firstNames = [
  "أحمد", "محمد", "يوسف", "علي", "إلياس", "أيوب", "حمزة", "سعيد", "عمر", "رضا",
  "مروان", "نزار", "أنس", "ياسين", "طارق", "كريم", "بلال", "هشام", "سفيان", "نبيل",
  "سمير", "عبدالله", "إسماعيل", "يونس", "إدريس", "خالد", "مصطفى", "رشيد", "جواد", "مراد",
  "سارة", "مريم", "فاطمة", "هدى", "نادية", "سلمى", "إيمان", "كوثر", "صفاء", "حنان",
];
const lastNames = [
  "المرابط", "أيت باها", "الحمداوي", "العلمي", "الناصري", "بناني", "أيت عمر", "الزروالي",
  "الكدالي", "الوردي", "أيت سعيد", "الصحراوي", "الجبلي", "المراكشي", "الفيلالي", "الشرقاوي",
];

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(base, days) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date;
}

const oldSeedIds = new Set(
  (db.members || [])
    .filter((member) => member.phone && member.phone.startsWith("0609"))
    .map((member) => member.id)
);

db.members = (db.members || []).filter((member) => !oldSeedIds.has(member.id));
db.subscriptions = (db.subscriptions || []).filter((sub) => !oldSeedIds.has(sub.member_id));
db.payments = (db.payments || []).filter((payment) => !oldSeedIds.has(payment.member_id));
db.attendance = (db.attendance || []).filter((row) => !oldSeedIds.has(row.member_id));

const today = new Date();
const members = [];
const subscriptions = [];
const payments = [];

for (let i = 1; i <= 100; i += 1) {
  const id = randomUUID();
  const name = `${firstNames[(i - 1) % firstNames.length]} ${lastNames[(i - 1) % lastNames.length]}`;
  const phone = `0609${String(i).padStart(6, "0")}`;

  let daysRemaining;
  if (i <= 35) {
    daysRemaining = -((i % 30) + 1); // منتهي منذ 1 إلى 30 يوم
  } else if (i <= 75) {
    daysRemaining = (i % 10) + 1; // باقي 1 إلى 10 أيام
  } else {
    daysRemaining = 11 + (i % 20); // نشط وما يطلعش في تأخرات الدفع
  }

  const endDate = addDays(today, daysRemaining);
  const startDate = addDays(endDate, -30);
  const status = daysRemaining < 0 ? "expired" : "active";
  const now = new Date().toISOString();

  members.push({
    id,
    name,
    phone,
    photo_url: null,
    subscription_start: toDateString(startDate),
    subscription_end: toDateString(endDate),
    status,
    created_at: now,
    updated_at: now,
  });

  const amount = i % 4 === 0 ? 250 : 100;

  subscriptions.push({
    id: randomUUID(),
    member_id: id,
    plan_type: "monthly",
    start_date: toDateString(startDate),
    end_date: toDateString(endDate),
    status,
    amount,
    created_at: now,
  });

  payments.push({
    id: randomUUID(),
    member_id: id,
    amount,
    payment_date: toDateString(today),
    method: "cash",
    notes: "دفعة تجريبية لإظهار الإيراد الشهري",
    created_at: now,
  });
}

db.members.push(...members);
db.subscriptions.push(...subscriptions);
db.payments.push(...payments);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Seeded ${members.length} demo members for late payments.`);
