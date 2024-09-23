import mongoose from 'mongoose';
import { Job } from '../models/job.model.js';
import { Application } from "../models/application.model.js";
import { User } from '../models/user.model.js';

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      expire,
      companyId,
    } = req.body;
    const userId = req.id;

    // Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    // Ensure requirements is a string
    const formattedRequirements = typeof requirements === 'string'
      ? requirements.split(",").map(req => req.trim()) // Convert to array and trim whitespace
      : []; // Default to empty array if not a string

    // Convert expire to Date object if provided
    const expireDate = expire ? new Date(expire) : null;

    // Create the job
    const job = await Job.create({
      title,
      description,
      requirements: formattedRequirements,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      postedDate: new Date(),
      expire: expireDate, // Use parsed date or null
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log("Error creating job:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
// Controller for fetching all jobs with an optional keyword search
// In job.controller.js
export const getAllJobs = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Build the query object based on the keyword
    const query = {};

    // Handle search keyword if provided
    if (keyword && keyword !== 'Select Location Select Industry Select Salary') {
      // Adjust the query to match your schema and requirements
      query.title = { $regex: keyword, $options: 'i' }; // Example for matching job titles
    }

    // Fetch jobs from the database and sort by the most recent posting date
    const jobs = await Job.find(query)
      .populate('applications')
      .populate('company')
      .sort({ postedDate: -1 }); // Sort by `postedDate` in descending order

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.', success: false });
  }
};




  // export const getJobById = async (req, res) => {


  //     try {
//         const jobId = req.params.id;
//         const job = await Job.findById(jobId).populate({
//             path:"applications"
//         });
//         if (!job) {
//             return res.status(404).json({
//                 message: "Jobs not found.",
//                 success: false
//             })
//         };
//         return res.status(200).json({ job, success: true });
//     } catch (error) {
//         console.log(error);
//     }
// }
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    // Populate both applications and company fields
    const job = await Job.findById(jobId)
      .populate("applications") // Populate the applications field
      .populate("company"); // Populate the company field

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      expire,
      companyId,
    } = req.body;
    const userId = req.id;

    // Find the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Check if the user is authorized to update the job
    if (job.created_by.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this job.",
        success: false,
      });
    }

    // Handle `requirements` to be a string array
    const formattedRequirements = Array.isArray(requirements)
      ? requirements.join(",") // Convert array to a comma-separated string
      : typeof requirements === 'string'
      ? requirements
      : '';

    // Update the job fields if provided
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title: title || job.title,
        description: description || job.description,
        requirements: formattedRequirements, // Updated requirement handling
        salary: salary !== undefined ? Number(salary) : job.salary,
        location: location || job.location,
        jobType: jobType || job.jobType,
        experienceLevel: experience || job.experienceLevel,
        position: position || job.position,
        expire: expire ? new Date(expire) : job.expire, // Ensure valid date
        company: companyId || job.company,
      },
      { new: true } // Return the updated job
    );

    if (!updatedJob) {
      return res.status(500).json({
        message: "Failed to update job.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      message: "Server error: " + error.message, // Include error message for better debugging
      success: false,
    });
  }
};
export const deleteJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const jobId = req.params.id;
    console.log("Deleting job with ID:", jobId);

    if (!jobId) {
      return res.status(400).json({
        message: 'Job ID is required.',
        success: false,
      });
    }

    // Delete all applications associated with this job
    const deleteApplicationsResult = await Application.deleteMany({ job: jobId }).session(session);
    console.log(`Deleted ${deleteApplicationsResult.deletedCount} applications`);

    // Delete the job
    const deleteJobResult = await Job.deleteOne({ _id: jobId }).session(session);

    if (deleteJobResult.deletedCount === 0) {
      await session.abortTransaction();
      return res.status(404).json({
        message: 'Job not found.',
        success: false,
      });
    }

    await session.commitTransaction();
    return res.status(200).json({
      message: 'Job and associated applications successfully deleted.',
      success: true,
      deletedApplications: deleteApplicationsResult.deletedCount,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting job and applications:', error.message);
    return res.status(500).json({
      message: 'An internal server error occurred.',
      success: false,
    });
  } finally {
    session.endSession();
  }
};

export const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id; // Job ID from the route parameters
    const userId = req.id; // User ID from request (from authentication middleware)

    // Validate jobId
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required.", success: false });
    }

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Check if the job is already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job is already saved.", success: false });
    }

    // Add job to user's saved jobs
    user.savedJobs.push(jobId);
    await user.save();

    return res.status(200).json({ message: "Job saved successfully.", success: true });
  } catch (error) {
    console.error("Error saving job:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id; // User ID from authentication middleware

    // Find the user by ID and populate saved jobs
    const user = await User.findById(userId).populate('savedJobs');

    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Respond with saved jobs
    return res.status(200).json({
      savedJobs: user.savedJobs,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};
export const unsaveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required.", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Check if the job is in the saved list
    const jobIndex = user.savedJobs.indexOf(jobId);
    if (jobIndex === -1) {
      return res.status(400).json({ message: "Job is not in the saved list.", success: false });
    }

    // Remove the job from savedJobs array
    user.savedJobs.splice(jobIndex, 1);

    // Save the user document without version key check
    await User.findByIdAndUpdate(userId, { savedJobs: user.savedJobs }, { new: true });

    return res.status(200).json({ message: "Job removed from saved list successfully.", success: true });
  } catch (error) {
    console.error("Error unsaving job:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};
export const isJobSaved = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id; // Assuming you have middleware that sets the user ID in the request

    // Validate jobId
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required.", success: false });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Check if the job is in the user's saved jobs
    const isSaved = user.savedJobs.includes(jobId);

    return res.status(200).json({ isSaved, success: true });
  } catch (error) {
    console.error("Error checking if job is saved:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

