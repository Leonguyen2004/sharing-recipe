import { db } from '../config/firebase.js';

// Lấy tất cả categories
export const getAllCategories = async () => {
  try {
    const categoriesSnapshot = await db.collection('categories').get();
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Thêm category mới
export const addCategory = async (categoryData) => {
  try {
    const docRef = await db.collection('categories').add({
      ...categoryData,
      modifyAt: new Date()
    });
    return {
      id: docRef.id,
      ...categoryData
    };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Cập nhật category
export const updateCategory = async (categoryId, categoryData) => {
  console.log(categoryData, categoryId);
  
  try {
    const docRef = db.collection('categories').doc(categoryId);
    await docRef.update({
      ...categoryData,
      modifyAt: new Date()
    });
    return {
      id: categoryId,
      ...categoryData
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Xóa category
export const deleteCategory = async (categoryId) => {
  try {
    // Xóa category khỏi collection categories
    const docRef = db.collection('categories').doc(categoryId);
    await docRef.delete();

    // Tìm tất cả các recipe có chứa category này
    const recipesSnapshot = await db.collection('recipes').where('categories', 'array-contains', categoryId).get();
    
    // Cập nhật từng recipe để xóa category này khỏi mảng categories
    const batch = db.batch();
    recipesSnapshot.docs.forEach(doc => {
      const recipeRef = db.collection('recipes').doc(doc.id);
      const categories = doc.data().categories.filter(id => id !== categoryId);
      batch.update(recipeRef, { categories });
    });
    
    // Thực hiện batch update
    if (recipesSnapshot.docs.length > 0) {
      await batch.commit();
    }
    
    return categoryId;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Lấy categories theo type
export const getCategoriesByType = async (type) => {
  try {
    const categoriesQuery = db.collection('categories').where('type', '==', type);
    const categoriesSnapshot = await categoriesQuery.get();
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories by type:', error);
    throw error;
  }
}; 