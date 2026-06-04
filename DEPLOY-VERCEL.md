# פריסה ב-Vercel + שמירת נתונים

## חובה לפני שמשתמשים ממלאים טופס

עקוב אחרי **SETUP-SUPABASE.md** – בלי Supabase (או Redis/Blob) **אין שמירה**.

## העלאת קוד

```bash
git add .
git commit -m "Fix bookings storage"
git push
```

Vercel יבנה מחדש אוטומטית.

## דפים

- אתר: `https://xxx.vercel.app/`
- אדמין: `https://xxx.vercel.app/admin.html`
- בדיקת שרת: `https://xxx.vercel.app/api/health`
