import { LogIn } from "lucide-react";
import { getToken } from "./tokenService";
// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Lấy tất cả recipes
export const getAllRecipes = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/recipes${queryString ? `?${queryString}` : ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting recipes:', error);
    throw error;
  }
};

// Lấy recipes theo category
export const getRecipesByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/recipes/category/:${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting recipes:', error);
    throw error;
  }
};

// Lấy một recipe theo id
export const getRecipeById = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${recipeId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};

export const getRecipesPending = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/admin/pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch(error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};

export const setRecipeStatus = async (recipeId, status) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/admin/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeId, status })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch(error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};

// Thêm recipe mới
export const addRecipe = async (recipeData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recipeData)
    });
    console.log(JSON.stringify(recipeData));
    
    if (!response.ok) {
      throw new Error('Failed to add recipe');
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

// Cập nhật recipe
export const updateRecipe = async (recipeId, recipeData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recipeData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

// Xóa recipe
export const deleteRecipe = async (recipeId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

// Lấy danh sách công thức của người dùng
export const getUserRecipes = async (userId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/personal/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user recipes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user recipes:', error);
    throw error;
  }
};

// Lấy danh sách công thức đã lưu của người dùng
export const getSavedRecipes = async (userId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/save/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch saved recipes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    throw error;
  }
};

// Lưu công thức để xem sau
export const saveRecipe = async (recipeId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/save/${recipeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to save recipe');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

// Xóa công thức khỏi danh sách đã lưu
export const unSaveRecipe = async (recipeId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/recipes/unsave/${recipeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to unsave recipe');
    }
    
    return true;
  } catch (error) {
    console.error('Error unsaving recipe:', error);
    throw error;
  }
};

// Đếm số lượt lưu của một công thức
export const getRecipeSaveCount = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/recipes/save/count/${recipeId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get recipe save count');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting recipe save count:', error);
    throw error;
  }
};

