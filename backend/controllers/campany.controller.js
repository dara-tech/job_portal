import { Company } from "./../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import { User } from '../models/user.model.js';

export const registerCompany = async (req, res) => {
  try {  
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company.",
        success: false,
      }); 
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; // logged in user id
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAllCompany = async (req, res) => {
  try {
    // Fetch all companies and populate the userId field with the user's name
    const companies = await Company.find().populate('userId', 'fullname');

    if (companies.length === 0) {
      return res.status(404).json({
        message: "No companies found.",
        success: false,
      });
    }

    return res.status(200).json({
      companies, // Now includes the user name
      success: true,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({
      message: "An error occurred while fetching companies.",
      success: false,
    });
  }
};



export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    // Validate required fields
    if (!name || !description || !website || !location) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let logo = null;

    // Handle file upload to Cloudinary if a file is provided
    if (file) {
      const fileUri = getDataUri(file);
      try {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        logo = cloudResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          message: "Failed to upload image to Cloudinary",
          success: false,
        });
      }
    }

    // Prepare update data
    const updateData = { name, description, website, location };
    if (logo) {
      updateData.logo = logo;
    }

    // Update the company in the database
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated",
      success: true,
      company,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const getApplicantCount = async (req, res) => {
  try {
    const { companyId } = req.params;
    const count = await Application.countDocuments({ company: companyId });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting applicant count', error: error.message });
  }
};

// New function to get job count
export const getJobCount = async (req, res) => {
  try {
    const { companyId } = req.params;
    const count = await Job.countDocuments({ company: companyId });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting job count', error: error.message });
  }
};

// New function to get all companies with counts
export const getAllCompaniesWithCounts = async (req, res) => {
  try {
    const companies = await Company.find();
    const companiesWithCounts = await Promise.all(
      companies.map(async (company) => {
        const applicantsCount = await Application.countDocuments({ company: company._id });
        const jobsCount = await Job.countDocuments({ company: company._id });
        return {
          ...company.toObject(),
          applicantsCount,
          jobsCount
        };
      })
    );
    res.status(200).json({ success: true, companies: companiesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting all companies with counts', error: error.message });
  }
};
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;

    // Validate Company ID
    if (!companyId) {
      return res.status(400).json({
        message: "Company ID is required.",
        success: false,
      });
    }

    // Check user role
    const user = await User.findById(userId);
    if (!user || user.role !== 'recruiter') {
      return res.status(403).json({
        message: "Access denied. Only recruiters can delete companies.",
        success: false,
      });
    }

    // Find the company and check ownership
    const company = await Company.findOne({ _id: companyId, userId });
    if (!company) {
      return res.status(404).json({
        message: "Company not found or you don't have permission to delete it.",
        success: false,
      });
    }

    // Delete the company
    await Company.deleteOne({ _id: companyId });

    // Delete associated jobs
    const jobs = await Job.find({ company: companyId });
    const jobIds = jobs.map(job => job._id); // Collect job IDs

    await Job.deleteMany({ company: companyId });

    // Delete associated applications
    await Application.deleteMany({ job: { $in: jobIds } });

    return res.status(200).json({
      message: "Company and associated jobs successfully deleted.",
      success: true,
    });
  } catch (error) {
    console.error('Error deleting company:', error.message);
    return res.status(500).json({
      message: 'Failed to delete the company. Please try again.',
      success: false,
    });
  }
};

