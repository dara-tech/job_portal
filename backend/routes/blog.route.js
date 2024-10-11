import express from 'express';
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, likeBlog, addComment, getComments, deleteComment, incrementViewCount } from '../controllers/blog.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import Authblog from '../middlewares/Authblog.js';
import { uploadFields } from '../middlewares/multer.js';

const router = express.Router();

// Create a new blog post
router.post('/', Authblog,uploadFields, createBlog);

// Get all blog posts
router.get('/', getAllBlogs);

// Get a specific blog post by ID
router.get('/:id', getBlogById);

// Update a blog post
router.put('/:id', Authblog, uploadFields, updateBlog);

// Delete a blog post
router.delete('/:id', isAuthenticated, deleteBlog);

// Like a blog post
router.post('/:id/like', Authblog, likeBlog);

// Add a comment to a blog post
router.post('/:id/comment', Authblog, addComment);

// Get all comments for a blog post
router.get('/:id/comments', getComments);

// Delete a comment from a blog post
router.delete('/:id/comment/:commentId',isAuthenticated, Authblog, deleteComment);

// Increment the view count for a blog post
router.post('/:id/view', incrementViewCount);

export default router;
