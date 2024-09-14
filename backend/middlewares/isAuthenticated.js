import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated. No token provided.",
        success: false,
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user ID from the token to the request object
    req.id = decoded.userId;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Log the error and return an appropriate response
    console.error("Authentication error:", error.message);

    // Differentiate between token expiration and other token errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please log in again.",
        success: false,
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        success: false,
      });
    } else {
      // General error handling
      return res.status(500).json({
        message: "An internal server error occurred.",
        success: false,
      });
    }
  }
};

export default isAuthenticated;
