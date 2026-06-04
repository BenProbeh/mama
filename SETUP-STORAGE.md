# תיקון השגיאה באייפון – הגדרת שמירה (בחר אחת)

השגיאה שראית = **אין עדיין שמירה מוגדרת**.

## הכי מהיר – Formspree (2 דקות) ✉️

1. היכנס ל-[formspree.io](https://formspree.io) → **Sign Up** (חינם)
2. **+ New Form** → שם: `דייט קסניה`
3. העתק את ה-ID מהכתובת, למשל:  
   `https://formspree.io/f/**xyzabcde**` → ה-ID הוא `xyzabcde`
4. פתח **`js/storage-config.js`** והדבק:
   ```javascript
   const FORMSPREE_ID = 'xyzabcde';
   ```
5. שמור → בטרמינל:
   ```bash
   git add js/storage-config.js
   git commit -m "Add Formspree storage"
   git push
   ```
6. חכה דקה ל-Vercel → נסי שוב מהאייפון

**איך תראה נתונים:** מייל לתיבה שלך על כל בחירה + [formspree.io/forms](https://formspree.io/forms)

---

## הכי מלא – Supabase (5 דקות) 📊

רואה הכל ב-[admin.html](https://mama-7gwi.vercel.app/admin.html)

עקוב אחרי **SETUP-SUPABASE.md** והדבק ב-`js/storage-config.js`:
```javascript
const SUPABASE_URL = 'https://....supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';
```

---

## אחרי ההגדרה

- אתר: https://mama-7gwi.vercel.app/
- אדמין: https://mama-7gwi.vercel.app/admin.html
