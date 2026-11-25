import os
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

_client: Optional[Client] = None


def is_supabase_configured() -> bool:
    url = os.getenv("SUPABASE_URL", "").strip()
    key = os.getenv("SUPABASE_KEY", "").strip()
    return bool(url and key and not url.startswith("https://YOUR_PROJECT_ID"))


def get_supabase() -> Optional[Client]:
    """מחזיר חיבור מאותחל ל-Supabase אם מפתחות ה-.env הוגדרו."""
    global _client
    if not is_supabase_configured():
        return None
    if _client is None:
        url = os.getenv("SUPABASE_URL", "").strip()
        key = os.getenv("SUPABASE_KEY", "").strip()
        _client = create_client(url, key)
    return _client
