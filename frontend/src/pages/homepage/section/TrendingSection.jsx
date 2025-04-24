import React, { useRef, useState } from 'react';
import styles from './TrendingSection.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecipes } from '../../../context/RecipesContext';
import { RPRecipeCard } from '../../../components/recipe/RPRecipeCard';

const VISIBLE_CARDS = 6;
const CARD_WIDTH = 176; // ví dụ: 160px card + 16px gap

const TrendingSection = () => {
  const carouselRef = useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const totalCards = 10;
  const { recipes } = useRecipes();

  const scrollToIndex = (index) => {
    const scrollX = index * CARD_WIDTH;
    carouselRef.current.scrollTo({ left: scrollX, behavior: 'smooth' });
  };

  const handleScrollLeft = () => {
    if (startIndex > 0) {
      const newIndex = startIndex - 1;
      setStartIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handleScrollRight = () => {
    if (startIndex + VISIBLE_CARDS < totalCards) {
      const newIndex = startIndex + 1;
      setStartIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Top 10 recipe today</h2>
      <div className={styles.carouselContainer}>
        <button className={styles.navLeft} onClick={handleScrollLeft}>
          <ChevronLeft size={32} />
        </button>

        <div className={styles.carousel} ref={carouselRef}>
          {recipes.map((recipe, index) => (
            <RPRecipeCard recipe={recipe} className={"vertical"}/>
          ))}
        </div>
        
        <button className={styles.navRight} onClick={handleScrollRight}>
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default TrendingSection;