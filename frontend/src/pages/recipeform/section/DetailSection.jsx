import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllCategories } from '../../../services/recipeService';

const RecipeDetails = ({ servings, setServings, categories, setCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setAvailableCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleRemoveCategory = (categoryId) => {
    setCategories(categories.filter(category => category.id !== categoryId));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryData = availableCategories.find(
      category => category.id === e.target.value
    );

    if (selectedCategoryData && !categories.some(category => category.id === selectedCategoryData.id)) {
      setCategories([...categories, selectedCategoryData]);
    }
    setSelectedCategory(e.target.value);
  };
  
  return (
    <div className="form-section">
      <div className="two-column-grid">
        <div className="input-group">
          <label htmlFor="servings">Servings</label>
          <input
            id="servings"
            type="text"
            className="text-input"
            placeholder="e.g. 8"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            placeholder="Select Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={loading}
          >
            <option value="" disabled>--Select a category--</option>
            {availableCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="selected-categories">
          {categories.map(category => (
            <div key={category.id} className="category-tag">
              <span className="remove-category" onClick={() => handleRemoveCategory(category.id)}>✕</span>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

RecipeDetails.propTypes = {
  servings: PropTypes.string.isRequired,
  setServings: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setCategories: PropTypes.func.isRequired,
};

export default RecipeDetails;