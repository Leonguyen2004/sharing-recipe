import express from 'express';
import recipeController from '../controllers/recipe.controller.js';
import { authenticateUser, attachUserData, isAdmin, isRecipeAuthorOrAdmin } from '../middlewares/auth.middleware.js';
import { validateRecipeCreate, validateRecipeUpdate } from '../middlewares/recipe.middleware.js';

const router = express.Router();

// Public routes
router.get('/', recipeController.getRecipes);
router.get('/:recipeId', recipeController.getRecipeById);
router.get('/personal/:uid', recipeController.getUserRecipes);
router.get('/save/:uid', recipeController.getSavedRecipes);
router.get("/save/count/:recipeId", recipeController.getRecipeSaveCount);

// Protected routes
router.post('/', authenticateUser, validateRecipeCreate, recipeController.addRecipe);
router.put('/:recipeId', authenticateUser, attachUserData, isRecipeAuthorOrAdmin, validateRecipeUpdate, recipeController.updateRecipe);
router.delete('/:recipeId', authenticateUser, attachUserData, isRecipeAuthorOrAdmin, recipeController.deleteRecipe);
router.post('/save/:recipeId', authenticateUser, recipeController.saveRecipe);
router.delete('/unsave/:recipeId', authenticateUser, attachUserData, isRecipeAuthorOrAdmin, recipeController.unSaveRecipe);

// Admin routes
router.get('/admin/pending', authenticateUser, attachUserData, isAdmin, recipeController.getRecipesPending);
router.put('/admin/status', authenticateUser, attachUserData, isAdmin, recipeController.setRecipeStatus);

export default router; 