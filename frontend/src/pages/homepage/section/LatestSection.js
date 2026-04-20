import React from 'react';
import styles from './LatestSection.module.css';
import { RPRecipeCard } from '../../../components/recipe/RPRecipeCard';
import { useNavigate } from 'react-router-dom';
import { getAllRecipes } from '../../../services/recipeService';
import { useEffect, useState } from 'react';

const LatestSection = () => {
  const navigate = useNavigate();
  const [latestRecipes, setLatestRecipes] = React.useState([]);

  useEffect(() => {
    const fetchTrendingRecipe = async () => {
      const response = await getAllRecipes({
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: "15",
        status: "public"
      })
      setLatestRecipes(response.data)
    } 

    fetchTrendingRecipe();
  }, [])

  const handleViewAll = () => {
    navigate('/recipes?sort=latest');
  };

  return (
    <section className={styles.latestSection}>
      <h1 className={styles.sectionHeader}>
        Latest Recipes
      </h1>
      <div className={styles.recipeGrid}>
        {latestRecipes.map((recipe) => (
          <RPRecipeCard
            key={recipe.id}
            recipe={recipe}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestSection; 