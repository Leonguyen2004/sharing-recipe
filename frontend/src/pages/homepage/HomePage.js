import "./HomePage.module.css"
import styles from './HomePage.module.css'
import CategoriesSection from "./section/CategoriesSection"
import NewRecipeSection from "./section/NewRecipeSection"
import TrendingSection from "./section/TrendingSection"
import LatestSection from "./section/LatestSection"

const HomePage = () => {
  console.log("re-render in homepage");
  
  return (
    <div className={styles.homeContainer}>
      <CategoriesSection/>
      <LatestSection/>
      <NewRecipeSection/>
      <TrendingSection/>
    </div>
  );
}

export default HomePage

