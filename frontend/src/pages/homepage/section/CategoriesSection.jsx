import React from "react";
import CategoryCard from "../../../components/category/CategoryCard";
import { useCategories } from "../../../context/CategoryContext";
import styles from './CategoriesSection.module.css';


const CategoriesSection = () => {
    const { categories } = useCategories();
    const categoriesData = categories;
    const remainingCategories = {
        name: `+${categoriesData.length - 6} categories`,
        id: "all",
    }

    return (
      <div className={styles.categoriesContainer}>   
        <div className={styles.categoriesTitle}>
            <span>What are you interesting?</span>
        </div>
        <div className={styles.categoryCards}>
            {categoriesData.slice(0, 6).map((category, index) => (
                <CategoryCard key={index} category={category} index={index} />
            ))}
            {categoriesData.length > 6 && (
                <CategoryCard
                    key={6}
                    category={remainingCategories}
                    index={6}
                />
            )}
        </div>
      </div> 
    );
};

export default CategoriesSection;