import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RPRecipeCard } from '../../../components/recipe/RPRecipeCard';
import { getAllRecipes } from '../../../services/recipeService';
import styles from './TrendingSection.module.css';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TrendingSection = () => {
  const [trendingRecipe, setTrendingRecipe] = useState([])

  useEffect(() => {
    const fetchTrendingRecipe = async () => {
      const response = await getAllRecipes({
        sortBy: "averageRating",
        sortOrder: "desc",
        limit: "10",
        status: "public"
      })
      setTrendingRecipe(response.data)
    } 

    fetchTrendingRecipe();
  }, [])

  // return (
  //   <div className={styles.trendingSection}>
  //     <div className={styles.title}>
  //         <h2>Trending Recipes</h2>
  //       </div>
  //     <div className={styles.carouselContainer}>
  //       <Swiper
  //         modules={[Navigation, Pagination]}
  //         spaceBetween={20} // Khoảng cách giữa các slide
  //         slidesPerView={6} // Số lượng slide hiển thị ban đầu
  //         slidesPerGroup={1} // Số lượng slide trượt mỗi lần
  //         navigation // Kích hoạt nút điều hướng (prev/next)
  //         loop={false} // Không lặp lại slide (tùy chọn, có thể đặt true nếu muốn)
  //         breakpoints={{
  //           // Responsive breakpoints (tùy chọn)
  //           320: {
  //             slidesPerView: 1,
  //             spaceBetween: 10,
  //           },
  //           480: {
  //             slidesPerView: 2,
  //             spaceBetween: 10,
  //           },
  //           640: {
  //             slidesPerView: 3,
  //             spaceBetween: 15,
  //           },
  //           768: {
  //             slidesPerView: 4,
  //             spaceBetween: 15,
  //           },
  //           1024: {
  //             slidesPerView: 6,
  //             spaceBetween: 20,
  //           },
  //         }}
  //       >
  //         {trendingRecipe.map((recipe, index) => (
  //           <SwiperSlide key={index} className={styles.slide}>
  //             <div className={styles.card}>
  //               <RPRecipeCard recipe={recipe} className={"vertical"} key={index}/>
  //             </div>
  //           </SwiperSlide>
  //         ))}
  //       </Swiper>
  //     </div>
  //   </div>
  // );

  return (
    <div className={styles.trendingSection}>
      <div className={styles.title}>
        <h2>Trending Recipes</h2>
      </div>
      <RecipeRow recipes={trendingRecipe} />
    </div>
  )
};

function RecipeRow({ recipes }) {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 6

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(recipes.length - visibleCount, prev + 1))
  }

  const visibleRecipes = recipes.slice(startIndex, startIndex + visibleCount)
  const canScrollLeft = startIndex > 0
  const canScrollRight = startIndex < recipes.length - visibleCount

  return (
    <div className={styles.recipeRow}>

      <div className={styles.carouselContainer}>
        <button
          className={`${styles.navButton} ${styles.prevButton} ${!canScrollLeft ? styles.disabled : ""}`}
          onClick={handlePrevious}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.cardsContainer}>
          {visibleRecipes.map((recipe, index) => (
            <div key={recipe.id || index} className={styles.cardWrapper}>
              <RPRecipeCard recipe={recipe} className={"vertical"}/>
            </div>
          ))}

          {/* If we don't have enough recipes, show placeholders */}
          {visibleRecipes.length < visibleCount &&
            Array(visibleCount - visibleRecipes.length)
              .fill(0)
              .map((_, index) => (
                <div key={`placeholder-${index}`} className={styles.cardWrapper}>
                  <div className={styles.placeholder}></div>
                </div>
              ))}
        </div>

        <button
          className={`${styles.navButton} ${styles.nextButton} ${!canScrollRight ? styles.disabled : ""}`}
          onClick={handleNext}
          disabled={!canScrollRight}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}

export default TrendingSection;