import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Extract the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
      // If no token is found, return a 401 Unauthorized response
      return res.status(401).json({
        message: "Authentication failed. No token provided.",
        success: false,
      });
    }

    // Verify and decode the token using the SECRET_KEY from environment variables
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the user ID from the decoded token to the request object
    req.id = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Authentication error:", error.message);

    // Handle different types of authentication errors
    if (error.name === "TokenExpiredError") {
      // Handle expired token
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
        success: false,
        error: "TOKEN_EXPIRED",
      });
    } else if (error.name === "JsonWebTokenError") {
      // Handle other JWT errors (e.g., invalid signature)
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        success: false,
        error: "INVALID_TOKEN",
      });
    } else {
      // Handle general server errors
      return res.status(500).json({
        message: "An internal server error occurred during authentication.",
        success: false,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  }
};

export default isAuthenticated;