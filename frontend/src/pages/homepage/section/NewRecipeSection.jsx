import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RPRecipeCard } from "../../../components/recipe/RPRecipeCard";
import { useCategories } from "../../../context/CategoryContext";
import { getAllRecipes } from "../../../services/recipeService";
import styles from "./NewRecipeSection.module.css";

export default function NewRecipeSection() {
  const [porkRecipes, setPorkRecipes] = useState([])
  const [chickenRecipes, setChickenRecipes] = useState([])
  const [beefRecipes, setBeefRecipes] = useState([])
  const { categories } = useCategories();
  const [loading, setLoading] = useState(true);
  const [targetCategoryIds, setTargetCategoryIds] = useState({});

  // const targetNames = ['Beef', 'Chicken', 'Pork'];
  // const targetCategoryIds = {};
  // targetNames.forEach(name => {
  //   const found = categories.find(category => category.name === name);
  //   if (found) {
  //     targetCategoryIds[name] = found.id;
  //   }
  // }); 

  useEffect(() => {
    const targetNames = ['Beef', 'Chicken', 'Pork'];
    const categoryIds = {};
  
    if (categories.length > 0) {
      targetNames.forEach(name => {
        const found = categories.find(category => category.name === name);
        if (found) categoryIds[name] = found.id;
      });
      setTargetCategoryIds(categoryIds);
  
      if (!Object.values(categoryIds).every(Boolean)) {
        console.error('Missing some category IDs');
        return;
      }
  
      const fetchAllRecipes = async () => {
        try {
          setLoading(true);
          const [chicken, beef, pork] = await Promise.all([
            getAllRecipes({ categories: categoryIds["Chicken"], limit: "10", sortBy: "createdAt", sortOrder: "desc", status: "public" }),
            getAllRecipes({ categories: categoryIds["Beef"], limit: "10", sortBy: "createdAt", sortOrder: "desc", status: "public" }),
            getAllRecipes({ categories: categoryIds["Pork"], limit: "10", sortBy: "createdAt", sortOrder: "desc", status: "public" }),
          ]);
          setChickenRecipes(chicken.data);
          setBeefRecipes(beef.data);
          setPorkRecipes(pork.data);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllRecipes();
    }
  }, [categories]);
  
  if (loading) return <div>Loading....</div>

  return (
    <div className={styles.container}>
      <RecipeRow title="New Pork Recipe" recipes={porkRecipes} categoryId={targetCategoryIds["Pork"]} />

      <RecipeRow title="New Chicken Recipe" recipes={chickenRecipes} categoryId={targetCategoryIds["Chicken"]} />

      <RecipeRow title="New Beef Recipe" recipes={beefRecipes} categoryId={targetCategoryIds["Beef"]} />
    </div>
  )
}

function RecipeRow({ title, recipes, categoryId }) {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 5
  const navigate = useNavigate();

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(recipes.length - visibleCount, prev + 1))
  }

  const handleViewAll = (e) => {
    e.preventDefault();
    if (categoryId) {
      navigate(`/category/${categoryId}`);
    }
  }

  const visibleRecipes = recipes.slice(startIndex, startIndex + visibleCount)
  const canScrollLeft = startIndex > 0
  const canScrollRight = startIndex < recipes.length - visibleCount

  return (
    <div className={styles.recipeRow}>
      <div className={styles.rowHeader}>
        <h2 className={styles.rowTitle}>{title}</h2>
        <a href="#" className={styles.viewAll} onClick={handleViewAll}>
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
