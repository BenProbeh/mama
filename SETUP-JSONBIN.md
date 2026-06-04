# JSONBin – חינם, ~2 דקות (מובייל + אדמין)

1. היכנס ל-[jsonbin.io](https://jsonbin.io) → **Sign Up** (חינם)
2. **API Keys** → העתק **X-Master-Key**
3. **Bins** → **Create Bin** → תוכן: `[]` → שמור
4. העתק **Bin ID** מהכתובת (המחרוזת אחרי `/b/`)

5. פתח `js/storage-config.js`:

```javascript
const JSONBIN_BIN_ID = 'הדבק Bin ID';
const JSONBIN_API_KEY = 'הדבק X-Master-Key';
```

6. Git push (ראה GIT-PUSH.md)

7. בדוק: https://mama-7gwi.vercel.app/admin.html

**לא צריך Vercel Redis ולא תשלום.**
