from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.db import get_supabase, is_supabase_configured

app = FastAPI(
    title="CARTY API",
    description="Backend API for CARTY event carpooling app (Stage C1 Infrastructure)",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InfraCheckCreate(BaseModel):
    member_name: str = Field(..., min_length=1, max_length=100, description="שם איש הצוות")
    action_note: str = Field(..., min_length=1, max_length=300, description="תיאור הבדיקה")


@app.get("/api/health")
def health_check():
    """בדיקת תקינות השרת ומצב הגדרת החיבור ל-Supabase."""
    return {
        "status": "ok",
        "service": "carty-backend",
        "supabase_configured": is_supabase_configured(),
    }


@app.get("/api/infra-checks")
def list_infra_checks():
    """קריאת רשומות בדיקת התשתית מתוך Supabase (פעולת READ מקצה לקצה)."""
    sb = get_supabase()
    if sb is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase לא מוגדר עדיין בקובץ .env (יש להזין SUPABASE_URL ו-SUPABASE_KEY).",
        )
    try:
        response = (
            sb.table("infra_checks")
            .select("*")
            .order("created_at", desc=True)
            .limit(20)
            .execute()
        )
        return {"items": response.data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"שגיאה בקריאה מ-Supabase: {exc}")


@app.post("/api/infra-checks", status_code=201)
def create_infra_check(payload: InfraCheckCreate):
    """כתיבת רשומת בדיקת תשתית אל Supabase (פעולת WRITE מקצה לקצה)."""
    sb = get_supabase()
    if sb is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase לא מוגדר עדיין בקובץ .env (יש להזין SUPABASE_URL ו-SUPABASE_KEY).",
        )
    try:
        response = (
            sb.table("infra_checks")
            .insert({
                "member_name": payload.member_name,
                "action_note": payload.action_note,
            })
            .execute()
        )
        return {"created": response.data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"שגיאה בכתיבה ל-Supabase: {exc}")


# ==============================================================================
# מקום לבדיקות E2E נוספות של חברי הצוות (שלב ג1):
# כל חבר צוות פותח Branch נפרד ומוסיף כאן Endpoint + קריאה ממסך הפתיחה ב-Frontend
# ==============================================================================
