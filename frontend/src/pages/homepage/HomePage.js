import { Heart } from "lucide-react"
import IconButton from "../../components/button/IconButton"
import RecipeCard from "../../components/recipe/RecipeCard"
import "./HomePage.module.css"
import { Link } from "react-router-dom"
import CategoriesSection from "./section/CategoriesSection";
import styles from './HomePage.module.css';
import NewRecipeSection from "./section/NewRecipeSection";
import TrendingSection from "./section/TrendingSection"

const HomePage = () => {
  

  // return (
  //   <div className="hpage-homepage">
  //     {/* The Latest Section */}
  //     <section className="hpage-latest-section">
  //       <div className="hpage-section-header">
  //         <h2 className="hpage-section-title">The Latest</h2>
  //       </div>

  //       <div className="hpage-latest-content">
  //         {latestRecipes.map((recipe) => (
  //           <RecipeCard key={recipe.id} variant="latest" recipe={recipe} />
  //         ))}

  //         <div className="hpage-see-more-container">
  //           <button className="hpage-see-more-button">See More</button>
  //         </div>
  //       </div>
  //     </section>

  //     {/* Trending Section */}
  //     <section className="hpage-trending-section">
  //       <div className="hpage-section-header">
  //         <h2 className="hpage-section-title">Trending Now</h2>
  //       </div>

  //       <div className="hpage-trending-content">
  //         {trendingRecipes.map((recipe) => (
  //           <RecipeCard key={recipe.id} variant="trending" recipe={recipe} />
  //         ))}
  //       </div>
  //     </section>

  //     {/* Fresh Section */}
  //     <section className="hpage-fresh-section">
  //       <div className="hpage-section-header">
  //         <h2 className="hpage-section-title">
  //           Fresh Picks 
  //         </h2>
  //       </div>

  //       <div className="hpage-fresh-content">
  //         {freshRecipes.map((recipe) => (
  //           <RecipeCard key={recipe.id} variant="fresh" recipe={recipe} />
  //         ))}
  //       </div>
  //     </section>

  //     {/* Call to Action */}
  //     {/* <section className="hpage-cta-section">
  //       <h2>Ready to share your own recipe?</h2>
  //       <IconButton icon={<Heart size={20} />} variant="primary">
  //         Add Recipe
  //       </IconButton>
  //     </section> */}
      
  //   </div>
  // )
  return (
    <div className={styles.homeContainer}>
      <CategoriesSection/>
      <NewRecipeSection/>
      <TrendingSection/>
    </div>
  );
}

export default HomePage

