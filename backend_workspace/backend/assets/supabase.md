# Supabase Integration for FastAPI Backend

This backend uses Supabase as the primary data store for recipes. 

## Integration Steps

1. Install the Supabase Python Client (`supabase`), `asyncpg`, and `python-dotenv` for database and environment variable management:
   ```
   pip install supabase asyncpg python-dotenv
   ```
2. Add `.env` to the root of your backend with these variables:
   ```
   SUPABASE_URL=https://uwyapabfhuztzmjfsvif.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eWFwYWJmaHV6dHptamZmdmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODcyMjksImV4cCI6MjA2NTM2MzIyOX0.tehSk7Aks6iWBO7w269DcPTw7gOX4G5NJR2_GIq_QVc
   ```
   (Do not hardcode secrets in Python files.)

3. Recipe data is expected in the `recipes` table in Supabase with at least the following fields:
   - `id` (UUID or INTEGER, primary key)
   - `title` (TEXT)
   - `ingredients` (TEXT or JSON)
   - `instructions` (TEXT)
   - `image_url` (TEXT, optional)
   - `tags` (TEXT or ARRAY, optional)

4. The backend will use Supabase REST endpoints for most queries.

## Usage in FastAPI

- Use the Python Supabase SDK or HTTP requests to interact with Supabase.
- To connect: 
  ```python
  from supabase import create_client
  import os
  supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])
  ```
