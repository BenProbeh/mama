# Supabase – חינם (מומלץ, מובייל + אדמין)



1. [supabase.com](https://supabase.com) → פרויקט חדש (חינם)



2. **SQL Editor** → הרץ:



```sql

create table if not exists bookings (

  id bigint primary key,

  cuisine text not null,

  restaurant text not null,

  pickup_time text not null,

  created_at timestamptz not null default now()

);



alter table bookings enable row level security;



create policy "allow_public_read" on bookings for select using (true);

create policy "allow_public_insert" on bookings for insert with check (true);

```



3. **Settings → API** → העתק **Project URL** ו-**anon public**



4. `js/storage-config.js`:



```javascript

const SUPABASE_URL = 'https://xxxxx.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbG...';

```



5. `git push`



6. https://mama-7gwi.vercel.app/admin.html



**לא צריך Redis ב-Vercel.**


