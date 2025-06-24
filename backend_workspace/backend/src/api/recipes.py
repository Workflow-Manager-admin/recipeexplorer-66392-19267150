from typing import List, Optional, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from .supabase_client import get_supabase

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"],
)


# PUBLIC_INTERFACE
class RecipeSummary(BaseModel):
    """Represents a summary view of a recipe (for listing/search)."""
    id: Any = Field(
        ...,
        description="Unique identifier for the recipe"
    )
    title: str = Field(
        ...,
        description="Recipe title"
    )
    image_url: Optional[str] = Field(
        None,
        description="URL of recipe image, if available"
    )
    tags: Optional[List[str]] = Field(
        None,
        description="Tags/category for the recipe"
    )


# PUBLIC_INTERFACE
class RecipeDetail(BaseModel):
    """Represents the full detail for a single recipe."""
    id: Any = Field(
        ...,
        description="Unique identifier for the recipe"
    )
    title: str = Field(
        ...,
        description="Recipe title"
    )
    ingredients: Any = Field(
        ...,
        description="List of ingredients, format as stored in Supabase (Array or JSON)"
    )
    instructions: str = Field(
        ...,
        description="Instructions step by step, in plain text or markdown"
    )
    image_url: Optional[str] = Field(
        None,
        description="URL of recipe image, if available"
    )
    tags: Optional[List[str]] = Field(
        None,
        description="Tags/category for recipe"
    )


# PUBLIC_INTERFACE
@router.get(
    "",
    summary="List all recipes",
    description="Returns a list of all recipes, optionally paginated.",
    response_model=List[RecipeSummary],
    responses={200: {"description": "List of recipes"}}
)
async def list_recipes(
    skip: int = Query(0, description="Number of recipes to skip for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Number of recipes to return")
):
    """
    Returns a paginated list of all recipes in the database.
    """
    supabase = get_supabase()
    query = supabase.table("recipes").select("*").range(skip, skip + limit - 1)
    resp = query.execute()
    if resp.error:
        raise HTTPException(status_code=500, detail=resp.error.message)
    # Map response to RecipeSummary
    results = []
    for rec in resp.data:
        results.append(RecipeSummary(
            id=rec.get("id"),
            title=rec.get("title"),
            image_url=rec.get("image_url"),
            tags=rec.get("tags") if rec.get("tags") else [],
        ))
    return results


# PUBLIC_INTERFACE
@router.get(
    "/search",
    summary="Search recipes",
    description="Search for recipes by title. Returns a list matching recipes (paginated).",
    response_model=List[RecipeSummary],
    responses={200: {"description": "Search results"}},
)
async def search_recipes(
    q: str = Query(..., description="Search query, matches recipes whose titles contain this text"),
    skip: int = Query(0, description="Number of recipes to skip for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Number of recipes to return"),
):
    """
    Search for recipes by title substring.
    Uses Supabase text search (case-insensitive pattern match).
    """
    supabase = get_supabase()
    pattern = f"%{q.lower()}%"
    query = (
        supabase.table("recipes")
        .select("*")
        .ilike("title", pattern)
        .range(skip, skip + limit - 1)
    )
    resp = query.execute()
    if resp.error:
        raise HTTPException(status_code=500, detail=resp.error.message)
    results = []
    for rec in resp.data:
        results.append(RecipeSummary(
            id=rec.get("id"),
            title=rec.get("title"),
            image_url=rec.get("image_url"),
            tags=rec.get("tags") if rec.get("tags") else [],
        ))
    return results


# PUBLIC_INTERFACE
@router.get(
    "/{recipe_id}",
    summary="Get recipe detail",
    description="Retrieves full details on a single recipe by its ID.",
    response_model=RecipeDetail,
    responses={200: {"description": "Recipe detail"}, 404: {"description": "Recipe not found"}},
)
async def get_recipe_detail(recipe_id: Any):
    """
    Retrieves the full detail of a single recipe by ID.
    """
    supabase = get_supabase()
    resp = supabase.table("recipes").select("*").eq("id", recipe_id).single().execute()
    if resp.error:
        if resp.status_code == 406 or resp.status_code == 404:
            raise HTTPException(status_code=404, detail="Recipe not found")
        raise HTTPException(status_code=500, detail=resp.error.message)
    rec = resp.data
    return RecipeDetail(
        id=rec.get("id"),
        title=rec.get("title"),
        ingredients=rec.get("ingredients"),
        instructions=rec.get("instructions"),
        image_url=rec.get("image_url"),
        tags=rec.get("tags") if rec.get("tags") else [],
    )
