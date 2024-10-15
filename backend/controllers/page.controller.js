import { Page } from "../models/page.model.js";

// Create a new page
export const createPage = async (req, res) => {
    try {
        const { title, content, slug, color, fontSize, isPublished, metaDescription, featuredImage } = req.body;
        const author = req.id;

        const newPage = new Page({
            title,
            content,
            slug,
            color,
            fontSize,
            isPublished,
            metaDescription,
            featuredImage,
            author
        });

        await newPage.save();

        res.status(201).json({
            success: true,
            message: "Page created successfully",
            page: newPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating page",
            error: error.message
        });
    }
};

// Get all pages
export const getAllPages = async (req, res) => {
    try {
        const pages = await Page.find().populate('author', 'fullname email');
        res.status(200).json({
            success: true,
            pages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching pages",
            error: error.message
        });
    }
};

// Get a single page by slug
export const getPageBySlug = async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug }).populate('author', 'fullname email');
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }
        res.status(200).json({
            success: true,
            page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching page",
            error: error.message
        });
    }
};

// Update a page
export const updatePage = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await Page.findOne({ slug });
        
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        // Check if the user is the author of the page
        if (page.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this page"
            });
        }

        const { newSlug, ...updateData } = req.body;
        
        if (newSlug && newSlug !== slug) {
            // Check if the new slug already exists
            const existingPage = await Page.findOne({ slug: newSlug });
            if (existingPage) {
                return res.status(400).json({
                    success: false,
                    message: "A page with this slug already exists"
                });
            }
            updateData.slug = newSlug;
        }

        const updatedPage = await Page.findOneAndUpdate(
            { slug },
            { $set: updateData, $currentDate: { lastModified: true } },
            { new: true, runValidators: true }
        ).populate('author', 'fullname email');

        if (!updatedPage) {
            return res.status(500).json({
                success: false,
                message: "Failed to update the page"
            });
        }

        res.status(200).json({
            success: true,
            message: "Page updated successfully",
            page: updatedPage
        });
    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).json({
            success: false,
            message: "Error updating page",
            error: error.message
        });
    }
};

// Delete a page
export const deletePage = async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        // Check if the user is the author of the page
        if (page.author.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this page"
            });
        }

        const deletedPage = await Page.findOneAndDelete({ slug: req.params.slug });
        
        res.status(200).json({
            success: true,
            message: "Page deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting page",
            error: error.message
        });
    }
};
