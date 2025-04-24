import React, { useState, useEffect } from 'react';
import { Trash2, Star, ChevronDown, ChevronUp, BookOpen, Clock, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../searchbar/Searchbar';
import Modal from '../modal/Modal';
import './RecipeManagement.css';
import { getAllRecipes, deleteRecipe } from '../../../services/recipeService';
import { getAllCategories } from '../../../services/categoryService';
import { getUserProfile } from '../../../services/userService';

const RecipeManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState({});

  // Fetch recipes and categories from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const recipesData = await getAllRecipes();
        const categoriesData = await getAllCategories();
        
        // Map recipes to include category names
        const mappedRecipes = recipesData.map(recipe => {
          // Find category names from category IDs
          const categoryNames = recipe.categories 
            ? recipe.categories.map(catId => {
                const category = categoriesData.find(c => c.id === catId);
                return category ? category.name : '';
              }).filter(name => name)
            : [];
            
          return {
            ...recipe,
            category: categoryNames,
            rating: 0, // Tạm thời để rating là 0
            saves: 0,  // Tạm thời để saves là 0
            date: recipe.createdAt ? new Date(recipe.createdAt) : new Date()
          };
        });
        
        setRecipes(mappedRecipes);
        setCategories(categoriesData);
        
        // Fetch user profiles for all recipes
        const userIds = [...new Set(mappedRecipes.map(recipe => recipe.userId).filter(Boolean))];
        const userProfilesData = {};
        
        for (const userId of userIds) {
          try {
            const userProfile = await getUserProfile(userId);
            userProfilesData[userId] = userProfile;
          } catch (error) {
            console.error(`Error fetching user profile for ${userId}:`, error);
            userProfilesData[userId] = { displayName: 'Unknown User', email: 'unknown@example.com' };
          }
        }
        
        setUserProfiles(userProfilesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
  };

  const openDeleteModal = (recipe) => {
    setRecipeToDelete(recipe);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRecipeToDelete(null);
  };

  const handleDeleteRecipe = async () => {
    try {
      await deleteRecipe(recipeToDelete.id);
      setRecipes(recipes.filter(recipe => recipe.id !== recipeToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Error deleting recipe. Please try again.');
    }
  };

  const handleEditRecipe = (recipe) => {
    // Chuyển hướng đến trang chỉnh sửa với ID của recipe
    navigate(`/recipe-form/edit/${recipe.id}`);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesQuery = 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.author && recipe.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(recipe.category) && recipe.category.some(cat => 
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    return matchesQuery;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return b.date - a.date;
      case 'oldest':
        return a.date - b.date;
      case 'rating':
        return b.rating - a.rating;
      case 'saves':
        return b.saves - a.saves;
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="adpage-loading">Loading...</div>;
  }

  return (
    <div className="adpage-recipe-management">
      <div className="adpage-section-header">
        <h1>Recipe Management</h1>
      </div>
      
      <div className="adpage-recipe-controls">
        <SearchBar placeholder="Search recipes..." onSearch={handleSearch} />
        
        <div className="adpage-sort-controls">
          <button 
            className={`adpage-sort-btn ${sortBy === 'newest' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('newest')}
          >
            <Clock size={16} />
            Newest
          </button>
          <button 
            className={`adpage-sort-btn ${sortBy === 'oldest' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('oldest')}
          >
            <Clock size={16} />
            Oldest
          </button>
          <button 
            className={`adpage-sort-btn ${sortBy === 'rating' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('rating')}
          >
            <Star size={16} />
            Highest Rated
          </button>
          <button 
            className={`adpage-sort-btn ${sortBy === 'saves' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('saves')}
          >
            <BookOpen size={16} />
            Most Saved
          </button>
        </div>
      </div>

      <div className="adpage-recipes-list">
        {sortedRecipes.length > 0 ? (
          sortedRecipes.map(recipe => {
            const userProfile = recipe.userId ? userProfiles[recipe.userId] : null;
            return (
              <div key={recipe.id} className="adpage-recipe-item">
                <div className="adpage-recipe-image">
                  <img src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.title} />
                </div>
                <div className="adpage-recipe-content">
                  <div className="adpage-recipe-header">
                    <h2 className="adpage-recipe-name">{recipe.title}</h2>
                    <div className="adpage-recipe-categories">
                      {Array.isArray(recipe.category) ? 
                        recipe.category.map((cat, index) => (
                          <span key={index} className="adpage-recipe-category">{cat}</span>
                        )) : 
                        <span className="adpage-recipe-category">{recipe.category}</span>
                      }
                    </div>
                  </div>
                  <div className="adpage-recipe-author">
                    By {userProfile ? userProfile.displayName : 'Unknown User'}
                    {userProfile && <span className="adpage-recipe-email"> ({userProfile.email})</span>}
                  </div>
                  <div className="adpage-recipe-meta">
                    <div className="adpage-recipe-rating">
                      <Star size={16} className="adpage-star-icon" />
                      <span>{recipe.rating}</span>
                    </div>
                    <div className="adpage-recipe-saves">
                      <BookOpen size={16} />
                      <span>{recipe.saves} saves</span>
                    </div>
                    <div className="adpage-recipe-date">
                      {recipe.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="adpage-recipe-actions">
                  <button 
                    className="adpage-action-btn adpage-edit-btn" 
                    onClick={() => handleEditRecipe(recipe)}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="adpage-action-btn adpage-delete-btn" 
                    onClick={() => openDeleteModal(recipe)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="adpage-no-recipes">No recipes found</div>
        )}
      </div>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal}
        title="Delete Recipe"
      >
        <div className="adpage-delete-modal-content">
          <p>Are you sure you want to delete "{recipeToDelete?.title}"?</p>
          <p className="adpage-delete-warning">This action cannot be undone.</p>
          <div className="adpage-modal-actions">
            <button className="adpage-btn adpage-cancel-btn" onClick={closeDeleteModal}>
              Cancel
            </button>
            <button className="adpage-btn adpage-delete-btn-modal" onClick={handleDeleteRecipe}>
              Delete Recipe
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecipeManagement;
