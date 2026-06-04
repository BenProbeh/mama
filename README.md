# הדייט השבועי שלנו 💜

**אתר באוויר:** https://mama-7gwi.vercel.app/  
**אדמין (נתונים):** https://mama-7gwi.vercel.app/admin.html

## שמירת נתונים (חובה פעם אחת)

עקוב אחרי **[SETUP-SUPABASE.md](SETUP-SUPABASE.md)** – 5 דקות.

הדבק מפתחות ב-`js/supabase-config.js` → `git push`.

## מקומי

```bash
npm install
npm start
```

→ http://localhost:3000

## מבנה

| קובץ | תפקיד |
|------|--------|
| `js/supabase-config.js` | **מפתחות Supabase** |
| `js/booking.js` | שמירת בחירות (מובייל + מחשב) |
| `admin.html` | צפייה בכל ההזמנות |
| `api/` | גיבוי לשרת (אופציונלי) |
