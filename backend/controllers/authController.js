import jwt from "jsonwebtoken";
import User from "../models/User"; // Your user model

const refreshTokens = []; // This should ideally be stored in a database

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !user.verifyPassword(password)) {
    return res.status(401).json({ message: "Invalid credentials.", success: false });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  refreshTokens.push(refreshToken); // Store the refresh token

  res.json({ accessToken, refreshToken, success: true });
};

export const refreshAccessToken = (req, res) => {
  const { token } = req.body;

  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Refresh token is invalid.", success: false });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Refresh token is invalid.", success: false });
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken, success: true });
  });
};
