# نشر مجاني — Atlas Agdez Gym (بلا دومين، بلا فلوس)

الموقع غادي يخدم على رابط مجاني مثل: `https://atlas-agdez.vercel.app`  
**ما خاصكش Hostinger ولا دومين.**

---

## شنو نقدر ندير أنا (الذكاء الاصطناعي) وشنو خاصك نتا

| أنا | نتا (5–15 دقيقة) |
|-----|------------------|
| تجهيز الكود، السكربت، الـ schema | حساب GitHub (مجاني) |
| نقل البيانات من `data/atlasgym.json` → Supabase | حساب Supabase (مجاني) |
| شرح متغيرات Vercel | حساب Vercel (مجاني) + ربط GitHub |

**ما نقدرش ندخل بحساباتك** (Vercel / Supabase / GitHub) من جهازك — خاصك تسجّل وترسل ليا المفاتيح أو تلصقهم فـ Vercel.

---

## الخطوة 1 — GitHub

1. [github.com](https://github.com) → حساب جديد (مجاني).
2. **New repository** → اسم مثلاً `atlas-agdez-gym` → Private أو Public.
3. فالمجلد ديال المشروع (PowerShell):

```powershell
cd C:\Users\hp\Desktop\project
git add .
git commit -m "Atlas Agdez Gym — site + dashboard"
git branch -M main
git remote add origin https://github.com/USERNAME/atlas-agdez-gym.git
git push -u origin main
```

(بدّل `USERNAME` باسمك.)

---

## الخطوة 2 — Supabase (قاعدة البيانات)

1. [supabase.com](https://supabase.com) → **New project** (مجاني).
2. **SQL Editor** → نسخ ولصق محتوى:
   - `supabase/schema.sql`
   - ثم `supabase/patch-existing.sql` (إلا كان عندك مشروع قديم)
3. **Project Settings → API** → انسخ:
   - Project URL
   - `anon` key
   - `service_role` key (سري — ما تشاركوش فالعام)

4. فـ `.env.local` عندك محلياً:

```env
USE_LOCAL_DB=false
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
AUTH_SECRET=سلسلة-عشوائية-طويلة-32-حرف-على-الأقل
NEXT_PUBLIC_SITE_URL=http://localhost:3000
COOKIE_SECURE=false
```

5. نقل البيانات من الجهاز ديالك:

```powershell
node scripts/migrate-to-supabase.js --skip-demo
```

`--skip-demo` = ما ينقلش الأعضاء التجريبيين (0609...). بلاها ينقل كلشي.

---

## الخطوة 3 — Vercel (الموقع على الإنترنت)

1. [vercel.com](https://vercel.com) → تسجيل بـ GitHub.
2. **Add New → Project** → اختار repo `atlas-agdez-gym`.
3. **Environment Variables** (نفس القيم ديال `.env.local` ما عدا):

| المتغير | القيمة |
|---------|--------|
| `USE_LOCAL_DB` | `false` |
| `NEXT_PUBLIC_SUPABASE_URL` | من Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | من Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | من Supabase |
| `AUTH_SECRET` | نفس السر المحلي |
| `NEXT_PUBLIC_SITE_URL` | `https://اسم-مشروعك.vercel.app` (بعد أول deploy) |
| `COOKIE_SECURE` | `true` على Vercel (HTTPS) |

4. **Deploy** → انتظر 2–3 دقائق.

5. الدخول: نفس الإيميل/الهاتف ديالك (`mbahmou@gmail.com` / `0687048566`) والباسورد اللي عندك.

إلا ما كانش admin فـ Supabase:

```powershell
curl -X POST https://اسم-مشروعك.vercel.app/api/auth/setup -H "Content-Type: application/json" -d "{\"email\":\"mbahmou@gmail.com\",\"password\":\"admin123\",\"phone\":\"0687048566\"}"
```

(غير مرة واحدة.)

---

## ملاحظات مهمة

- **الصور المرفوعة من الداشبورد** (`public/uploads/`) على Vercel **ما كتبقاش** بعد إعادة النشر. المنتجات ديالك تستعمل روابط Unsplash — مزيان. صور الأعضاء: لاحقاً Supabase Storage.
- **ما تحتاجش دومين**: شارك رابط `*.vercel.app` فـ WhatsApp.
- **مجاني**: Vercel Hobby + Supabase Free (حدود كافية لقاعة واحدة).

---

## باش نكمّلو مع بعض

بعد ما تخلق Supabase، صيفط ليا (فالشات) **بلا ما تشارك service_role فالعام** إلا بغيتي:

1. Project URL  
2. أو حطهم فـ `.env.local` وقول ليا: «جاهز للنقل» — غادي نشغّل `migrate-to-supabase.js` من هنا.

وبعد Vercel deploy، صيفط رابط `https://....vercel.app` باش نتأكد أن كلشي خدام.
