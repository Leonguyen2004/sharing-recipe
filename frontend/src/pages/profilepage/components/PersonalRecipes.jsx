import { useState } from "react"
import RecipeCard from "../../../components/recipe/RecipeCard"
import IconButton from "../../../components/button/IconButton"
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom";

const PersonalRecipes = () => {
    const naviagate = useNavigate();
  // Mock data - will be fetched from API later
  const [personalRecipes, setPersonalRecipes] = useState([
    {
      id: 1,
      title: "Homemade Pasta with Fresh Tomato Sauce",
      category: "ITALIAN",
      timeAgo: "2 DAYS AGO",
      rating: 4.9,
      ratingCount: 28,
      image: "https://placehold.co/400x400",
      isPublished: true,
    },
    {
      id: 2,
      title: "Spicy Thai Basil Chicken",
      category: "ASIAN",
      timeAgo: "1 WEEK AGO",
      rating: 4.7,
      ratingCount: 15,
      image: "https://placehold.co/400x400",
      isPublished: true,
    },
    {
      id: 3,
      title: "Classic French Onion Soup",
      category: "FRENCH",
      timeAgo: "2 WEEKS AGO",
      rating: 4.5,
      ratingCount: 12,
      image: "https://placehold.co/400x400",
      isPublished: true,
    },
    {
      id: 4,
      title: "Chocolate Lava Cake",
      category: "DESSERT",
      timeAgo: "1 MONTH AGO",
      rating: 5.0,
      ratingCount: 32,
      image: "https://placehold.co/400x400",
      isPublished: false,
    },
  ])

  const handleCreateRecipe = () => {
    naviagate('/recipeform');
    console.log("Create new recipe")
  }

  return (
    <>
      <div className="ppage-personal-recipes-header">
        <h1>My Personal Recipes</h1>
        <IconButton variant="primary" className="ppage-create-recipe-btn" onClick={handleCreateRecipe}>
          <Plus size={18} />
          CREATE RECIPE
        </IconButton>
      </div>

      <p className="ppage-description">
        Manage your personal recipes. You can create, edit, and publish your own recipes to share with the community.
      </p>

      {personalRecipes.length > 0 ? (
        <>
          <div className="ppage-recipe-section">
            <h2>Published Recipes</h2>
            <div className="ppage-recipes-grid">
              {personalRecipes
                .filter((recipe) => recipe.isPublished)
                .map((recipe) => (
                  <div key={recipe.id} className="ppage-recipe-card-wrapper">
                    <RecipeCard variant="latest" recipe={recipe} />
                    <div className="ppage-recipe-actions">
                      <button className="ppage-recipe-action-btn">Edit</button>
                      <button className="ppage-recipe-action-btn ppage-recipe-action-danger">Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="ppage-empty-state">
          <div className="ppage-empty-icon">📝</div>
          <h3>You haven't created any recipes yet</h3>
          <p>Share your culinary creations with the community by creating your first recipe.</p>
          <IconButton variant="primary" className="ppage-create-recipe-btn" onClick={handleCreateRecipe}>
            <Plus size={18} />
            CREATE YOUR FIRST RECIPE
          </IconButton>
        </div>
      )}
    </>
  )
}

export default PersonalRecipes
