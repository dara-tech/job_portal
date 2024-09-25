import express from 'express';
import { login, register, updateProfile, logout, getUserById } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload, uploadFields } from '../middlewares/multer.js';

const router = express.Router();

// Register route (handling single file upload)
router.post('/register', singleUpload, register);

// Login route
router.post('/login', login);

// Profile update route (handling multiple file uploads)
router.post('/profile/update', isAuthenticated, uploadFields, updateProfile);


// Logout route
router.get('/logout', isAuthenticated, logout);

export default router;
