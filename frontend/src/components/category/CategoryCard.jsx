import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './CategoryCard.module.css';
import { useNavigate } from 'react-router-dom';

const totalGradients = 10; // số gradient bạn đã tạo trong CSS

const CategoryCard = ({ category, index }) => {
    const navigate = useNavigate();

    const gradientClass = styles[`gradient${index % totalGradients}`];

    const hadnleViewCategory = () => {
        navigate(`/category/${category.id}`)
    }

    return (
        <div className={`${styles.categoryContainer} ${gradientClass}`} onClick={hadnleViewCategory}>
            <h3 className={styles.categoryTitle}>{category.name}</h3>
            <div className={styles.viewTopics}>
                <span>View Category</span>
                <ChevronRight size={22} />
            </div>
        </div>
    );
};

export default CategoryCard;