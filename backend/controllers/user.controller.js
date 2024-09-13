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
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, location, phoneNumber, bio, skills, experience } = req.body;
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
    if (skills) user.profile.skills = skills.split(",").map((skill) => skill.trim());
    if (location) user.profile.location = location;
    if (experience) user.profile.experience = experience;

    // Save updated user profile
    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
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

