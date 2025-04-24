import * as recipeService from '../services/recipe.service.js';

const recipeController = {
  // Lấy tất cả recipes
  getAllRecipes: async (req, res) => {
    try {
      const recipes = await recipeService.getAllRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      const recipeId = await recipeService.addRecipe(req.body);
      res.status(201).json({ id: recipeId, message: 'Recipe added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật recipe
  updateRecipe: async (req, res) => {
    try {
      await recipeService.updateRecipe(req.params.recipeId, req.body);
      res.status(200).json({ message: 'Recipe updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa recipe
  deleteRecipe: async (req, res) => {
    try {
      await recipeService.deleteRecipe(req.params.recipeId);
      res.status(200).json({ message: 'Recipe deleted successfully' });
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