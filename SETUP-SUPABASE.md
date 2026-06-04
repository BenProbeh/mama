# הגדרה חד-פעמית – 5 דקות (עובד ממובייל + Vercel)

האתר: **https://mama-7gwi.vercel.app/**

## שלב 1 – Supabase (חינם)

1. היכנס ל-[supabase.com](https://supabase.com) → **Start your project** → **New project**
2. שם + סיסמה → **Create new project** (חכה דקה)

## שלב 2 – טבלה

1. **SQL Editor** → **New query**
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

3. לחץ **Run** (חייב להצליח בלי שגיאה)

## שלב 3 – העתק מפתחות

1. **Project Settings** (⚙️) → **API**
2. העתק:
   - **Project URL**
   - **anon** **public** (לא את ה-service_role!)

## שלב 4 – הדבק בפרויקט

פתח **`js/supabase-config.js`** והדבק:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## שלב 5 – העלה ל-Git

```bash
cd "c:\Users\Probeh\OneDrive\Desktop\lll"
git add js/supabase-config.js
git commit -m "Add Supabase keys"
git push
```

Vercel יעדכן אוטומטית תוך ~1 דקה.

## בדיקה

1. **אדמין:** https://mama-7gwi.vercel.app/admin.html  
   → שורה ירוקה "שמירה פעילה (Supabase)"

2. **ממובייל:** מלאי את האתר עד סוף (בחירת שעה)  
3. **רענון אדמין** → הבחירה מופיעה

---

**לא צריך** Environment Variables ב-Vercel – רק הקובץ `supabase-config.js`.

**הקובץ `data/bookings.json` במחשב לא מתעדכן מהאתר באוויר.**
