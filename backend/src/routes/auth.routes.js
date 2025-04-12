import express from "express";
import authController from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/verify-token", verifyToken, authController.verifyToken);
router.get("/protected", verifyToken, authController.protectedRoute);

export default router;