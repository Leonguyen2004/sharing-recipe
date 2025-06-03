import * as reviewService from '../services/review.service.js';

const reviewController = {
  // Lấy tất cả reviews
  getAllReviews: async (req, res) => {
    try {
      const sortOrder = req.query.sortOrder || 'desc';

      const startAfter = req.query.startAfter || null;

      const limit = Math.min(parseInt(req.query.limit) || 10, 100);

      const lastDocumentId = req.query.lastDocumentId || null;

      const reviewsResult = await reviewService.getAllReviews({
        sortOrder,
        startAfter,
        limit,
        lastDocumentId
      });

      res.status(200).json({
        data: reviewsResult.reviews,
        pagination: {
          hasNext: reviewsResult.hasNext,
          lastDocId: reviewsResult.lastDocId
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy review của người dùng hiện tại cho 1 recipe
  getMyReviewForRecipe: async (req, res) => {
    try {
      const review = await reviewService.findReviewByUserAndRecipe(req.user.uid, req.params.recipeId);
      res.status(200).json({ review: review || null });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Thêm review mới
  addReview: async (req, res) => {
    try {
      const { recipeId, reviewData } = req.body;
      const uid = req.user.uid;
      const newReview = await reviewService.addReview(recipeId, reviewData, uid);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy reviews theo recipe
  getReviewsByRecipe: async (req, res) => {
    try {
      const recipeId = req.query.recipeId || "";

      const rawStarsFilter = req.query.starsFilter;

      const starsFilter = rawStarsFilter ? rawStarsFilter.split(',').map(Number) : [];

      const hasImageOnly = req.query.hasImageOnly || false;

      const sortOrder = req.query.sortOrder || 'desc';

      const startAfter = req.query.startAfter || null;

      const limit = Math.min(parseInt(req.query.limit) || 10, 100);

      const reviewsResult = await reviewService.getReviewsByRecipe({
        recipeId,
        starsFilter,
        hasImageOnly,
        sortOrder,
        startAfter,
        limit
      });
      
      res.status(200).json({
        data: reviewsResult.reviews,
        pagination: {
          hasNext: reviewsResult.hasNext,
          lastDocId: reviewsResult.lastDocId
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa review
  deleteReview: async (req, res) => {
    try {
      await reviewService.deleteReview(req.params.reviewId);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      if (error.message === 'Review not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Cập nhật review
  updateReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const newReviewData = req.body;
      
      const updatedReview = await reviewService.updateReview(reviewId, newReviewData);
      res.status(200).json(updatedReview);
    } catch (error) {
      if (error.message === 'Review not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Lấy thống kê review của recipe
  getReviewStats: async (req, res) => {
    try {
      const { recipeId } = req.params;
      const stats = await reviewService.getReviewStats(recipeId);
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default reviewController; 