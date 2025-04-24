import express from "express";
import authController from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Piblic routes
router.post('/register', authController.registerUser);
router.post('/verify-token',authenticateUser, authController.verifyToken);

export default router;