import express from "express";
import { login, refreshAccessToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/token", refreshAccessToken);

export default router;
