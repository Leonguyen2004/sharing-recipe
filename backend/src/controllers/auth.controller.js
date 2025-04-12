const authController = {
    verifyToken: (req, res) => {
      res.status(200).json({ user: req.user });
    },
  
    protectedRoute: (req, res) => {
      res.status(200).json({ 
        message: "This is a protected route", 
        user: req.user 
      });
    }
  };
  
  export default authController;