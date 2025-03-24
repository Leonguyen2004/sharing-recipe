import React from 'react';
import HeaderSection from './section/HeaderSection';
import MediaSection from './section/MediaSection';
import InfoSection from './section/InfoSection';
import IngredientsSection from './section/IngredientsSection';
import DirectionsSection from './section/DirectionsSection';
import Reviews from '../../components/review/Reviews';
import './RecipeDetail.css';

const RecipeDetail = () => {
  // Sample recipe data based on the provided structure
  const recipe = {
    title: "Breakfast Fried Rice",
    description: "This breakfast fried rice is a twist on bacon and eggs! My dad used to make this for me on Saturday mornings when I was a kid; it's an easy and tasty brunch option. You can substitute one bunch of broccoli for frozen peas if desired.",
    photo: null,
    ingredients: [
      {
        id: "1",
        text: "4 cups water",
        isHeader: false
      },
      {
        id: "2",
        text: "2 cups uncooked white rice",
        isHeader: false
      },
      {
        id: "3",
        text: "6 slices bacon",
        isHeader: false
      },
      {
        id: "4",
        text: "4 eggs, beaten",
        isHeader: false
      },
      {
        id: "5",
        text: "1 large yellow onion, chopped",
        isHeader: false
      },
      {
        id: "6",
        text: "1 cup frozen peas",
        isHeader: false
      },
      {
        id: "7",
        text: "4 green onions, chopped",
        isHeader: false
      },
      {
        id: "8",
        text: "1 ½ tablespoons soy sauce, divided",
        isHeader: false
      }
    ],
    directions: [
      {
        id: "header1",
        text: "Preparation",
        isHeader: true
      },
      {
        id: "1",
        text: "Bring water and rice to a boil in a saucepan. Reduce heat to medium-low, cover, and simmer until rice is tender and liquid is absorbed, 20 to 25 minutes.",
        isHeader: false
      },
      {
        id: "2",
        text: "Place bacon in a large skillet and cook over medium-high heat, occasionally turning, until evenly browned, about 10 minutes. Transfer bacon slices to a paper towel-lined plate to drain and crumble into bite-size pieces; reserve rendered bacon fat in the skillet.",
        isHeader: false
      },
      {
        id: "3",
        text: "Cook and stir eggs in the same skillet over medium heat until slightly set, 1 to 3 minutes. Stir yellow onion, peas, green onion, and 1 1/2 teaspoons soy sauce into eggs; cook and stir until yellow onion is translucent, about 5 minutes more. Reduce heat to low; stir rice, crumbled bacon, and remaining soy sauce into egg mixture until well-combined and heated through, 1 to 3 minutes.",
        isHeader: false
      }
    ],
    servings: "6",
    categories: [
      {
        id: "1742391502993",
        name: "Breakfast"
      },
      {
        id: "1742391503960",
        name: "Lunch"
      }
    ],
    prepTime: 10,
    prepTimeUnit: "mins",
    cookTime: 40,
    cookTimeUnit: "mins",
    totalTime: 50,
    additionalTimers: [
        {
          "id": "1287985479215",
          "type": "Freeze",
          "time": 45,
          "unit": "mins"
        },
        {
          "id": "128798547",
          "type": "Rest",
          "time": 10,
          "unit": "mins"
        }
    ],
    notes: [
      "You can substitute bacon with ham or sausage if preferred."
    ],
    createdAt: "3/19/2023"
  };

  return (
    <div className="recipe-page">
      <div className="container">
        <HeaderSection recipe={recipe} />
        
        <MediaSection 
          mainImage={recipe.photo} 
          thumbnails={[]} 
        />
        
        <InfoSection recipe={recipe} />
        
        <IngredientsSection 
          ingredients={recipe.ingredients}
          servings={recipe.servings}
        />
        
        <DirectionsSection 
          directions={recipe.directions}
          madeCounts={40}
        />
        
        <Reviews />
      </div>
    </div>
  );
};

export default RecipeDetail;