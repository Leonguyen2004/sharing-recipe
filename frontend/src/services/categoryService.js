import { getToken } from "./tokenService";
// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Lấy tất cả categories
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Thêm category mới
export const addCategory = async (categoryData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add category');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Cập nhật category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Xóa category
export const deleteCategory = async (categoryId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/categories/${encodeURIComponent(categoryId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete category');
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
    const response = await fetch(`${API_URL}/categories/type/${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories by type');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting categories by type:', error);
    throw error;
  }
};