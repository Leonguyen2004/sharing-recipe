import React, { useState, useEffect } from 'react';
import { Trash2, Star, ChevronDown, ChevronUp, BookOpen, Clock, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../searchbar/Searchbar';
import Modal from '../modal/Modal';
import './RecipeManagement.css';
import { getAllRecipes, deleteRecipe } from '../../../services/recipeService';
import AdminRecipeCard from '../../../components/recipe/AdminRecipeCard';
import { debounce } from 'lodash';

const RecipeManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState('newest');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [searchedRecipe, setSearchedRecipe] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const fetchRecipes = async () => {
    console.log("fectch data");
    
    try {
      const params = {
        searchTerm,
        limit: "4",
        sortBy: "createdAt",
        sortOrder: "desc",
        status: "public"
      }
      if (selectedFilters.sortBy) {
        params.sortBy = selectedFilters.sortBy
      }
      if (selectedFilters.sortOrder) {
        params.sortOrder = selectedFilters.sortOrder
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
        searchTerm,
        limit: "4",
        sortBy: "createdAt",
        sortOrder: "desc",
        status: "public"
      }
      if (pagination.hasNext) {
        params.startAfter = pagination.nextPage
      }
      if (selectedFilters.sortBy) {
        params.sortBy = selectedFilters.sortBy
      }
      if (selectedFilters.sortOrder) {
        params.sortOrder = selectedFilters.sortOrder
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

  // Fetch all recipes
  useEffect(() => {
    fetchRecipes();
  }, [selectedFilters, debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // Chờ 500ms sau khi người dùng ngừng gõ

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const handleSort = (sortBy, sortOrder) => {
    setSelectedFilters({
      sortBy,
      sortOrder
    })
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
      setSearchedRecipe(searchedRecipe.filter(recipe => recipe.id !== recipeToDelete.id));
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
            className={`adpage-sort-btn ${selectedFilters.sortBy === 'createdAt' && selectedFilters.sortOrder === 'desc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('createdAt', 'desc')}
          >
            <Clock size={16} />
            Newest
          </button>
          <button 
            className={`adpage-sort-btn ${selectedFilters.sortBy === 'createdAt' && selectedFilters.sortOrder === 'asc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('createdAt', 'asc')}
          >
            <Clock size={16} />
            Oldest
          </button>
          <button 
            className={`adpage-sort-btn ${selectedFilters.sortBy === 'averageRating' && selectedFilters.sortOrder === 'desc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('averageRating', 'desc')}
          >
            <Star size={16} />
            Highest Rated
          </button>
          <button 
            className={`adpage-sort-btn ${selectedFilters.sortBy === 'saveCount' && selectedFilters.sortOrder === 'desc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('saveCount', 'desc')}
          >
            <BookOpen size={16} />
            Most Saved
          </button>
        </div>
      </div>

      <div className="adpage-recipes-list">
        {searchedRecipe.length > 0 ? (
          searchedRecipe.map(recipe => (
            <AdminRecipeCard recipe={recipe} key={recipe.id}/>
            // <div className='adpage-recipe-card' key={recipe.id}>
              

            //   <div className="adpage-recipe-actions">
            //     <button 
            //       className="adpage-action-btn adpage-edit-btn" 
            //       onClick={() => handleEditRecipe(recipe)}
            //     >
            //       <Edit size={25} />
            //     </button>
            //     <button 
            //       className="adpage-action-btn adpage-delete-btn" 
            //       onClick={() => openDeleteModal(recipe)}
            //     >
            //       <Trash2 size={25} />
            //     </button>
            //   </div>
            // </div>
          ))
        ) : (
          <div className="adpage-no-recipes">No recipes found</div>
        )}
      </div>

      {pagination.hasNext && (
        <div className='adpage-loadmore-container'>
          <button className='adpage-loadmore-button' onClick={fetchMoreRecipes}>
            Load More
          </button>
        </div>
      )}

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
