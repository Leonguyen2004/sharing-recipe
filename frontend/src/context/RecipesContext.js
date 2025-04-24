import { createContext, useContext, useState, useEffect } from 'react';
import { getAllRecipes } from '../services/recipeService';
import { useAuth } from './AuthContext';

const RecipesContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('usedRecipes must be used within a RecipesProvider');
  }
  return context;
}; 

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const { currentUser } = useAuth();

  const fetchRecipes = async () => {
    if (!currentUser) return;
    try {
      const recipesData = await getAllRecipes();
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <RecipesContext.Provider value={{ recipes }}>
      {children}
    </RecipesContext.Provider>
  );
};