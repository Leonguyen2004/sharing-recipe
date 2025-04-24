import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { RPRecipeCard } from "../../../components/recipe/RPRecipeCard";
import { useCategories } from "../../../context/CategoryContext";
import { useRecipes } from "../../../context/RecipesContext";
import styles from "./NewRecipeSection.module.css";

export default function NewRecipeSection() {
  const [porkRecipes, setPorkRecipes] = useState([])
  const [chickenRecipes, setChickenRecipes] = useState([])
  const [beefRecipes, setBeefRecipes] = useState([])
  const { categories } = useCategories();
  const { recipes } = useRecipes();
  const targetCategoryNames = ["Chicken", "Beef", "Pork"];

  useEffect(() => {
    const categoryIdMap = categories
      .filter(category => targetCategoryNames.includes(category.name))
      .reduce((acc, category) => {
        acc[category.name] = category.id;
        return acc;
      }, {});

    const filterRecipe = () => {
      const allRecipes = recipes;

      // Filter recipes by category
      const pork = allRecipes.filter((recipe) => recipe.categories && recipe.categories.includes(categoryIdMap["Pork"])).slice(0, 10)

      const chicken = allRecipes
        .filter((recipe) => recipe.categories && recipe.categories.includes(categoryIdMap["Chicken"]))
        .slice(0, 10)

      const beef = allRecipes.filter((recipe) => recipe.categories && recipe.categories.includes(categoryIdMap["Beef"])).slice(0, 10)

      setPorkRecipes(pork)
      setChickenRecipes(chicken)
      setBeefRecipes(beef)
    }

    filterRecipe()
  }, [categories])

  return (
    <div className={styles.container}>
      <RecipeRow title="New Pork Recipe" recipes={porkRecipes} />

      <RecipeRow title="New Chicken Recipe" recipes={chickenRecipes} />

      <RecipeRow title="New Beef Recipe" recipes={beefRecipes} />
    </div>
  )
}

function RecipeRow({ title, recipes }) {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 5

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(recipes.length - visibleCount, prev + 1))
  }

  const visibleRecipes = recipes.slice(startIndex, startIndex + visibleCount)
  const canScrollLeft = startIndex > 0
  const canScrollRight = startIndex < recipes.length - visibleCount

  return (
    <div className={styles.recipeRow}>
      <div className={styles.rowHeader}>
        <h2 className={styles.rowTitle}>{title}</h2>
        <a href="#" className={styles.viewAll}>
          View all <span className={styles.arrow}><ChevronRight size={20}/></span>
        </a>
      </div>

      <div className={styles.carouselContainer}>
        <button
          className={`${styles.navButton} ${styles.prevButton} ${!canScrollLeft ? styles.disabled : ""}`}
          onClick={handlePrevious}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.cardsContainer}>
          {visibleRecipes.map((recipe, index) => (
            <div key={recipe.id || index} className={styles.cardWrapper}>
              <RPRecipeCard recipe={recipe} />
            </div>
          ))}

          {/* If we don't have enough recipes, show placeholders */}
          {visibleRecipes.length < visibleCount &&
            Array(visibleCount - visibleRecipes.length)
              .fill(0)
              .map((_, index) => (
                <div key={`placeholder-${index}`} className={styles.cardWrapper}>
                  <div className={styles.placeholder}></div>
                </div>
              ))}
        </div>

        <button
          className={`${styles.navButton} ${styles.nextButton} ${!canScrollRight ? styles.disabled : ""}`}
          onClick={handleNext}
          disabled={!canScrollRight}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
