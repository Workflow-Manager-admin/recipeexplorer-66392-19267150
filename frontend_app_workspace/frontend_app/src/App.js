import React, { useEffect, useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // State for recipes, search query, and modal
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Fetch all recipes from backend API
    async function fetchRecipes() {
      setLoading(true);
      try {
        // Quick hack: expect backend running at /api/
        const res = await fetch("/api/recipes");
        let data = [];
        if (res.ok) {
          data = await res.json();
        } else {
          // fallback to example data
          data = [
            {
              id: 1,
              title: "Caprese Salad",
              image:
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=400&q=80",
              summary: "A light and refreshing salad with tomatoes, mozzarella, and basil.",
              cook_time: 10,
              difficulty: "Easy",
              ingredients: [
                "2 tomatoes",
                "125g mozzarella",
                "fresh basil",
                "olive oil",
                "salt, pepper"
              ],
              steps: [
                "Slice tomatoes & mozzarella.",
                "Arrange on plate, alternating.",
                "Top with basil, drizzle with olive oil.",
                "Season with salt and pepper."
              ],
            },
            {
              id: 2,
              title: "Vegetable Stir Fry",
              image:
                "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&w=400&q=80",
              summary:
                "Colorful crisp veggies quickly stir fried in a light, savory sauce.",
              cook_time: 20,
              difficulty: "Medium",
              ingredients: [
                "2 cups mixed vegetables",
                "2 tbsp soy sauce",
                "1 tbsp sesame oil",
                "1 tsp ginger, minced",
                "Salt"
              ],
              steps: [
                "Prep and cut all vegetables.",
                "Heat sesame oil in pan, add ginger.",
                "Add vegetables, stir-fry 4-5min.",
                "Add soy sauce, toss, cook 2min."
              ],
            },
            {
              id: 3,
              title: "Spaghetti Carbonara",
              image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&w=400&q=80",
              summary: "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
              cook_time: 25,
              difficulty: "Easy",
              ingredients: [
                "200g spaghetti",
                "2 eggs + 1 yolk",
                "75g pancetta",
                "50g pecorino cheese",
                "Black pepper"
              ],
              steps: [
                "Cook spaghetti.",
                "Cook pancetta in pan.",
                "Beat eggs with cheese & pepper.",
                "Mix hot pasta with pancetta & egg mixture off the heat."
              ]
            }
          ];
        }
        setRecipes(data);
        setFilteredRecipes(data);
      } catch {
        setRecipes([]);
        setFilteredRecipes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Filter recipes on search term
    const term = search.trim().toLowerCase();
    if (!term) {
      setFilteredRecipes(recipes);
      return;
    }
    setFilteredRecipes(
      recipes.filter((r) => r.title.toLowerCase().includes(term) || (r.summary?.toLowerCase().includes(term)))
    );
  }, [search, recipes]);

  // PUBLIC_INTERFACE
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    document.body.style.overflow = "hidden";
  };

  // PUBLIC_INTERFACE
  const closeModal = () => {
    setSelectedRecipe(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="app light-theme">
      <nav className="navbar">
        <div className="container nav-row">
          <div className="logo">
            <span className="logo-symbol" style={{ color: "var(--color-accent)", fontSize:22 }}>🥗</span>
            <span className="logo-txt">Recipe Explorer</span>
          </div>
        </div>
      </nav>
      <main style={{ marginTop: 85 }}>
        <div className="container main-col">
          <SearchBar value={search} onChange={setSearch} />
          {loading ? (
            <div className="loading-state">Loading recipes...</div>
          ) : (
            <RecipeGrid recipes={filteredRecipes} onRecipeClick={handleRecipeClick} />
          )}
        </div>
      </main>
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={closeModal} />
      )}
      <footer className="footer">
        <div className="container">
          <span style={{ color: "var(--text-secondary)" }}>
            © 2024 Recipe Explorer · Powered by React
          </span>
        </div>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar-wrap">
      <input
        className="searchbar"
        type="text"
        placeholder="Search recipes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search recipes"
      />
      <span className="search-icon" aria-hidden>🔍</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function RecipeGrid({ recipes, onRecipeClick }) {
  if (recipes.length === 0)
    return (
      <div className="empty-message">
        No recipes found.
      </div>
    );
  return (
    <div className="recipe-grid">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onClick={() => onRecipeClick(r)} />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function RecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card" tabIndex={0} onClick={onClick} role="button" aria-label={recipe.title}>
      <div className="card-img-wrap">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="card-img"
          loading="lazy"
          style={{ backgroundColor: "var(--color-secondary)", objectFit: "cover" }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{recipe.title}</h3>
        <div className="card-summary">{recipe.summary}</div>
      </div>
      <div className="card-info-row">
        <span className="card-pill">{recipe.cook_time} min</span>
        <span className="card-pill">{recipe.difficulty}</span>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function RecipeModal({ recipe, onClose }) {
  return (
    <div className="modal-overlay" tabIndex={-1} onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" tabIndex={0} onClick={e => e.stopPropagation()}>
        <button className="modal-close" title="Close" aria-label="Close modal" onClick={onClose}>×</button>
        <div className="modal-img-wrap">
          <img src={recipe.image} alt={recipe.title} className="modal-img" />
        </div>
        <h2 className="modal-title">{recipe.title}</h2>
        <div className="modal-summary">{recipe.summary}</div>
        <ul className="modal-meta">
          <li><b>Cook Time:</b> {recipe.cook_time} min</li>
          <li><b>Difficulty:</b> {recipe.difficulty}</li>
        </ul>
        <h4>Ingredients</h4>
        <ul className="modal-list">
          {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
        </ul>
        <h4>Steps</h4>
        <ol className="modal-list">
          {recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
        </ol>
      </div>
    </div>
  );
}

export default App;
