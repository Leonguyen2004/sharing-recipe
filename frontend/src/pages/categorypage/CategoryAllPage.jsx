import React, { useState, useEffect } from 'react';
import { useCategories } from '../../context/CategoryContext';
import CategoryCard from '../../components/category/CategoryCard';
import styles from './CategoryAllPage.module.css';

const CategoryAllPage = () => {
  const { categories } = useCategories();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All categories</h2>
      <div className={styles.grid}>
        {categories.map((category, index) => (
          <CategoryCard category={category} index={index} key={index}/>
        ))}
      </div>
    </div>
  );
};

export default CategoryAllPage;