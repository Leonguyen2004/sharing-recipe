import { db } from '../config/firebase.js';
import { updateRecipe } from './recipe.service.js';

const REVIEWS_COLLECTION = 'reviews';
const RECIPES_COLLECTION = 'recipes';
const USERS_COLLECTION = 'users';

// Lấy tất cả reviews
export const getAllReviews = async ({
  sortOrder,
  startAfter,
  limit,
  lastDocumentId
}) => {
  try {
    let reviewsRef = db.collection(REVIEWS_COLLECTION)

    // Apply sorting (default: createdAt, desc)
    if (sortOrder) {
      reviewsRef = reviewsRef.orderBy('createdAt', sortOrder);
    }
    
    // Apply pagination with startAfter
    if (startAfter) {
      const lastDoc = await db.collection('reviews').doc(lastDocumentId).get();
      reviewsRef = reviewsRef.startAfter(lastDoc);
    }

    // Fetch one extra document to check for next page
    if (limit) {
      const queryLimit = limit + 1; // Default limit of 10 + 1 if none provided
      reviewsRef = reviewsRef.limit(queryLimit);
    }

    const snapshot = await reviewsRef.get();
    const allResults = snapshot.docs;
    
    const hasNext = allResults.length > limit;

    // Cắt bỏ doc thừa dùng để check
    const results = hasNext ? allResults.slice(0, -1) : allResults;

    // Lấy thông tin reviews
    const reviews = results.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Lấy thông tin author và recipe cho mỗi review
    const reviewsWithDetails = await Promise.all(reviews.map(async (review) => {
      // Lấy thông tin author
      const authorDoc = await db.collection(USERS_COLLECTION).doc(review.authorId).get();
      const authorData = authorDoc.data();

      // Lấy thông tin recipe
      const recipeDoc = await db.collection(RECIPES_COLLECTION).doc(review.recipeId).get();
      const recipeData = recipeDoc.data();

      return {
        ...review,
        author: {
          photoURL: authorData?.photoURL || null,
          displayName: authorData?.displayName || 'Unknown User'
        },
        recipe: {
          title: recipeData?.title || 'Unknown Recipe'
        }
      };
    }));

    return {
      reviews: reviewsWithDetails,
      hasNext: hasNext,
      lastDocId: reviews[reviews.length - 1]?.id,
    };
  } catch (error) {
    console.error('Error getting reviews:', error);
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

    const { average, total } = await getReviewStats(recipeId);
    await db.collection('recipes').doc(recipeId).update({
      averageRating: average,
      totalReview: total
    });

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
export const getReviewsByRecipe = async ({
  recipeId,
  starsFilter,
  hasImageOnly,
  sortOrder,
  startAfter,
  limit
}) => {
  try {
    let reviewsRef = db.collection(REVIEWS_COLLECTION)
      .where('recipeId', '==', recipeId);

    // Apply starFilter if provided (array of numbers)
    if (starsFilter && Array.isArray(starsFilter) && starsFilter.length > 0) {
      reviewsRef = reviewsRef.where('rating', 'in', starsFilter);
    }

    // // Apply hasImageOnly filter (imageUrl is a non-empty string)
    // if (hasImageOnly) {
    //   reviewsRef = reviewsRef.where('imageUrl', '>', '');
    // }

    // Apply sorting (default: createdAt, desc)
    if (sortOrder) {
      reviewsRef = reviewsRef.orderBy('createdAt', sortOrder);
    }
    
    // Apply pagination with startAfter
    if (startAfter) {
      const lastDoc = await db.collection('reviews').doc(startAfter).get();
      reviewsRef = reviewsRef.startAfter(lastDoc);
    }

    // Fetch one extra document to check for next page
    if (limit) {
      const queryLimit = limit + 1; // Default limit of 10 + 1 if none provided
      reviewsRef = reviewsRef.limit(queryLimit);
    }

    const snapshot = await reviewsRef.get();
    const allResults = snapshot.docs;
    
    const hasNext = allResults.length > limit;

    // Cắt bỏ doc thừa dùng để check
    const results = hasNext ? allResults.slice(0, -1) : allResults;

    const reviews = results.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      reviews,
      hasNext: hasNext,
      lastDocId: reviews[reviews.length - 1]?.id,
    };
  } catch (error) {
    console.error('Error getting reviews by recipe:', error);
    throw error;
  }
};

// Xóa review
export const deleteReview = async (reviewId) => {
  try {
    const reviewRef = db.collection(REVIEWS_COLLECTION).doc(reviewId);
    const reviewSnap = await reviewRef.get();
    const recipeId = reviewSnap.data().recipeId;
    await reviewRef.delete();

    const { average, total } = await getReviewStats(recipeId);
    await db.collection('recipes').doc(recipeId).update({
      averageRating: average,
      totalReview: total
    });

    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Cập nhật review
export const updateReview = async (reviewId, newReviewData) => {
  try {
    const reviewRef = db.collection(REVIEWS_COLLECTION).doc(reviewId);
    await reviewRef.update(newReviewData);
    const reviewSnap = await reviewRef.get();
    const recipeId = reviewSnap.data().recipeId;

    const { average, total } = await getReviewStats(recipeId);
    await db.collection('recipes').doc(recipeId).update({
      averageRating: average,
      totalReview: total
    });

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
    const reviewsSnapshot = await db
    .collection(REVIEWS_COLLECTION)
    .where('recipeId', '==', recipeId)
    .get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
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