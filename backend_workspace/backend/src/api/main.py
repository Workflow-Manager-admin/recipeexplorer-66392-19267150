from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .recipes import router as recipes_router

APP_TITLE = "Recipe Explorer API"
APP_DESCRIPTION = (
    "Backend REST API for Recipe Explorer app.\n\n"
    "- List all recipes\n"
    "- Search recipes by title\n"
    "- Retrieve recipe details\n"
    "- Data stored in Supabase Postgres DB\n\n"
    "**OpenAPI docs** at `/docs`"
)
APP_VERSION = "1.0.0"


app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    openapi_tags=[
        {
            "name": "Recipes",
            "description": "Operations for listing, searching, and retrieving recipes",
        }
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Meta"])
def health_check():
    """PUBLIC_INTERFACE
    Health check for backend API.
    """
    return {"message": "Healthy", "version": APP_VERSION}


@app.get("/info", tags=["Meta"])
def get_info():
    """PUBLIC_INTERFACE
    Returns API information, endpoints, and docs URL.
    """
    return {
        "title": APP_TITLE,
        "description": "API for browsing/searching recipe data.",
        "docs_url": "/docs"
    }


# FastAPI auto-wires OpenAPI at /docs, /openapi.json, /redoc

app.include_router(recipes_router)
