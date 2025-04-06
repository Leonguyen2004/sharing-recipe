import { Heart } from "lucide-react"
import IconButton from "../../components/button/IconButton"
import RecipeCard from "../../components/recipe/RecipeCard"
import "./HomePage.css"
import { Link } from "react-router-dom"

const HomePage = () => {
  // Mock data for the latest recipes
  const latestRecipes = [
    {
      id: 1,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the ",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 2,
      title: "Chick-fil-A Is Bringing 2 Fan-Favorite Products to Grocery Shelves",
      category: "GROCERY",
      timeAgo: "1 HOUR AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 3,
      title: "Stop Storing Your Eggs Wrong—Keep Them Safe (and Fresh) With These Storage SolutionsStop Storing Your Eggs Wrong—Keep Them Safe (and Fresh) With These Storage SolutionsStop Storing Your Eggs Wrong—Keep Them Safe (and Fresh) With These Storage Solutions",
      category: "CONTAINER & ORGANIZER REVIEWS",
      timeAgo: "6 HOURS AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 4,
      title: "Ooey-Gooey Lemon Monkey Bread",
      category: "MONKEY BREAD RECIPES",
      timeAgo: "15 HOURS AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 5,
      title: "The Science-Backed Way to Make Foolproof Cacio e Pepe Every Time",
      category: "TRENDS",
      timeAgo: "16 HOURS AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
  ]

  // Mock data for trending recipes
  const trendingRecipes = [
    {
      id: 1,
      title: "19 Top-Rated Slow Cooker Recipes You Can Set and Forget 19 Top-Rated Slow Cooker Recipes You Can Set and Forget 19 Top-Rated Slow Cooker Recipes You Can Set and Forget",
      category: "SLOW COOKER",
      image: "https://placehold.co/400x400",
      rating: 4.8,
      ratingCount: 1245,
      timeAgo: "1 hr 20 mins",
    },
    {
      id: 2,
      title: "'The Casserole' Is the No-Fuss Recipe You Need to Feed a Hungry Crowd",
      category: "IN THE KITCHEN",
      image: "https://placehold.co/400x400",
      rating: 4.7,
      ratingCount: 876,
      timeAgo: "2 hr 15 mins",
    },
    {
      id: 3,
      title: "Meet Alabama Lane Cake: The 135-Year-Old Recipe Harper Lee Made Famous",
      category: "TRENDS",
      image: "https://placehold.co/400x400",
      rating: 4.9,
      ratingCount: 532,
      timeAgo: "45 mins",
    },
    {
      id: 4,
      title: "Finally, a Mandoline You Don't Have to Be Afraid Of",
      category: "KITCHEN TOOL & UTENSIL REVIEWS",
      image: "https://placehold.co/400x400",
      rating: 4.6,
      ratingCount: 324,
      timeAgo: "1 hr 45 mins",
    },
  ]

  // Mock data for fresh recipes (vegetable category)
  const freshRecipes = [
    {
      id: 1,
      title: "Rosemary Lemon Grilled Chicken",
      category: "CHICKEN BREAST",
      image: "https://placehold.co/400x400",
      rating: 4.5,
      ratingCount: 280,
      timeAgo: "1 hr 20 mins",
    },
    {
      id: 2,
      title: "Roasted New Red Potatoes",
      category: "ROASTED POTATO RECIPES",
      image: "https://placehold.co/400x400",
      rating: 4.6,
      ratingCount: 1423,
      timeAgo: "50 mins",
    },
    {
      id: 3,
      title: "Chef John's Fresh Salmon CakesChef John's Fresh Salmon CakesChef John's Fresh Salmon CakesChef John's Fresh Salmon CakesChef John's Fresh Salmon Cakes",
      category: "SALMON PATTY RECIPES",
      image: "https://placehold.co/400x400",
      rating: 5.0,
      ratingCount: 393,
      timeAgo: "1 hr 30 mins",
    },
    {
      id: 4,
      title: "Lamb Souvlaki",
      category: "GREEK",
      image: "https://placehold.co/400x400",
      rating: 4.5,
      ratingCount: 9,
      timeAgo: "2 hrs",
    },
    {
      id: 5,
      title: "Lemon-Glazed Carrots",
      category: "GLAZED CARROT RECIPES",
      image: "https://placehold.co/400x400",
      rating: 4.6,
      ratingCount: 27,
      timeAgo: "40 mins",
    },
    {
      id: 6,
      title: "Sandy's Simple Spring Lettuce Salad",
      category: "ARUGULA SALAD RECIPES",
      image: "https://placehold.co/400x400",
      rating: 4.5,
      ratingCount: 30,
      timeAgo: "25 mins",
    },
  ]

  return (
    <div className="hpage-homepage">
      {/* The Latest Section */}
      <section className="hpage-latest-section">
        <div className="hpage-section-header">
          <h2 className="hpage-section-title">The Latest</h2>
        </div>

        <div className="hpage-latest-content">
          {latestRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} variant="latest" recipe={recipe} />
          ))}

          <div className="hpage-see-more-container">
            <button className="hpage-see-more-button">See More</button>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="hpage-trending-section">
        <div className="hpage-section-header">
          <h2 className="hpage-section-title">Trending Now</h2>
        </div>

        <div className="hpage-trending-content">
          {trendingRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} variant="trending" recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Fresh Section */}
      <section className="hpage-fresh-section">
        <div className="hpage-section-header">
          <h2 className="hpage-section-title">
            Fresh Picks 
          </h2>
        </div>

        <div className="hpage-fresh-content">
          {freshRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} variant="fresh" recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="hpage-cta-section">
        <h2>Ready to share your own recipe?</h2>
        <IconButton icon={<Heart size={20} />} variant="primary">
          Add Recipe
        </IconButton>
      </section> */}
      
    </div>
  )
}

export default HomePage

