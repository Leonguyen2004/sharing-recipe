import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumb.module.css';
import { useCategories } from '../../context/CategoryContext';

const Breadcrumb = ({ items }) => {
  const { categories } = useCategories();

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            <a href={`/category/${item}`}>{getCategoryName(item)}</a>
            {index < items.length - 1 && (
              <ChevronRight size={16} className={styles.breadcrumbSeperator} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;