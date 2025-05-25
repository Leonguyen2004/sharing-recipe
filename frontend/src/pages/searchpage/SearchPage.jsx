import { Filter, TextSearch } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterPanel from '../../components/filterpanel/FilterPanel';
import RecipeLimitSelector from '../../components/limitpanel/RecipeLimitSelector';
import { RPRecipeCard } from '../../components/recipe/RPRecipeCard';
import { getAllRecipes } from '../../services/recipeService';
import styles from './SearchPage.module.css';

const renderRecipeRows = (recipes) => {
  return (
    <div className={styles.gridRecipe}>
      {recipes.map((recipe) => (
        <RPRecipeCard key={recipe.id} recipe={recipe} className={"horizontal"}/>
      ))}
    </div>
  )
};

const SearchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedLimit, setSelectedLimit] = useState(4);
  const [searchedRecipe, setSearchedRecipe] = useState([]);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  console.log("re-render search page");

  const fetchRecipes = async () => {
    try {
      const categoriesJoin = selectedFilters.categories.join(',');
      const params = {
        searchTerm,
        limit: selectedLimit,
        status: "public"
      }
      if (categoriesJoin) {
        params.categories = categoriesJoin
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
      const categoriesJoin = selectedFilters.categories.join(',');
      const params = {
        searchTerm,
        limit: selectedLimit,
        status: "public"
      }
      if (pagination.hasNext) {
        params.startAfter = pagination.nextPage
      }
      if (categoriesJoin) {
        params.categories = categoriesJoin
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

  useEffect(() => {
    // Get search term from URL
    const urlParams = new URLSearchParams(location.search);
    const term = urlParams.get('searchTerm') || '';
    setSearchTerm(term);
  }, [location.search]);

  useEffect(() => {
    if (searchTerm) {
      fetchRecipes();
    }
  }, [searchTerm, selectedLimit])

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  const handleApplyFilters = () => {
    fetchRecipes();
  };

  if (loading) return <div>loading...</div>

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <div className={styles.searchLabel}>
          <TextSearch size={40}/> 
          <span >Search results for "{searchTerm}"</span>
        </div>
        <button className={styles.filterButton} onClick={toggleFilterPanel}>
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {isFilterOpen && (
        <FilterPanel 
          selectedFilters={selectedFilters} 
          onFilterChange={handleFilterChange} 
          onApplyFilters={handleApplyFilters} 
        />
      )}

      <RecipeLimitSelector selectedLimit={selectedLimit} setSelectedLimit={setSelectedLimit}/>

      {renderRecipeRows(searchedRecipe)};
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

export default SearchPage;