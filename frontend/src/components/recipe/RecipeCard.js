import { Heart, Clock } from "lucide-react"
import StarRating from "../starrating/StarRating"
import "./RecipeCard.css"
import { Link } from "react-router-dom"
import IconButton from "../button/IconButton"

const RecipeCard = ({ variant, recipe }) => {
  const handleSaveRecipe = (recipeId) => {
    console.log(`Saving recipe with ID: ${recipeId}`)
  }
  
  const renderLatestVariant = () => (
    <Link to={`/recipe/${recipe.id}`}>
      <div className="rccom-latest-item">
        <div className="rccom-latest-image">
          <img src={recipe.image} alt="Placeholder" />
        </div>
        <div className="rccom-latest-details">
          <div className="rccom-latest-meta">
            <span className="rccom-latest-category">{recipe.category}</span>
            <span className="rccom-latest-time">{recipe.timeAgo}</span>
          </div>
          <h3 className="rccom-latest-title">{recipe.title}</h3>
          <StarRating rating={recipe.rating} count={recipe.ratingCount} size="small" />
        </div>
      </div>
    </Link>
  )

  const renderTrendingVariant = () => (
    <Link to={`/recipe/${recipe.id}`}>
      <div className="rccom-trending-item">
        <div className="rccom-trending-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>
        <div className="rccom-trending-details">
          <span className="rccom-trending-category">{recipe.category}</span>
          <h3 className="rccom-trending-title">{recipe.title}</h3>
          <StarRating rating={recipe.rating} count={recipe.ratingCount} size="small" />
        </div>
      </div>
    </Link>
  )

  const renderFreshVariant = () => (
    <div className="rccom-fresh-item-container">
      <IconButton icon={<Heart size={24} />} variant="saved" onClick={() => handleSaveRecipe(recipe.id)}/>
      <Link to={`/recipe/${recipe.id}`}>
        <div className="rccom-fresh-item">
          <div className="rccom-fresh-image">
            <img src={recipe.image} alt="Placeholder" />
          </div>
          <div className="rccom-fresh-details">
            <div className="rccom-fresh-meta">
              <span className="rccom-fresh-category">{recipe.category}</span>
              <div className="rccom-fresh-time">
                <Clock size={16} />
                <span>{recipe.timeAgo}</span>
              </div>
            </div>
            <h3 className="rccom-fresh-title">{recipe.title}</h3>
            <div className="rccom-fresh-rating">
              <StarRating rating={recipe.rating} count={recipe.ratingCount} size="small" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )

  const renderSavedVariant = () => (
    <Link to={`/recipe/${recipe.id}`}>
      <div className="rccom-saved-item">
        <div className="rccom-saved-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>
        <div className="rccom-saved-details">
          <span className="rccom-saved-category">{recipe.category}</span>
          <h3 className="rccom-saved-title">{recipe.title}</h3>
        </div>
      </div>
    </Link>
  )

  const renderVerticalVariant = () => {
    
  }

  switch (variant) {
    case "latest":
      return renderLatestVariant()
    case "trending":
      return renderTrendingVariant()
    case "fresh":
      return renderFreshVariant()
    case "saved":
      return renderSavedVariant()
    default:
      return renderLatestVariant()
  }
}

export default RecipeCard 