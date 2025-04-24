import express from 'express';
import cloudinaryController from '../controllers/cloudinary.controller.js';
import { authenticateUser, attachUserData, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protected routes
router.post('/upload', authenticateUser,  cloudinaryController.uploadImage);
router.delete('/delete', authenticateUser, cloudinaryController.deleteImage);

export default router;