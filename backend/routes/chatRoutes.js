import express from 'express';
import { sendMessage, getChatHistory, getRecentChat } from '../controllers/chatController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Send a message
router.post('/send', isAuthenticated, sendMessage);

// Get chat history with a specific user
router.get('/history/:receiverId', isAuthenticated, getChatHistory);
router.get('/recent', isAuthenticated, getRecentChat);

export default router;
