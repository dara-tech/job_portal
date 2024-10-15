import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, duplicateProduct,checkoutProduct } from '../controllers/product.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { uploadFields } from '../middlewares/multer.js';

const router = express.Router();

// Create a new product
router.post('/', isAuthenticated, uploadFields, createProduct);

// Get all products
router.get('/', getAllProducts);

// Get a specific product by ID
router.get('/:id', getProductById);

// Update a product
router.put('/:id', isAuthenticated, uploadFields, updateProduct);

// Delete a product
router.delete('/:id', isAuthenticated, deleteProduct);

// Duplicate a product
router.post('/:id/duplicate', isAuthenticated, duplicateProduct);

// Checkout a product
router.post('/checkout', isAuthenticated, checkoutProduct);

export default router;
