import React from 'react';
import styles from './FilterPanel.module.css';
import { useCategories } from '../../context/CategoryContext';
import IconButton from '../button/IconButton';

const FilterPanel = ({ selectedFilters, onFilterChange, onApplyFilters }) => {
  const { categories } = useCategories();

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = selectedFilters.categories.includes(categoryId)
      ? selectedFilters.categories.filter(id => id !== categoryId)
      : [...selectedFilters.categories, categoryId];
    
    onFilterChange({
      ...selectedFilters,
      categories: updatedCategories
    });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    if (selectedFilters.sortBy !== sortBy) {
        onFilterChange({
            ...selectedFilters,
            sortBy,
            sortOrder
        });
    } else {
        onFilterChange({
            ...selectedFilters,
            sortBy: "",
            sortOrder: ""
        })
    }
  };

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterSection}>
        <h3>Categories</h3>
        <div className={styles.categoryList}>
          {categories.map(category => (
            <label key={category.id} className={styles.categoryItem}>
              <input
                type="checkbox"
                checked={selectedFilters.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className={styles.filterSection}>
        <h3>Sort By</h3>
        <div className={styles.sortOptions}>
          <div 
            className={`${styles.sortOption} ${selectedFilters.sortBy === 'averageRating' ? styles.active : ''}`}
            onClick={() => handleSortChange('averageRating', 'desc')}
          >
            Highest Rating
          </div>
          <div 
            className={`${styles.sortOption} ${selectedFilters.sortBy === 'saveCount' ? styles.active : ''}`}
            onClick={() => handleSortChange('saveCount', 'desc')}
          >
            Highest Save Count
          </div>
          <div 
            className={`${styles.sortOption} ${selectedFilters.sortBy === 'createdAt' ? styles.active : ''}`}
            onClick={() => handleSortChange('createdAt', 'desc')}
          >
            Newest
          </div>
        </div>
      </div>
      
      <div className={styles.filterActions}>
        <IconButton variant='primary' className={styles.applyFilterButton} onClick={onApplyFilters}>
          Filter Results
        </IconButton>
      </div>
    </div>
  );
};

export default FilterPanel;