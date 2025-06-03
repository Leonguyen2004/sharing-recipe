import express from 'express';
import adminController from '../controllers/admin.controller.js';
import { authenticateUser, attachUserData, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', authenticateUser, attachUserData, isAdmin, adminController.getAdminDashboard);

export default router;
