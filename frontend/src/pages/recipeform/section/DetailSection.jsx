import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RecipeDetails = ({ servings, setServings, categories, setCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleRemoveCategory = (categoryId) => {
    setCategories(categories.filter(category => category.id !== categoryId));
  };

  const handleCategoryChange = (e) => {
    const newCategory = {
      id: Date.now().toString(),
      name: e.target.value
    };

    setSelectedCategory(e.target.value);
  
    if (!categories.some(category => category.name === newCategory.name)) {
      setCategories([...categories, newCategory]);
    }
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
          >
            <option value="" disabled>--Select a category--</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Dessert">Dessert</option>
            <option value="Other">Other</option>
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