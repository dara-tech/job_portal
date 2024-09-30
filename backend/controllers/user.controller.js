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
        message: 'Something is missing',
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
        success: false,
      });
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
        profilePhoto:cloudResponse.secure_url,
        experience
      }
    });
    await newUser.save();

    return res.status(201).json({
      message: 'Account Created Successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
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
    // Clear the token cookie, even if the token is expired
    res.clearCookie("token", {
      httpOnly: true, // Ensures it's inaccessible to client-side scripts
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
      sameSite: "strict", // Protect against CSRF attacks
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
    const resume = req.files["resume"] ? req.files["resume"][0] : null;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Handle profile photo upload if provided
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

    // Handle resume upload if provided
    if (resume) {
      const resumeUri = getDataUri(resume);
      const resumeUploadResponse = await cloudinary.uploader.upload(resumeUri.content, {
        resource_type: "raw",  // For non-image files such as PDF, DOCX
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

    // Update other user fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    
    // Parse skills correctly
    if (skills) {
      // Check if it's a stringified JSON array
      if (typeof skills === 'string' && skills.startsWith('[')) {
        try {
          user.profile.skills = JSON.parse(skills);
        } catch (error) {
          return res.status(400).json({
            message: "Invalid skills format.",
            success: false,
          });
        }
      } else {
        // Handle plain comma-separated string
        user.profile.skills = skills.split(",").map(skill => skill.trim()).filter(skill => skill);
      }
    }

    if (location) user.profile.location = location;
    if (experience) user.profile.experience = experience;

    // Handle social links
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

    // Save updated user profile
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
    const users = await User.find(); // Fetch all users from the database
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found.",
        success: false,
      });
    }

    // Return the list of users
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

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        success: false,
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
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