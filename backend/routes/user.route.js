import express from 'express';
import { login, register, updateProfile, logout, getUserById, changePassword, getUserResumes, createResume, deleteResume , updateResume, getResumeById} from '../controllers/user.controller.js';
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
router.get('/logout', logout);
router.post('/change-password/:id', isAuthenticated, changePassword);

// Resume routes
// Get all resumes for a user
router.get('/resumes', isAuthenticated, getUserResumes);

// Create a new resume
router.post('/resumes', isAuthenticated, createResume);

// Update a resume
router.put('/resumes/:resumeId', isAuthenticated, updateResume);

// Get a specific resume
router.get('/resumes/:resumeId', isAuthenticated, getResumeById);

// Delete a resume
router.delete('/resumes/:resumeId', isAuthenticated, deleteResume);


export default router;
