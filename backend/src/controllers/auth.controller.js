import * as authService from '../services/auth.service.js';

const authController = {
  verifyToken: (req, res) => {
    res.status(200).json({ user: req.user });
  },

  protectedRoute: (req, res) => {
    res.status(200).json({ 
      message: "This is a protected route", 
      user: req.user 
    });
  },

  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const result = await authService.registerUser({ name, email, password });

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
  
export default authController;