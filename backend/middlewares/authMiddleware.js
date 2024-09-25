import { User } from '../models/user.model.js'; // Ensure the path is correct

export const isAdmin = (req, res, next) => {
  const userId = req.id; // Get user ID from the request
  if (!userId) {
    return res.status(401).json({
      message: "User ID not found. Authentication may have failed.",
      success: false,
    });
  }

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
          success: false,
        });
      }
      if (user.role !== 'admin') {
        return res.status(403).json({
          message: "Access denied. Admins only.",
          success: false,
        });
      }
      next(); // Proceed to the next middleware
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        success: false,
      });
    });
};


