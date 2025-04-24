import * as categoryService from '../services/category.service.js';

const categoryController = {
  // Lấy tất cả categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Thêm category mới
  addCategory: async (req, res) => {
    console.log("here controller");
    
    try {
      const category = await categoryService.addCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật category
  updateCategory: async (req, res) => {
    try {
      const category = await categoryService.updateCategory(req.params.categoryId, req.body);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa category
  deleteCategory: async (req, res) => {
    try {
      await categoryService.deleteCategory(req.params.categoryId);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy categories theo type
  getCategoriesByType: async (req, res) => {
    try {
      const categories = await categoryService.getCategoriesByType(req.params.type);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default categoryController; 