import { getToken } from "./tokenService";
// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const uploadImage = async (file) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/cloudinary/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      url: data.url,
      publicId: data.publicId
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const deleteImage = async (publicId) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/cloudinary/delete?publicId=${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Delete failed');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image. Please try again.');
  }
};