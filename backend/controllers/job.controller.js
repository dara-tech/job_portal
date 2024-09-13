import { Job } from "../models/job.model.js";

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
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const jobType = req.query.jobType || "";
    const company = req.query.company || "";
    const location = req.query.location || ""; // Add more filters if needed
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    console.log("Search Parameters:", { keyword, jobType, company, location, page, pageSize });

    // Sanitize and validate inputs if necessary
    const sanitizedKeyword = keyword.trim().toLowerCase();
    const sanitizedJobType = jobType.trim().toLowerCase();
    const sanitizedCompany = company.trim().toLowerCase();
    const sanitizedLocation = location.trim().toLowerCase();

    // Build the search query
    const searchQuery = {
      $and: [
        {
          $or: [
            { title: { $regex: sanitizedKeyword, $options: "i" } },
            { description: { $regex: sanitizedKeyword, $options: "i" } },
            ...(sanitizedCompany ? [{ "company.name": { $regex: sanitizedCompany, $options: "i" } }] : []),
            ...(sanitizedJobType ? [{ jobType: { $regex: sanitizedJobType, $options: "i" } }] : []),
          ]
        },
        ...(sanitizedLocation ? [{ location: { $regex: sanitizedLocation, $options: "i" } }] : []),
      ]
    };

    // Fetch jobs from the database with the constructed query
    const jobs = await Job.find(searchQuery)
      .populate("company")
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // Count the total number of matching documents for pagination
    const totalJobs = await Job.countDocuments(searchQuery);

    if (!jobs.length) {
      return res.status(404).json({
        message: "No jobs found matching the search criteria.",
        success: false,
        totalJobs: 0,
        totalPages: 0
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
      totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize)
    });
  } catch (error) {
    console.log("Error fetching jobs:", error);
    return res.status(500).json({
      message: "Server error.",
      success: false
    });
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

