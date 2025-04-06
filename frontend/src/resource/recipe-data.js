// This is just to expand the recipes array for demonstration purposes
export const generateMoreRecipes = () => {
    const baseRecipes = [
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
        title: "Chef John's Fresh Salmon Cakes",
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
  
    // Generate more recipes by duplicating and modifying the base recipes
    const extendedRecipes = []
    for (let i = 0; i < 10; i++) {
      // Create 10 sets of recipes (60 total)
      baseRecipes.forEach((recipe, index) => {
        extendedRecipes.push({
          ...recipe,
          id: recipe.id + i * baseRecipes.length,
          title: i > 0 ? `${recipe.title} (Variation ${i})` : recipe.title,
        })
      })
    }
  
    return extendedRecipes
  }
  
  export const recipesList = generateMoreRecipes()  