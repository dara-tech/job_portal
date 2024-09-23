import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    index: true,
  },
  phoneNumber: {
    type: String, // Changed from Number to String
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'recruiter', 'employee', 'admin'],
    required: true,
  },
  profile: {
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [{ type: String }], // Added experience field
    resume: { type: String },
    resumeOriginalName: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profilePhoto: { type: String, default: '' },
  },
  savedJobs: [{ // Add savedJobs field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job model
  }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
