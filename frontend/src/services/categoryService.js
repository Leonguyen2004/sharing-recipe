import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

// Lấy tất cả categories
export const getAllCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => ({
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
    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, {
      name: categoryData.name,
      type: categoryData.type,
      imageUrl: categoryData.imageUrl,
      imagePublicId: categoryData.imagePublicId,
      modifyAt: new Date().toISOString()
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
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      name: categoryData.name,
      type: categoryData.type,
      imageUrl: categoryData.imageUrl,
      imagePublicId: categoryData.imagePublicId,
      modifyAt: new Date().toISOString()
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
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
    return categoryId;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Lấy categories theo type
export const getCategoriesByType = async (type) => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories by type:', error);
    throw error;
  }
}; 