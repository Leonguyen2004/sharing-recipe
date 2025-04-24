import express from 'express';
import userController from '../controllers/user.controller.js';
import { authenticateUser, attachUserData, isSelfOrAdmin, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/check-exists', userController.checkUserExists);
router.get('/:uid', userController.getUserProfile);

// Protected routes
router.put('/:uid', authenticateUser, attachUserData, isSelfOrAdmin, userController.updateUserProfile);

// Admin routes
router.get('/admin/all', authenticateUser, attachUserData, isAdmin, userController.getAllUsers);
router.put('/ban/:userId', authenticateUser, attachUserData, isAdmin, userController.updateUserBanStatus);

export default router; 