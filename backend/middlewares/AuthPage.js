import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js'; // Ensure this path is correct

export const authPage = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Find the user in the database
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Please log in again.' });
        }

        // Add the user to the request
        req.user = user;
        req.id = user._id;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Your session has expired. Please log in again.",
                error: "TOKEN_EXPIRED"
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again.",
                error: "INVALID_TOKEN"
            });
        } else {
            console.error("Authentication error:", error.message);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred during authentication.",
                error: "INTERNAL_SERVER_ERROR"
            });
        }
    }
};