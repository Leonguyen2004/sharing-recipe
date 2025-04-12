import express from 'express';
import { deleteImage } from '../services/cloudinaryService.js';

const router = express.Router();

router.delete('/delete/:publicId', async (req, res) => {
  try {
    await deleteImage(req.params.publicId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;