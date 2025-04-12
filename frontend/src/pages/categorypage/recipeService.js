// Mock data for recipes and categories
const categories = [
    {
      id: 'breakfast',
      name: 'Breakfast',
      description: 'Start your day with these delicious breakfast recipes that are both nutritious and easy to prepare. From quick smoothies to hearty breakfast bowls, we have options for everyone.',
      image: 'https://images.unsplash.com/photo-1533089860892-a9c9f5a72b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: 'lunch',
      name: 'Lunch',
      description: 'Quick, satisfying lunch recipes perfect for busy weekdays or leisurely weekends. Discover salads, sandwiches, and more to keep you energized throughout the day.',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: 'dinner',
      name: 'Dinner',
      description: 'End your day on a high note with our collection of dinner recipes ranging from quick family meals to impressive dishes for entertaining guests.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: 'dessert',
      name: 'Desserts',
      description: 'Indulge your sweet tooth with our collection of dessert recipes, from simple cookies to elaborate cakes and everything in between.',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: 'vegetarian',
      name: 'Vegetarian',
      description: 'Discover delicious meat-free recipes that put vegetables front and center. These dishes are perfect for vegetarians or anyone looking to add more plant-based meals to their diet.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2384&q=80'
    }
  ];
  
  // Generate mock recipes
  const generateMockRecipes = (categoryId, count = 50) => {
    const recipes = [];
    const titles = {
      breakfast: ['Fluffy Pancakes', 'Avocado Toast', 'Greek Yogurt Bowl', 'Breakfast Burrito', 'Smoothie Bowl', 'Oatmeal with Berries', 'Spinach Omelette', 'French Toast', 'Breakfast Muffins', 'Chia Pudding'],
      lunch: ['Caesar Salad', 'Chicken Wrap', 'Quinoa Bowl', 'Tuna Sandwich', 'Veggie Soup', 'Pasta Salad', 'Greek Salad', 'Falafel Wrap', 'Burrito Bowl', 'Vegetable Stir Fry'],
      dinner: ['Spaghetti Bolognese', 'Grilled Salmon', 'Beef Stew', 'Roast Chicken', 'Vegetable Curry', 'Fish Tacos', 'Shepherd\'s Pie', 'Chicken Alfredo', 'Beef Stir Fry', 'Mushroom Risotto'],
      dessert: ['Chocolate Cake', 'Apple Pie', 'Cheesecake', 'Brownies', 'Ice Cream Sundae', 'Tiramisu', 'Fruit Tart', 'Creme Brulee', 'Lemon Bars', 'Chocolate Chip Cookies'],
      vegetarian: ['Mushroom Burger', 'Eggplant Parmesan', 'Vegetable Curry', 'Bean Chili', 'Stuffed Bell Peppers', 'Lentil Soup', 'Caprese Salad', 'Vegetable Stir Fry', 'Spinach Lasagna', 'Falafel Wrap']
    };
    
    const descriptions = [
      'A delicious recipe that\'s perfect for any occasion.',
      'Easy to prepare and packed with flavor.',
      'A family favorite that everyone will love.',
      'Ready in under 30 minutes for those busy weeknights.',
      'Nutritious and satisfying for the whole family.',
      'A classic recipe with a modern twist.',
      'Perfect for meal prep and weekday lunches.',
      'Impress your guests with this simple yet elegant dish.',
      'Comfort food at its best, warming and satisfying.',
      'Light and refreshing, ideal for warmer months.'
    ];
    
    for (let i = 1; i <= count; i++) {
      const titleIndex = Math.floor(Math.random() * titles[categoryId].length);
      const descIndex = Math.floor(Math.random() * descriptions.length);
      const cookTime = Math.floor(Math.random() * 45) + 15; // 15-60 mins
      const rating = (Math.random() * 2 + 3); // 3.0-5.0
      const saved = Math.floor(Math.random() * 500) + 50; // 50-550
      const createdAt = new Date(Date.now() - Math.random() * 10000000000); // Random date in past
      
      recipes.push({
        id: `${categoryId}-${i}`,
        title: `${titles[categoryId][titleIndex]} ${i}`,
        description: descriptions[descIndex],
        image: `https://placehold.co/400x400`,
        cookTime,
        rating,
        saved,
        categoryId,
        createdAt
      });
    }
    
    return recipes;
  };
  
  // In-memory storage for mock recipes
  const allRecipes = {};
  categories.forEach(category => {
    allRecipes[category.id] = generateMockRecipes(category.id);
  });
  
  // Fetch category data
  export const fetchCategoryData = async (categoryId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
          resolve(category);
        } else {
          reject(new Error('Category not found'));
        }
      }, 500); // Simulate network delay
    });
  };
  
  // Fetch recipes for a category with filtering, sorting, and pagination
  export const fetchCategoryRecipes = async (categoryId, options = {}) => {
    const { page = 1, limit = 10, sortBy = 'newest', search = '' } = options;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let recipes = [...allRecipes[categoryId]];
        
        // Apply search filter if provided
        if (search) {
          const searchLower = search.toLowerCase();
          recipes = recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(searchLower) || 
            recipe.description.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'newest':
            recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            recipes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'top-rated':
            recipes.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            break;
          case 'most-saved':
            recipes.sort((a, b) => b.saved - a.saved);
            break;
          default:
            recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        // Apply pagination
        const totalRecipes = recipes.length;
        const totalPages = Math.ceil(totalRecipes / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRecipes = recipes.slice(startIndex, endIndex);
        
        resolve({
          recipes: paginatedRecipes,
          totalRecipes,
          totalPages,
          currentPage: page
        });
      }, 500); // Simulate network delay
    });
  };
  
  // For homepage - get categories
  export const fetchCategories = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 500); // Simulate network delay
    });
  };