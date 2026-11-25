# CARTY – אפליקציית קארפול חכמה לאירועים

מערכת המחברת בין נהגים לטרמפיסטים המגיעים לאותו אירוע, תוך שמירה על פרטיות המשתמשים עד לאישור הנסיעה.

---

## מבנה תיקיות התשתית (שלב ג1)
* `frontend/` – ממשק המשתמש ב-**React + Vite** (פורט `5173`)
* `backend/` – שרת ה-API ב-**Python + FastAPI** (פורט `8000`)
* `supabase/` – סכמת בסיס הנתונים (`schema.sql`) להרצה ב-Supabase
* `docker-compose.yml` – הגדרת והרצת שני המיכלים (`frontend` ו-`backend`)
* `.env.example` – תבנית למשתני הסביבה החסויים (הקובץ `.env` האמיתי נשמר מקומית ומוחרג ב-`.gitignore`)

---

## דרישות מוקדמות
1. התקנת **Docker Desktop** (וודאו שהוא פועל ברקע לפני הרצת הפקודות).
2. **Git** מותקן במחשב.
3. חשבון וגישה לפרויקט המשותף ב-**Supabase**.

---

## הוראות התקנה והרצה מקומית

### 1. שכפול המאגר (Clone)
```bash
git clone <GITHUB_REPO_URL>
cd carty
```

### 2. הגדרת קובץ הסודות (`.env`)
צרו קובץ בשם `.env` בתיקיית השורש (או העתיקו מתוך `.env.example`):
```bash
cp .env.example .env
```
פתחו את `.env` והזינו את הערכים מתוך פרויקט ה-Supabase המשותף (`Project Settings -> API`):
```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_KEY=YOUR_SUPABASE_KEY
VITE_API_URL=http://localhost:8000
```
> ⚠️ **חשוב:** הקובץ `.env` מופיע ב-`.gitignore` ואסור להעלות אותו ל-GitHub!

### 3. בנייה והרצה עם Docker Compose
הריצו בטרמינל מתוך תיקיית השורש (`carty/`):
```bash
docker compose up --build
```
לאחר שהמיכלים עולים:
* **Frontend:** פתחו בדפדפן את `http://localhost:5173`
* **Backend API / Swagger Docs:** זמין בכתובת `http://localhost:8000/docs`

לעצירת השירותים:
```bash
docker compose down
```

---

## נוהל עבודה בצוות עם Git ו-Pull Requests (PR)
1. **אין לדחוף קוד ישירות לענף `main`!** העבודה מתבצעת אך ורק בענפים נפרדים.
2. לפני תחילת משימה:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/<your-name>-<task>
   ```
3. בסיום העבודה והבדיקה מקומית (`docker compose up --build`):
   ```bash
   git add .
   git commit -m "תיאור ברור של השינוי"
   git push -u origin feature/<your-name>-<task>
   ```
4. פותחים **Pull Request** ב-GitHub לענף `main`, וראש הצוות (או חבר צוות נוסף) סוקר ומאשר את המיזוג.

---

## חלוקת בדיקות התשתית בצוות (שלב ג1 – E2E)
כל חבר צוות פותח ענף נפרד ומוסיף/מבצע בדיקת קריאה או כתיבה מול Supabase ממסך הפתיחה:
* **נריה אלבז:** הקמת השלד, Docker Compose, חיבור בסיסי ונקודות קצה `/api/health` ו-`/api/infra-checks`.
* **אייל מרסיאנו:** הוספת בקשת בדיקה ממסך הפתיחה (למשל סינון/קריאה לפי שם אירוע או חבר צוות).
* **יוסף שמידט:** הוספת בקשת בדיקה ממסך הפתיחה (למשל עדכון/קריאת סטטוס בדיקה).
* **נועם נהוראי אלון:** הוספת בקשת בדיקה ממסך הפתיחה (למשל ספירת רשומות או חיפוש).
* **מאיר פיינטוך:** הוספת בקשת בדיקה ממסך הפתיחה (למשל מחיקת רשומת בדיקה או תצוגת סטטיסטיקה).
