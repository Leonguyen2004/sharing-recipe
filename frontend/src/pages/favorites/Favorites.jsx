import React from 'react';
import RecipeCard from '../../components/recipe/RecipeCard';
import './Favorites.css';

const Favorites = () => {
  // Mock data - sau này sẽ lấy từ API
  const savedRecipes = [
    {
      id: 1,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 1,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },{
      id: 1,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },{
      id: 1,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 1,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
  ];

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Saved Recipes & Collections</h1>
      </div>
      
      <div className="favorites-content">
        <h2>Recently Saved</h2>
        <div className="recipes-grid">
          {savedRecipes.map(recipe => (
            <RecipeCard
              variant='saved'
              recipe={recipe}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites; 