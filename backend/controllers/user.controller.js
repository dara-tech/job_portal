import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, location, experience } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role || !location || experience) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
        success: false,
      });
    }

    let profilePhotoUrl = '';
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      location,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
        experience
      }
    });
    await newUser.save();

    return res.status(201).json({
      message: 'Account Created Successfully',
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user || role !== user.role) {
      return res.status(400).json({
        message: "Incorrect Email, Password, or Role",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// User logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error during logout.",
      success: false,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, location, phoneNumber, bio, skills, experience, socialLinks } = req.body;
    const profilePhoto = req.files["profilePhoto"] ? req.files["profilePhoto"][0] : null;
    const profileCoverPhoto = req.files["profileCoverPhoto"] ? req.files["profileCoverPhoto"][0] : null;
    const resume = req.files["resume"] ? req.files["resume"][0] : null;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (profilePhoto) {
      const fileUri = getDataUri(profilePhoto);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "image",
      });
      if (cloudResponse && cloudResponse.secure_url) {
        user.profile.profilePhoto = cloudResponse.secure_url;
      } else {
        return res.status(500).json({
          message: "Failed to upload profile photo to Cloudinary.",
          success: false,
        });
      }
    }

    if (profileCoverPhoto) {
      const coverUri = getDataUri(profileCoverPhoto);
      const coverUploadResponse = await cloudinary.uploader.upload(coverUri.content, {
        resource_type: "image",
      });
      if (coverUploadResponse && coverUploadResponse.secure_url) {
        user.profile.profileCoverPhoto = coverUploadResponse.secure_url;
      } else {
        return res.status(500).json({
          message: "Failed to upload profile cover photo to Cloudinary.",
          success: false,
        });
      }
    }

    if (resume) {
      const resumeUri = getDataUri(resume);
      const resumeUploadResponse = await cloudinary.uploader.upload(resumeUri.content, {
        resource_type: "raw",
      });
      if (resumeUploadResponse && resumeUploadResponse.secure_url) {
        user.profile.resume = resumeUploadResponse.secure_url;
        user.profile.resumeOriginalName = resume.originalname;
      } else {
        return res.status(500).json({
          message: "Failed to upload resume to Cloudinary.",
          success: false,
        });
      }
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      if (typeof skills === 'string' && skills.startsWith('[')) {
        try {
          const parsedSkills = JSON.parse(skills);
          user.profile.skills = parsedSkills.map(skill => ({
            name: skill.name,
            rating: skill.rating || 1
          }));
        } catch (error) {
          return res.status(400).json({
            message: "Invalid skills format.",
            success: false,
          });
        }
      } else {
        user.profile.skills = skills.split(",").map(skill => ({
          name: skill.trim(),
          rating: 1
        })).filter(skill => skill.name);
      }
    }

    if (location) user.profile.location = location;
    if (experience) user.profile.experience = experience;

    if (socialLinks) {
      try {
        const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        user.profile.socialLinks = new Map(Object.entries(parsedSocialLinks));
      } catch (error) {
        return res.status(400).json({
          message: "Invalid social links format.",
          success: false,
        });
      }
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: {
        ...user.profile.toObject(),
        socialLinks: Object.fromEntries(user.profile.socialLinks),
      },
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    res.status(200).json({
      message: "User retrieved successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Edit user by ID
export const editUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, email, phoneNumber, role, profile } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { fullname, email, phoneNumber, role, profile },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "User updated successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    res.status(200).json({
      message: "User deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Create a new resume
export const createResume = async (req, res) => {
  try {
    const userId = req.id;  // User ID from isAuthenticated middleware

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const { title, summary, education, experience, skills, projects, certifications, languages, personalInfo } = req.body;

    // Validate input: at least a title should be provided
    if (!title) {
      return res.status(400).json({
        message: "Resume title is required.",
        success: false,
      });
    }

    // Create a new resume object based on the schema structure
    const newResume = {
      title,
      personalInfo: {
        name: personalInfo?.name || user.fullname,  // Use provided personal info or fallback to user's fullname
        email: personalInfo?.email || user.email,
        phone: personalInfo?.phone || user.phoneNumber,
        address: personalInfo?.address || '',
      },
      summary: summary || '',
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      projects: projects || [],
      certifications: certifications || [],
      languages: languages || [],
      lastModified: new Date(),
    };

    // Add the new resume to the user's resumes array
    user.resumes.push(newResume);

    // Save the updated user document
    await user.save();

    // Respond with success and return the newly created resume
    res.status(201).json({
      message: "Resume created successfully.",
      success: true,
      resume: newResume,
    });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
// Get all resumes for a user
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select('resumes');
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Resumes retrieved successfully.",
      success: true,
      resumes: user.resumes
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { title, personalInfo, summary, education, experience, skills, projects, certifications, languages } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const resume = user.resumes.id(resumeId);
    if (!resume) {
      return res.status(404).json({
        message: "Resume not found.",
        success: false,
      });
    }

    resume.title = title;
    resume.personalInfo = personalInfo;
    resume.summary = summary;
    resume.education = education;
    resume.experience = experience;
    resume.skills = skills;
    resume.projects = projects;
    resume.certifications = certifications;
    resume.languages = languages;
    resume.lastModified = new Date();

    await user.save();

    res.status(200).json({
      message: "Resume updated successfully.",
      success: true,
      resume
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.id;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { resumes: { _id: resumeId } } },
      { new: true }
    );

    if (!user) {

      return res.status(404).json({
        message: "User or resume not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Resume deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};



// Get a single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const resume = user.resumes.find(resume => resume._id.toString() === resumeId);
    if (!resume) {
      return res.status(404).json({
        message: "Resume not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Resume fetched successfully.",
      success: true,
      resume
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

