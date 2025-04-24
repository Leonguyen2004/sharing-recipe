import express from 'express';
import recipeController from '../controllers/recipe.controller.js';
import { authenticateUser, attachUserData, isAdmin, isRecipeAuthorOrAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', recipeController.getAllRecipes);
router.get('/:recipeId', recipeController.getRecipeById);
router.get('/personal/:uid', recipeController.getUserRecipes);
router.get('/save/:uid', recipeController.getSavedRecipes);
router.get("/save/count/:recipeId", recipeController.getRecipeSaveCount);
router.get('/category/:categoryId', recipeController.getRecipesByCategory);

// Protected routes
router.post('/', authenticateUser, recipeController.addRecipe);
router.put('/:recipeId', authenticateUser, attachUserData, isRecipeAuthorOrAdmin, recipeController.updateRecipe);
router.delete('/:recipeId', authenticateUser, attachUserData, isRecipeAuthorOrAdmin, recipeController.deleteRecipe);
router.post('/save/:recipeId', authenticateUser, recipeController.saveRecipe);
router.delete('/unsave/:recipeId', authenticateUser, attachUserData, isRecipeAuthorOrAdmin, recipeController.unSaveRecipe);

export default router; 