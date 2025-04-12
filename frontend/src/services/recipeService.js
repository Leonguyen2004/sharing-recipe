import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';

// Lấy tất cả recipes
export const getAllRecipes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'recipes'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting recipes:', error);
    throw error;
  }
};

// Lấy một recipe theo id
export const getRecipeById = async (id) => {
  try {
    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
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
    const docRef = await addDoc(collection(db, 'recipes'), recipeData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

// Cập nhật recipe
export const updateRecipe = async (id, recipeData) => {
  try {
    const docRef = doc(db, 'recipes', id);
    await updateDoc(docRef, recipeData);
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

// Xóa recipe
export const deleteRecipe = async (id) => {
  try {
    const docRef = doc(db, 'recipes', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

// Lấy tất cả categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}; 