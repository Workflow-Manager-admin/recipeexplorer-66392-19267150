import os
from supabase import create_client, Client
from dotenv import load_dotenv

_SUPABASE_CLIENT: Client = None


# PUBLIC_INTERFACE
def get_supabase() -> Client:
    """
    Returns the Supabase client configured from environment variables (.env).
    Loads .env for SUPABASE_URL and SUPABASE_KEY.
    Singleton client.
    """
    global _SUPABASE_CLIENT
    if _SUPABASE_CLIENT is None:
        load_dotenv()
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY in environment")
        _SUPABASE_CLIENT = create_client(url, key)
    return _SUPABASE_CLIENT
