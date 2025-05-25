import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../../services/recipeService';
import { getReviewStats } from '../../services/reviewService';
import './RecipeDetail.css';
import DirectionsSection from './section/DirectionsSection';
import HeaderSection from './section/HeaderSection';
import InfoSection from './section/InfoSection';
import IngredientsSection from './section/IngredientsSection';
import MediaSection from './section/MediaSection';
import ReviewsSection from './section/ReviewsSection';
import { getReviewsByRecipe } from '../../services/reviewService';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    starCounts: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    }
  });
  const [distribution, setDistribution] = useState([]);
  const [reviews, setReviews] = useState([]);

  // get recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) {
        setError('Không tìm thấy ID công thức');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const recipeData = await getRecipeById(recipeId);
        setRecipe(recipeData);
      } catch(error) {
        console.error('Lỗi khi tải dữ liệu công thức:', error);
        setError('Không thể tải thông tin công thức. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, []);

  // get review stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getReviewStats(recipeId);
        
        const dist = [5, 4, 3, 2, 1].map(star => ({
            stars: star,
            count: data.starCounts[star]
        }));
        setStats(data);
        setDistribution(dist);
      } catch (error) {
          console.error('Error fetching review stats:', error);
      } finally {
          setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="rdpage-container">Đang tải...</div>;
  }

  if (error) {
    return <div className="rdpage-container">{error}</div>;
  }

  if (!recipe) {
    return <div className="rdpage-container">Không tìm thấy công thức</div>;
  }

  return (
    <div className="rdpage-container">
      <div>
        <HeaderSection recipe={recipe} stats={stats}/>
        
        <MediaSection recipe={recipe}/>
        
        <InfoSection recipe={recipe} />
        
        <IngredientsSection 
          ingredients={recipe.ingredients}
        />
        
        <DirectionsSection recipe={recipe}/>
        
        <ReviewsSection recipe={recipe} stats={stats} distribution={distribution} reviews={reviews} />
      </div>
    </div>
  );
};

export default RecipeDetail;