import RecipeCard from "../../../components/recipe/RecipeCard"

const SavedRecipes = () => {
  // Mock data - will be fetched from API later
  const savedRecipes = [
    {
      id: 1,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 2,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 3,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 4,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
    {
      id: 5,
      title: "Chick-fil-A Is Coming to Costco and Sam's Club for the First Time Ever",
      category: "GROCERY",
      timeAgo: "39 MINUTES AGO",
      rating: 4.8,
      ratingCount: 1245,
      image: "https://placehold.co/400x400",
    },
  ]

  return (
    <>
      <h1>My Saved Recipes & Collections</h1>

      <div className="ppage-saved-content">
        <h2>Recently Saved</h2>
        <div className="ppage-saved-recipes-grid">
          {savedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} variant="saved" recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  )
}

export default SavedRecipes
