import { db } from '../config/firebase.js';

const RECIPES_COLLECTION = 'recipes';
const USERS_COLLECTION = 'users';
const REVIEWS_COLLECTION = 'reviews';

export const getAdminDashboardStats = async () => {
  try {
    // Lấy tổng số recipe
    const totalRecipesSnapshot = await db.collection(RECIPES_COLLECTION).count().get();
    const totalRecipes = totalRecipesSnapshot.data().count;

    // Lấy số recipe pending
    const pendingRecipesSnapshot = await db.collection(RECIPES_COLLECTION)
      .where('status', '==', 'pending')
      .count()
      .get();
    const pendingRecipes = pendingRecipesSnapshot.data().count;

    // Lấy recipe có saveCount cao nhất
    const mostSavedRecipeSnapshot = await db.collection(RECIPES_COLLECTION)
      .orderBy('saveCount', 'desc')
      .limit(1)
      .get();
    const mostSavedRecipe = mostSavedRecipeSnapshot.docs[0]?.data() || null;

    // Lấy tổng số user
    const totalUsersSnapshot = await db.collection(USERS_COLLECTION).count().get();
    const totalUsers = totalUsersSnapshot.data().count;

    // Lấy số user bị banned
    const bannedUsersSnapshot = await db.collection(USERS_COLLECTION)
      .where('banned', '==', true)
      .count()
      .get();
    const bannedUsers = bannedUsersSnapshot.data().count;

    // Lấy user có recipeCount cao nhất
    const topUserSnapshot = await db.collection(USERS_COLLECTION)
      .orderBy('recipeCount', 'desc')
      .limit(1)
      .get();
    const topUser = topUserSnapshot.docs[0]?.data() || null;

    // Lấy tổng số review
    const totalReviewsSnapshot = await db.collection(REVIEWS_COLLECTION).count().get();
    const totalReviews = totalReviewsSnapshot.data().count;

    // Lấy số recipe mới trong tuần hiện tại
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyRecipesSnapshot = await db.collection(RECIPES_COLLECTION)
      .where('createdAt', '>=', oneWeekAgo)
      .count()
      .get();
    const weeklyRecipes = weeklyRecipesSnapshot.data().count;

    // Lấy số recipe mới trong tháng hiện tại
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const monthlyRecipesSnapshot = await db.collection(RECIPES_COLLECTION)
      .where('createdAt', '>=', oneMonthAgo)
      .count()
      .get();
    const monthlyRecipes = monthlyRecipesSnapshot.data().count;

    return {
      recipes: {
        total: totalRecipes,
        pending: pendingRecipes,
        mostSaved: mostSavedRecipe,
        weekly: weeklyRecipes,
        monthly: monthlyRecipes
      },
      users: {
        total: totalUsers,
        banned: bannedUsers,
        topContributor: topUser?.displayName || 'No data'
      },
      reviews: {
        total: totalReviews
      }
    };
  } catch (error) {
    console.error('Error getting admin dashboard stats:', error);
    throw error;
  }
};
