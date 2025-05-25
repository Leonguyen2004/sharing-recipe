import { useEffect, useState } from "react"
import AdminRecipeCard from "../../../components/recipe/AdminRecipeCard"
import IconButton from "../../../components/button/IconButton"
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { getUserRecipes } from "../../../services/recipeService";

const PersonalRecipes = ({user}) => {
  const naviagate = useNavigate();
  const [publishedRecipes, setPublishedRecipes] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  useEffect(() => {
    const fetchPersonalRecipes = async () => {
      try {
        const response = await getUserRecipes(user.uid);
        const publicRecipes = response.filter(recipe => recipe.status === 'public');
        const pendingRecipes = response.filter(recipe => recipe.status === 'pending' || recipe.status === 'reject');
        setPublishedRecipes(publicRecipes);
        setPendingRecipes(pendingRecipes);
      } catch (error) {
        console.error('Error fetching personal recipes:', error);
      }
    }
    fetchPersonalRecipes()
  }, [])

  const handleCreateRecipe = () => {
    naviagate('/recipe-form');
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

      {publishedRecipes.length > 0 || pendingRecipes.length > 0 ? (
        <>
          <div className="ppage-recipe-section">
            <h2 className="ppage-recipe-header">Published Recipes</h2>
            <div className="ppage-recipes-grid">
              {publishedRecipes
                .map((recipe) => (
                  <div key={recipe.id} className="ppage-recipe-card-wrapper">
                    <AdminRecipeCard recipe={recipe} />
                    <div className="ppage-recipe-actions">
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="ppage-recipe-section">
            <h2 className="ppage-recipe-header">Pending Recipes</h2>
            <div className="ppage-recipes-grid">
              {pendingRecipes
                .map((recipe) => (
                  <div key={recipe.id} className="ppage-recipe-card-wrapper">
                    <AdminRecipeCard recipe={recipe} />
                    <div className="ppage-recipe-actions">
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
