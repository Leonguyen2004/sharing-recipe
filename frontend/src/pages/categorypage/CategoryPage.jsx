import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RPRecipeCard } from '../../components/recipe/RPRecipeCard';
import { useCategories } from '../../context/CategoryContext';
import { getAllRecipes } from '../../services/recipeService';
import styles from './CategoryPage.module.css';

const renderRecipeRows = (recipes) => {
  return (
    <div className={styles.gridRecipe}>
      {recipes.map((recipe) => (
        <RPRecipeCard key={recipe.id} recipe={recipe} className={"horizontal"}/>
      ))}
    </div>
  )
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { categories } = useCategories();
  const [category, setCategory] = useState({});
  const [searchedRecipe, setSearchedRecipe] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    try {
      const params = {
        categories: categoryId,
        limit: "4",
        sortBy: "createdAt",
        sortOrder: "desc",
        status: "public",
      }
      const response = await getAllRecipes(params);
      setSearchedRecipe(response.data);
      setPagination(response.pagination)
    } catch(error) {
      console.log("error fetch search data", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchMoreRecipes = async () => {
    try {
      const params = {
        categories: categoryId,
        limit: "4",
        sortBy: "createdAt",
        sortOrder: "desc",
        status: "public"
      }
      if (pagination.hasNext) {
        params.startAfter = pagination.nextPage
      }
      const response = await getAllRecipes(params);
      setSearchedRecipe(prev => [...prev, ...response.data]);
      setPagination(response.pagination)
    } catch(error) {
      console.log("error fetch search data", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if (categories.length === 0) return; // tránh lỗi khi chưa load xong
  
    const found = categories.find(cat => cat.id === categoryId);
    setCategory(found || {});
  }, [categoryId, categories]);
  
  useEffect(() => {
    if (categoryId) {
      fetchRecipes();
    }
  }, [categoryId])


  if (loading && !category) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className={styles.categoryPageContainer}>
      {/* Hero section with category image */}
      <div className={styles.heroSection}>
        <img src={category.imageUrl} className={styles.heroImage}/>
      </div>

      {/* Category header information */}
      <div className={styles.header}>
        <p className={styles.headerLabel}>RECIPES CATEGORY</p>
        <h1 className={styles.headerTitle}>{category?.name} Recipes</h1>
      </div>

      <div className={styles.recipeSection}>
        {renderRecipeRows(searchedRecipe)}
      </div>
      {pagination.hasNext && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreButton} onClick={fetchMoreRecipes}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;