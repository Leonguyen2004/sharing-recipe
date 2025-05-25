import * as userService from '../services/user.service.js';

const userController = {
  // Lấy thông tin chi tiết người dùng
  getUserProfile: async (req, res) => {
    try {
      const user = await userService.getUserProfile(req.params.uid);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật thông tin người dùng
  updateUserProfile: async (req, res) => {
    try {
      await userService.updateUserProfile(req.params.uid, req.body);
      res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Kiểm tra xem người dùng đã tồn tại chưa (qua email)
  checkUserExists: async (req, res) => {
    try {
      const exists = await userService.checkUserExists(req.query.email);
      res.status(200).json({ exists });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const { 
        searchTerm,
        sortBy,
        sortOrder,
        lastDocumentId
      } = req.query;

      const limit = Math.min(parseInt(req.query.limit) || 10, 100);

      const banned = req.query.banned === 'true' ? true : false;

      const result = await userService.getAllUsers(searchTerm, banned, sortBy, sortOrder, limit, lastDocumentId);

      res.status(200).json({
        data: result.users,
        pagination: {
          lastDocumentId: result.lastDocumentId,
          hasNext: result.hasNext,
        }
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  updateUserBanStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const { banned } = req.body;
      const result = await userService.updateUserBanStatus(userId, banned);
      res.json(result);
    } catch (error) {
      console.error('Error updating user ban status:', error);
      res.status(500).json({ error: 'Failed to update user ban status' });
    }
  }
};

export default userController; 