import { db } from '../config/firebase.js';
import { deleteImage } from './cloudinary.service.js';

// Lấy tất cả recipes
export const getAllRecipes = async () => {
  try {
    const recipesSnapshot = await db.collection('recipes').get();
    return recipesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting recipes:', error);
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
export const addRecipe = async (recipeData) => {
  try {
    const docRef = await db.collection('recipes').add({
      ...recipeData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

// Cập nhật recipe
export const updateRecipe = async (recipeId, newRecipeData) => {
  try {
    const recipeRef = db.collection('recipes').doc(recipeId);

    await recipeRef.update({
      ...newRecipeData,
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
    const recipeDoc = await recipeRef.get();
    
    if (!recipeDoc.exists) {
      throw new Error('Recipe not found');
    }

    const recipeData = recipeDoc.data();

    // Xóa ảnh từ Cloudinary nếu có imagePublicId
    if (recipeData.imagePublicId) {
      await deleteImage(recipeData.imagePublicId);
    }

    // Xóa recipe chính
    await recipeRef.delete();

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

    return true;
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