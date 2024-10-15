import express from 'express';
import { createPage, getAllPages, getPageBySlug, updatePage, deletePage } from '../controllers/page.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { authPage } from '../middlewares/AuthPage.js';

const router = express.Router();

// Create a new page
router.post('/pages', isAuthenticated, createPage);

// Get all pages
router.get('/pages', getAllPages);

// Get a single page by slug
router.get('/pages/:slug', getPageBySlug);

// Update a page
router.put('/pages/:slug', authPage, updatePage);

// Delete a page
router.delete('/pages/:slug', isAuthenticated, deletePage);

export default router;
