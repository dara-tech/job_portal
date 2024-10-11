import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js';

const Authblog = async (req, res, next) => {
  try {
    // Extract the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        message: "Authentication failed. No token provided.",
        success: false,
      });
    }

    // Verify and decode the token using the SECRET_KEY from environment variables
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user in the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please log in again.",
        success: false,
      });
    }

    // Attach the user object to the request
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
        success: false,
        error: "TOKEN_EXPIRED",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        success: false,
        error: "INVALID_TOKEN",
      });
    } else {
      return res.status(500).json({
        message: "An internal server error occurred during authentication.",
        success: false,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  }
};

export default Authblog;
