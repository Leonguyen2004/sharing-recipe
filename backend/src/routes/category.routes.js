import express from 'express';
import categoryController from '../controllers/category.controller.js';
import { authenticateUser, attachUserData, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/type/:type', categoryController.getCategoriesByType);

// Admin routes
router.post('/', authenticateUser, attachUserData, isAdmin, categoryController.addCategory);
router.put('/:categoryId', authenticateUser, attachUserData, isAdmin, categoryController.updateCategory);
router.delete('/:categoryId', authenticateUser, attachUserData, isAdmin, categoryController.deleteCategory);

export default router; 