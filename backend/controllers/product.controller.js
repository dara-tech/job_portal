import Product from '../models/product.model.js';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from '../models/user.model.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, discount } = req.body;
    const file = req.files?.image?.[0];

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    // Fetch the user using the ID from the middleware
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the user's role allows them to create products
    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only sellers and admins can create products' });
    }

    let image = '';
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "image",
      });
      if (cloudResponse && cloudResponse.secure_url) {
        image = cloudResponse.secure_url;
      } else {
        return res.status(500).json({
          message: "Failed to upload product image to Cloudinary.",
          success: false,
        });
      }
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity: quantity || 0,
      discount: discount || 0,
      image,
      user: user._id,
      seller: user.fullname,
      inStock: quantity > 0
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, discount } = req.body;
    const file = req.files?.image?.[0];

    let updateData = { 
      name, 
      description, 
      price, 
      category,
      quantity,
      discount,
      inStock: quantity > 0,
      updatedAt: Date.now() 
    };

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "image",
      });
      if (cloudResponse && cloudResponse.secure_url) {
        updateData.image = cloudResponse.secure_url;
      } else {
        return res.status(500).json({
          message: "Failed to upload product image to Cloudinary.",
          success: false,
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Duplicate a product
export const duplicateProduct = async (req, res) => {
  try {
    const productToDuplicate = await Product.findById(req.params.id);
    if (!productToDuplicate) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if the user has permission to duplicate the product
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only sellers and admins can duplicate products' });
    }

    // Create a new product object with the duplicated data
    const duplicatedProduct = new Product({
      name: `${productToDuplicate.name} (Copy)`,
      description: productToDuplicate.description,
      price: productToDuplicate.price,
      category: productToDuplicate.category,
      quantity: productToDuplicate.quantity,
      discount: productToDuplicate.discount,
      image: productToDuplicate.image,
      user: user._id,
      seller: user.fullname,
      inStock: productToDuplicate.quantity > 0
    });

    const savedProduct = await duplicatedProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    console.error('Error in duplicateProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Checkout products
export const checkoutProduct = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty product list' });
    }

    const updatedProducts = [];
    let totalAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ success: false, message: `Product with id ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      product.quantity -= item.quantity;
      product.inStock = product.quantity > 0;
      product.checkedOut = true;

      await product.save();

      updatedProducts.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;
    }

    res.status(200).json({
      success: true,
      data: {
        products: updatedProducts,
        totalAmount: totalAmount.toFixed(2)
      },
      message: 'Checkout successful'
    });
  } catch (error) {
    console.error('Error in checkoutProducts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};