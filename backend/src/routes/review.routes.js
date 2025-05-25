import express from 'express';
import reviewController from '../controllers/review.controller.js';
import { authenticateUser, attachUserData, isAdmin, isReviewAuthorOrAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all reviews
router.get('/', authenticateUser, attachUserData, isAdmin, reviewController.getAllReviews);

// Get my review for recipe
router.get("/my/:recipeId", authenticateUser, reviewController.getMyReviewForRecipe);

// Add a new review
router.post('/', authenticateUser, reviewController.addReview);

// Get reviews by recipe
router.get('/recipe', reviewController.getReviewsByRecipe);

// Delete a review
router.delete('/:reviewId', authenticateUser, attachUserData, isReviewAuthorOrAdmin, reviewController.deleteReview);

// Update a review
router.put('/:reviewId', authenticateUser, attachUserData, isReviewAuthorOrAdmin, reviewController.updateReview);

// Get review stats for a recipe
router.get('/stats/:recipeId', reviewController.getReviewStats);

export default router; 