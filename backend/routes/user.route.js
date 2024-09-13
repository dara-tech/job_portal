import express from 'express';
import { login, register, updateProfile, logout } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload, uploadFields } from '../middlewares/multer.js';

const router = express.Router();

// Register route (handling single file upload)
router.route('/register').post(singleUpload, register);


// Login route
router.route('/login').post(login);

// Profile update route (handling multiple file uploads)
router.route('/profile/update').post(isAuthenticated, uploadFields, updateProfile);

// Logout route
router.route('/logout').get(logout);

export default router;
