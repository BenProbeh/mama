# הגדרת שמירת נתונים ב-Vercel (5 דקות) – Supabase

בלי זה **שום בחירה לא נשמרת** באתר שבאוויר.

## שלב 1 – חשבון Supabase (חינם)

1. היכנס ל-[supabase.com](https://supabase.com) → **Start your project**
2. **New project** → שם + סיסמה → **Create**

## שלב 2 – טבלה

1. בתפריט: **SQL Editor** → **New query**
2. הדבק והרץ:

```sql
create table if not exists bookings (
  id bigint primary key,
  cuisine text not null,
  restaurant text not null,
  pickup_time text not null,
  created_at timestamptz not null default now()
);

alter table bookings enable row level security;

create policy "allow_public_read" on bookings
  for select using (true);

create policy "allow_public_insert" on bookings
  for insert with check (true);
```

3. **Run**

## שלב 3 – מפתחות

1. **Project Settings** (גלגל שיניים) → **API**
2. העתק:
   - **Project URL** → זה `SUPABASE_URL`
   - **anon public** key → זה `SUPABASE_ANON_KEY`

## שלב 4 – Vercel

1. [vercel.com](https://vercel.com) → הפרויקט שלך
2. **Settings** → **Environment Variables**
3. הוסף:

| Name | Value |
|------|--------|
| `SUPABASE_URL` | ה-URL שהעתקת |
| `SUPABASE_ANON_KEY` | ה-anon key |

4. סמן **Production**, **Preview**, **Development** → **Save**
5. **Deployments** → הפריסה האחרונה → **⋯** → **Redeploy**

## שלב 5 – Git (אם עדיין לא העלית את הקוד החדש)

```bash
cd "c:\Users\Probeh\OneDrive\Desktop\lll"
git add .
git commit -m "Add Supabase storage for bookings"
git push
```

## בדיקה

פתח: `https://האתר-שלך.vercel.app/api/health`

אמור להופיע:
```json
"ok": true,
"storage": { "ok": true, "type": "supabase" }
```

אחרי שמישהו ממלא את האתר: `https://האתר-שלך.vercel.app/admin.html`

---

**הערה:** הקובץ `data/bookings.json` במחשב **לא** מתעדכן מ-Vercel. הנתונים חיים ב-Supabase ובאדמין.
