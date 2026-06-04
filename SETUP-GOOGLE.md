# Google Sheets – חינם (מובייל + אדמין)

1. [sheets.google.com](https://sheets.google.com) → גיליון חדש
2. **Extensions** → **Apps Script**
3. מחק הכל → הדבק את הקובץ `google-apps-script/bookings.gs` מהפרויקט
4. **Deploy** → **New deployment** → סוג **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. העתק **Web app URL**

6. ב-`js/storage-config.js`:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/...../exec';
```

7. `git push`

8. admin.html → רענון

**לא צריך Vercel Redis.**
