import { getAdminDashboardStats } from '../services/admin.service.js';

const adminController = {
    getAdminDashboard : async (req, res) => {
        try {
          const stats = await getAdminDashboardStats();
          res.status(200).json({
            success: true,
            data: stats
          });
        } catch (error) {
          console.error('Error getting admin dashboard stats:', error);
          res.status(500).json({
            success: false,
            message: 'Internal server error'
          });
        }
    }
}

export default adminController
