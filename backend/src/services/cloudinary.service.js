import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'recipes',
      resource_type: 'auto',
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const deleteImage = async (publicId) => {
  if (!publicId) {
    throw new Error('publicId is required');
  }

  try {
    console.log('Attempting to delete image:', publicId); // Log để debug
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary response:', result); // Log phản hồi từ Cloudinary
    if (result.result === 'ok') {
      return true;
    } else if (result.result === 'not found') {
      throw new Error('Image not found');
    } else {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error(error.message || 'Failed to delete image');
  }
};