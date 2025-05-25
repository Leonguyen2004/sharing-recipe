import "./HomePage.module.css"
import styles from './HomePage.module.css'
import CategoriesSection from "./section/CategoriesSection"
import NewRecipeSection from "./section/NewRecipeSection"
import TrendingSection from "./section/TrendingSection"

const HomePage = () => {
  console.log("re-render in homepage");
  
  return (
    <div className={styles.homeContainer}>
      <CategoriesSection/>
      <NewRecipeSection/>
      <TrendingSection/>
    </div>
  );
}

export default HomePage

