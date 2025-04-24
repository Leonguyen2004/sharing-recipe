import { createContext, useContext, useState, useEffect } from 'react';
import { getSavedRecipes } from '../services/recipeService';
import { useAuth } from './AuthContext';

const SavedRecipeContext = createContext();

export const useSavedRecipe = () => {
  const context = useContext(SavedRecipeContext);
  if (!context) {
    throw new Error('useSavedRecipe must be used within a SavedRecipeProvider');
  }
  return context;
}; 

export const SavedRecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const { currentUser } = useAuth();

  const fetchSavedRecipe = async () => {
    if (!currentUser) return;
    try {
      const savedRecipesData = await getSavedRecipes(currentUser.uid);
      setSavedRecipes(savedRecipesData);
    } catch (error) {
      console.error('Error fetching saved recipe:', error);
    }
  };

  useEffect(() => {
    fetchSavedRecipe();
  }, []);

  return (
    <SavedRecipeContext.Provider value={{ savedRecipes, refreshSavedRecipes: fetchSavedRecipe }}>
      {children}
    </SavedRecipeContext.Provider>
  );
};