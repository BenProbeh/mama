# הגדרת שמירה (2 דקות) – Upstash

## 1. צור מסד (חינם)

1. [console.upstash.com](https://console.upstash.com) → התחבר (Google/GitHub)
2. **Create Database** → שם: `kasenia` → **Create**
3. בטאב **REST API** העתק:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**

## 2. הדבק בקוד

פתח **`js/storage-config.js`**:

```javascript
const UPSTASH_REDIS_REST_URL = 'https://xxxx.upstash.io';
const UPSTASH_REDIS_REST_TOKEN = 'AXxxxx...';
```

## 3. Git push (ראה GIT-PUSH.md)

## 4. בדיקה

- https://mama-7gwi.vercel.app/admin.html → טבלה עם הזמנות
- ממובייל: מלאי את האתר → בלי שגיאה
