import { getToken } from "./tokenService";
// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Lấy tất cả đánh giá
export const getAllReviews = async () => {
  try {
    const response = await fetch(`${API_URL}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw error;
  }
};

// Lấy review của người dùng hiện tại
export const getReviewByUserAndRecipe = async (recipeId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/reviews/my/${recipeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting reviews by user and recipe:', error);
    throw error;
  }
}

// Thêm đánh giá mới
export const addReview = async (recipeId, reviewData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        reviewData,
        recipeId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add review');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Lấy đánh giá theo công thức
export const getReviewsByRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/recipe/${recipeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews by recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting reviews by recipe:', error);
    throw error;
  }
};

// Xóa đánh giá
export const deleteReview = async (reviewId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Cập nhật đánh giá
export const updateReview = async (reviewId, newReviewData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newReviewData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Lấy thống kê đánh giá
export const getReviewStats = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/stats/${recipeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch review stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw error;
  }
};
