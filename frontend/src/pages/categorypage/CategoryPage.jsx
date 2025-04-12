import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import RecipeCard from '../../components/recipe/RecipeCard';
import Pagination from '../../components/pagination/Pagination';
import { fetchCategoryData, fetchCategoryRecipes } from './recipeService';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 21; // 3 recipes per row, 7 rows
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        // Load category data
        const categoryData = await fetchCategoryData(categoryId);
        setCategory(categoryData);

        // Load latest recipes for this category (just 5)
        const latest = await fetchCategoryRecipes(categoryId, { 
          limit: 5, 
          sortBy: 'newest' 
        });
        setLatestRecipes(latest.recipes);

        // Load main recipes with pagination and sorting
        const recipesData = await fetchCategoryRecipes(categoryId, {
          page: currentPage,
          limit: recipesPerPage,
          sortBy: sortBy,
          search: searchQuery
        });
        
        setRecipes(recipesData.recipes);
        setTotalPages(recipesData.totalPages);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryId, currentPage, sortBy, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to the explore section when changing pages
    document.getElementById('explore-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The actual search is triggered by the useEffect when searchQuery changes
  };

  if (loading && !category) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="category-page">
      {/* Hero section with category image */}
      <div className="category-hero">
        <img src='https://placehold.co/1920x1080' className='category-hero-img'/>
      </div>

      {/* Category header information */}
      <div className="category-header">
        <p className="category-label">RECIPES CATEGORY</p>
        <h1 className="category-title">{category?.name}</h1>
        <p className="category-description">{category?.description}</p>
      </div>

      {/* Latest Recipes Section */}
      <div className="latest-recipes-section">
        <h2 className="section-title">Latest Ideas</h2>
        <div className="latest-recipes-list">
          {latestRecipes.map(recipe => (
            <div className="latest-recipe-row" key={recipe.id}>
              <RecipeCard key={recipe.id} variant="latest" recipe={recipe} />
            </div>
          ))}
        </div>
      </div>

      {/* Explore Recipes Section */}
      <section id="explore-section" className="explore-recipes-section">
        <h2 className="section-title">Explore {category?.name} Recipes</h2>
        
        {/* First row of recipes */}
        <div className="recipes-row">
          {recipes.slice(0, 3).map(recipe => (
            <RecipeCard key={recipe.id} variant="fresh" recipe={recipe} />
          ))}
        </div>

        {/* Search and sort controls */}
        <div className="controls-container">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="catepage-search-input-container">
              <input 
                type="text" 
                placeholder="Search recipes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="catepage-search-input"
              />
              <button type="submit" className="catepage-search-button">
                <Search size={20} />
              </button>
            </div>
          </form>

          <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <div className="sort-buttons">
              <button 
                className={`sort-button ${sortBy === 'newest' ? 'active' : ''}`}
                onClick={() => handleSortChange('newest')}
              >
                Newest
              </button>
              <button 
                className={`sort-button ${sortBy === 'oldest' ? 'active' : ''}`}
                onClick={() => handleSortChange('oldest')}
              >
                Oldest
              </button>
              <button 
                className={`sort-button ${sortBy === 'top-rated' ? 'active' : ''}`}
                onClick={() => handleSortChange('top-rated')}
              >
                Top Rated
              </button>
              <button 
                className={`sort-button ${sortBy === 'most-saved' ? 'active' : ''}`}
                onClick={() => handleSortChange('most-saved')}
              >
                Most Saved
              </button>
            </div>
          </div>
        </div>

        {/* Remaining recipe rows */}
        <div className="recipes-grid">
          {recipes.slice(3).map(recipe => (
            <RecipeCard key={recipe.id} variant="fresh" recipe={recipe} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="catepage-pagination"
        />
      </section>
    </div>
  );
};

export default CategoryPage;