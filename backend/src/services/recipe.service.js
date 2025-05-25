import { db } from '../config/firebase.js';
import { deleteImage } from './cloudinary.service.js';

const applyFiltersAndSearch = (query, filters, searchTerm) => {
  // Filter status
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  
  // Filter category
  if (filters.categories && filters.categories.length > 0) {
    query = query.where('categories', 'array-contains-any', filters.categories);
  }

  // Filter rating
  if (filters.minRating !== undefined && filters.maxRating !== undefined) {
    query = query
      .where('averageRating', '>=', filters.minRating)
      .where('averageRating', '<', filters.maxRating); 
  }

  // Search
  if (searchTerm) {
    const searchText = searchTerm.toLowerCase();
    query = query
      .where('titleLowercase', '>=', searchText)
      .where('titleLowercase', '<=', searchText + '\uf8ff');
  }

  return query;
};

// Lấy tất cả recipes
export const getRecipes = async ({ 
  filters, 
  sortBy, 
  sortOrder, 
  limit, 
  startAfter, 
  endBefore,
  searchTerm 
}) => {
  try {

    // Xử lý phân trang ngược
    if (endBefore) {
      let query = db.collection('recipes');
      query = applyFiltersAndSearch(query, filters, searchTerm);
      query = query.orderBy(sortBy, sortOrder);
    
      const startBeforeDoc = await db.collection('recipes').doc(endBefore).get();
      query = query.endBefore(startBeforeDoc);
    
      query = query.select('title', 'totalTime', 'imageUrl', 'categories', 'averageRating', 'saveCount');
      query = query.limitToLast(limit + 1); // Lấy thêm 1 tài liệu
    
      const snapshot = await query.get();
      const allRecipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
      // Kiểm tra xem có trang trước không
      const hasPrevPage = allRecipes.length > limit;
    
      // Loại bỏ tài liệu thừa nếu có
      const recipes = hasPrevPage ? allRecipes.slice(0, limit) : allRecipes;
    
      return {
        recipes,
        firstDocId: recipes[0]?.id,
        lastDocId: recipes[recipes.length - 1]?.id,
        hasNextPage: true,
        hasPrevPage: hasPrevPage
      };
    }

    // Xử lý phân trang tiến/trang đầu
    let query = db.collection('recipes');
    query = applyFiltersAndSearch(query, filters, searchTerm);
    query = query.orderBy(sortBy, sortOrder);
    
    if (startAfter) {
      const lastDoc = await db.collection('recipes').doc(startAfter).get();
      query = query.startAfter(lastDoc);
    }

    query = query.select('title', 'totalTime', 'imageUrl', 'categories', 'averageRating', 'saveCount')

    query = query.limit(limit + 1); // Fetch thêm 1 doc để check hasNext

    const snapshot = await query.get();
    const allResults = snapshot.docs;
    const hasNextPage = allResults.length > limit;
    
    // Cắt bỏ doc thừa dùng để check
    const results = hasNextPage ? allResults.slice(0, -1) : allResults;

    const recipes = results.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      recipes,
      firstDocId: recipes[0]?.id,
      lastDocId: recipes[recipes.length - 1]?.id,
      hasNextPage,
      hasPrevPage: !!startAfter // Cải tiến logic này tùy use case
    };

  } catch (error) {
    throw new Error(`Firestore error: ${error.message}`);
  }
};

export const getRecipesPending = async () => {
  try {
    const recipesSnapshot = await db
      .collection('recipes')
      .where('status', 'in', ['pending', 'reject'])
      .select('title', 'totalTime', 'imageUrl', 'categories', 'averageRating', 'saveCount', 'createdAt', 'status')
      .get();

    return recipesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};

// Lấy recipes có ít nhất 1 categoryId nằm trong mảng categories
export const getRecipesByCategory = async (categoryId) => {
  try {
    const recipesSnapshot = await db
      .collection('recipes')
      .where('categories', 'array-contains', categoryId)
      .get();

    return recipesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting recipes by category:', error);
    throw error;
  }
};

// Lấy một recipe theo id
export const getRecipeById = async (recipeId) => {
  try {
    const docRef = db.collection('recipes').doc(recipeId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};

// Thêm recipe mới
export const addRecipe = async (recipeData, authorId) => {
  try {
    const createdAt = new Date();
    const titleLowercase = recipeData.title.toLowerCase();
    const averageRating = 0;
    const saveCount = 0;

    const newRecipe = {
      ...recipeData,
      titleLowercase,
      createdAt,
      averageRating,
      saveCount,
      status: "pending",
      userId: authorId,
    };

    const docRef = await db.collection('recipes').add(newRecipe);

    const userRef = db.collection('users').doc(authorId);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      const currentRecipeCount = userSnap.data().recipeCount || 0;
      await userRef.update({
        recipeCount: currentRecipeCount + 1
      });
    }

    return {
      id: docRef.id,
      ...newRecipe
    };
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

// Cập nhật recipe
export const updateRecipe = async (recipeId, newRecipeData) => {
  try {
    const recipeRef = db.collection('recipes').doc(recipeId);

    const titleLowercase = newRecipeData.title.toLowerCase();
    await recipeRef.update({
      ...newRecipeData,
      titleLowercase,
      updatedAt: new Date() // tự động thêm timestamp hiện tại
    });

    return {
      id: recipeId,
      ...newRecipeData,
    };
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

// Xóa recipe
export const deleteRecipe = async (recipeId) => {
  try {
    // Lấy thông tin recipe trước khi xóa để có imagePublicId
    const recipeRef = db.collection('recipes').doc(recipeId);
    const recipeSnap = await recipeRef.get();
    
    if (!recipeSnap.exists) {
      throw new Error('Recipe not found');
    }

    const recipeData = recipeSnap.data();

    // Xóa ảnh từ Cloudinary nếu có imagePublicId
    if (recipeData.imagePublicId) {
      await deleteImage(recipeData.imagePublicId);
    }

    // Xóa recipe chính
    await recipeRef.delete();

    // Giảm số lượng công thức của người dùng
    const userRef = db.collection('users').doc(recipeData.userId);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      const currentRecipeCount = userSnap.data().recipeCount || 0;
      await userRef.update({
        recipeCount: Math.max(currentRecipeCount - 1, 0) // Đảm bảo không âm
      });
    }

    // Xóa các bản ghi trong savedRecipes
    const savedRecipesQuery = db.collection('savedRecipes')
      .where('recipeId', '==', recipeId);
    const savedRecipesSnapshot = await savedRecipesQuery.get();
    
    const savedRecipesDeletePromises = savedRecipesSnapshot.docs.map(doc => 
      db.collection('savedRecipes').doc(doc.id).delete()
    );
    await Promise.all(savedRecipesDeletePromises);

    // Xóa các bản ghi trong reviews
    const reviewsQuery = db.collection('reviews')
      .where('recipeId', '==', recipeId);
    const reviewsSnapshot = await reviewsQuery.get();
    
    const reviewsDeletePromises = reviewsSnapshot.docs.map(doc => 
      db.collection('reviews').doc(doc.id).delete()
    );
    await Promise.all(reviewsDeletePromises);

    return {
      id: recipeId,
      ...recipeData
    };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

// Lấy danh sách công thức của người dùng
export const getUserRecipes = async (uid) => {
  try {
    const recipesQuery = db.collection('recipes').where('userId', '==', uid);
    const recipesSnapshot = await recipesQuery.get();
    return recipesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user recipes:', error);
    throw error;
  }
};

// Lấy danh sách công thức đã lưu của người dùng
export const getSavedRecipes = async (uid) => {
  try {
    const savedRecipesQuery = db.collection('savedRecipes').where('userId', '==', uid);
    const savedRecipesSnapshot = await savedRecipesQuery.get();
    
    const savedRecipesData = await Promise.all(
      savedRecipesSnapshot.docs.map(async (doc) => {
        const recipeId = doc.data().recipeId;
        const recipeDoc = await db.collection('recipes').doc(recipeId).get();
        if (recipeDoc.exists) {
          return {
            id: recipeDoc.id,
            ...recipeDoc.data()
          };
        }
        return null;
      })
    );
    
    return savedRecipesData.filter(recipe => recipe !== null);
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    throw error;
  }
};

// Lưu công thức để xem sau
export const saveRecipe = async (uid, recipeId) => {
  try {
    await db.collection('savedRecipes').add({
      userId: uid,
      recipeId: recipeId,
      createdAt: new Date()
    });

    const saveCount = await getRecipeSaveCount(recipeId);
    // Cập nhật trực tiếp vào document của công thức
    await db.collection('recipes').doc(recipeId).update({
      saveCount: saveCount
    });

    return true;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

// Xóa công thức khỏi danh sách đã lưu
export const unSaveRecipe = async (uid, recipeId) => {
  try {
    const savedRecipesQuery = db.collection('savedRecipes')
      .where('userId', '==', uid)
      .where('recipeId', '==', recipeId);
    
    const querySnapshot = await savedRecipesQuery.get();
    
    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];
      await db.collection('savedRecipes').doc(docToDelete.id).delete();
    }

    const saveCount = await getRecipeSaveCount(recipeId);
    // Cập nhật trực tiếp vào document của công thức
    await db.collection('recipes').doc(recipeId).update({
      saveCount: saveCount
    });
    
    return true;
  } catch (error) {
    console.error('Error unsaving recipe:', error);
    throw error;
  }
}; 

export const getRecipeSaveCount = async (recipeId) => {
  try {
    const snapshot = await db
      .collection("savedRecipes")
      .where("recipeId", "==", recipeId)
      .get();

    return snapshot.size; // Số lượng document khớp
  } catch (error) {
    console.error("Error getting recipe save count:", error);
    throw error;
  }
};

export const setRecipeStatus = async (recipeId, status) => {
  try {
    const recipeRef = db.collection('recipes').doc(recipeId);
    await recipeRef.update({ status });
    return true;
  } catch (error) {
    console.error('Error updating recipe status:', error);
    throw error;
  }
}