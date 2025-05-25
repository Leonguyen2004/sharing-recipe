import { set } from 'mongoose';
import * as recipeService from '../services/recipe.service.js';

const recipeController = {
  // Lấy tất cả recipes
  getRecipes: async (req, res) => {   
    try {
      // Xử lý filters
      const filters = {};
      Object.entries(req.query).forEach(([key, value]) => {
        if (key === 'categories') {
          const categories = value.split(',');
          filters[key] = categories;
        } else if (key === 'ratingRange') {
          const [min, max] = value.split('-').map(Number);
          filters.minRating = min;
          filters.maxRating = max;
        } else if (key === 'status') {
          filters.status = value;
        }
      });

      // Xử lý các tham số
      const sortBy = req.query.sortBy || '';
      const sortOrder = req.query.sortOrder || '';
      const limit = parseInt(req.query.limit) || 10;
      const searchTerm = req.query.searchTerm;
      const startAfter = req.query.startAfter;
      const endBefore = req.query.endBefore;
      
      const result = await recipeService.getRecipes({
        filters,
        sortBy,
        sortOrder,
        limit,
        startAfter,
        endBefore,
        searchTerm,
      });
  
      res.status(200).json({
        data: result.recipes,
        pagination: {
          nextPage: result.hasNextPage ? result.lastDocId : null,
          prevPage: result.hasPrevPage ? result.firstDocId : null,
          hasNext: result.hasNextPage,
          hasPrev: result.hasPrevPage
        }
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  },

  // Lấy tất cả recipes theo categoryId
  getRecipesByCategory: async (req, res) => {
    try {
      const recipes = await recipeService.getRecipesByCategory(req.params.categoryId);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getRecipesPending: async (req, res) => {
    try {
      const recipes = await recipeService.getRecipesPending();
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  setRecipeStatus: async (req, res) => {
    try {
      const { recipeId, status } = req.body;
      const response = await recipeService.setRecipeStatus(recipeId, status);
      res.status(200).json({ 
        message: 'Recipe status updated successfully',
        recipeFieldUpdated: response 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy một recipe theo id
  getRecipeById: async (req, res) => {
    try {
      const recipe = await recipeService.getRecipeById(req.params.recipeId);
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json({ error: 'Recipe not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Thêm recipe mới
  addRecipe: async (req, res) => {
    try {
      const recipe = await recipeService.addRecipe(req.body, req.user.uid);
      res.status(201).json({ 
        message: 'Recipe added successfully',
        recipeAdded: recipe 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật recipe
  updateRecipe: async (req, res) => {
    try {
      console.log(req.body);
      
      const response = await recipeService.updateRecipe(req.params.recipeId, req.body);
      res.status(200).json({ 
        message: 'Recipe updated successfully',
        recipeFieldUpdated: response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa recipe
  deleteRecipe: async (req, res) => {
    try {
      const response = await recipeService.deleteRecipe(req.params.recipeId);
      res.status(200).json({ 
        message: 'Recipe deleted successfully',
        recipe: response 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy danh sách công thức của người dùng
  getUserRecipes: async (req, res) => {
    try {
      const recipes = await recipeService.getUserRecipes(req.params.uid);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy danh sách công thức đã lưu của người dùng
  getSavedRecipes: async (req, res) => {
    try {
      const recipes = await recipeService.getSavedRecipes(req.params.uid);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lưu công thức để xem sau
  saveRecipe: async (req, res) => {
    try {
      await recipeService.saveRecipe(req.user.uid, req.params.recipeId);
      res.status(200).json({ message: 'Recipe saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa công thức khỏi danh sách đã lưu
  unSaveRecipe: async (req, res) => {
    try {
      await recipeService.unSaveRecipe(req.user.uid, req.params.recipeId);
      res.status(200).json({ message: 'Recipe unsaved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getRecipeSaveCount: async (req, res) => {
    try {
      const saveCount = await recipeService.getRecipeSaveCount(req.params.recipeId);
      res.status(200).json({saveCount});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default recipeController; 