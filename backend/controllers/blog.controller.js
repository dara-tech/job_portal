import Blog from '../models/blog.model.js';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Create a new blog post   
export const createBlog = async (req, res) => {
    try {
      const { title, content, tags } = req.body;
      const file = req.files?.picture?.[0]; // get the file from the 'picture' field
  
      if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Title and content are required' });
      }
  
      let picture = '';
      if (file) {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
          resource_type: "image",
        });
        if (cloudResponse && cloudResponse.secure_url) {
          picture = cloudResponse.secure_url;
        } else {
          return res.status(500).json({
            message: "Failed to upload blog picture to Cloudinary.",
            success: false,
          });
        }
      }
  
      // Create a new blog with the author's ID from req.user._id
      const newBlog = new Blog({
        title,
        content,
        author: req.user._id,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        picture, // Store the uploaded image URL in the database
      });
  
      const savedBlog = await newBlog.save();
      res.status(201).json({ success: true, data: savedBlog });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Get all blog posts
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'fullname profile.profilePhoto').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single blog post by ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'fullname profile.profilePhoto');
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        
        // Increment the view count
        blog.views += 1;
        await blog.save();
        
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a blog post
export const updateBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const files = req.files;

        let updateData = { 
            title, 
            content, 
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            updatedAt: Date.now() 
        };

        if (files && files.picture) {
            const file = files.picture[0];
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            if (cloudResponse && cloudResponse.secure_url) {
                updateData.picture = cloudResponse.secure_url;
            } else {
                return res.status(500).json({
                    message: "Failed to upload blog picture to Cloudinary.",
                    success: false,
                });
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: updatedBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Like a blog post
export const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        
        if (blog.likes.includes(req.user._id)) {
            // Unlike the blog if already liked
            blog.likes = blog.likes.filter(userId => userId.toString() !== req.user._id.toString());
        } else {
            // Like the blog
            blog.likes.push(req.user._id);
        }
        
        await blog.save();
        
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a comment to a blog post
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        
        const newComment = {
            user: req.user._id,
            text
        };
        
        blog.comments.push(newComment);
        await blog.save();
        
        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all comments for a blog post
export const getComments = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('comments.user', 'fullname profile.profilePhoto');
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: blog.comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// DELETE A COMMENT
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Check if the user is the author of the comment or the blog
        if (blog.comments[commentIndex].user.toString() !== req.user._id.toString() && 
            blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this comment' });
        }

        blog.comments.splice(commentIndex, 1);
        await blog.save();

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Increment the view count for a blog post
export const incrementViewCount = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};