import { uploadImage, deleteImage } from '../services/cloudinary.service.js';

const cloudinaryController = {
  // Upload ảnh
  uploadImage: async (req, res) => {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.files.file;
      const result = await uploadImage(file.tempFilePath);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa ảnh
  deleteImage: async (req, res) => {
    try {
      const { publicId } = req.query; // Lấy từ URL query thay vì body
  
      if (!publicId) {
        return res.status(400).json({ error: 'publicId is required' });
      }
  
      await deleteImage(publicId); // Gọi hàm xử lý xóa ảnh
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }  
};

export default cloudinaryController; 