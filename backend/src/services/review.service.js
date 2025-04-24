import { db } from '../config/firebase.js';

const REVIEWS_COLLECTION = 'reviews';

// Lấy tất cả reviews
export const getAllReviews = async () => {
  try {
    const reviewsRef = db.collection(REVIEWS_COLLECTION);
    const snapshot = await reviewsRef.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw error;
  }
};

export const findReviewByUserAndRecipe = async (userId, recipeId) => {
  const reviewsRef = db.collection("reviews");
  const querySnapshot = await reviewsRef
    .where("authorId", "==", userId)
    .where("recipeId", "==", recipeId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];
  return { 
    id: doc.id, 
    ...doc.data() 
  };
};

// Thêm review mới
export const addReview = async (recipeId, reviewData, uid) => {
  try {
    const reviewsRef = db.collection(REVIEWS_COLLECTION);
    const newReview = {
      ...reviewData,
      recipeId,
      authorId: uid,
      createdAt: new Date()
    };
    const docRef = await reviewsRef.add(newReview);
    return {
      id: docRef.id,
      ...newReview
    };
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Lấy reviews theo recipe
export const getReviewsByRecipe = async (recipeId) => {
  try {
    const reviewsRef = db.collection(REVIEWS_COLLECTION);
    const snapshot = await reviewsRef.where('recipeId', '==', recipeId).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting reviews by recipe:', error);
    throw error;
  }
};

// Xóa review
export const deleteReview = async (reviewId, uid) => {
  try {
    const reviewRef = db.collection(REVIEWS_COLLECTION).doc(reviewId);
    await reviewRef.delete();
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Cập nhật review
export const updateReview = async (reviewId, newReviewData, uid) => {
  try {
    const reviewRef = db.collection(REVIEWS_COLLECTION).doc(reviewId);
    await reviewRef.update(newReviewData);

    return {
      id: reviewId,
      ...newReviewData,
    };
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Lấy thống kê review của recipe
export const getReviewStats = async (recipeId) => {
  try {
    const reviews = await getReviewsByRecipe(recipeId);
    
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        starCounts: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
      };
    }

    const starCounts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    let totalRating = 0;

    for (const review of reviews) {
      const rating = review.rating;
      totalRating += rating;

      if (starCounts[rating] !== undefined) {
        starCounts[rating]++;
      }
    }

    const average = totalRating / reviews.length;

    return {
      average: Number(average.toFixed(1)),
      total: reviews.length,
      starCounts
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw error;
  }
}; 