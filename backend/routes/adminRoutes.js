import express from 'express';
import { deleteUser, editUser, getAllUsers, getUserById } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/admin/user', isAuthenticated, getAllUsers);
router.get('/admin/user/:id', isAuthenticated, getUserById);
router.put('/admin/user/:id', isAuthenticated, isAdmin, editUser);
router.delete('/admin/user/:id', isAuthenticated, isAdmin, deleteUser);

export default router;
