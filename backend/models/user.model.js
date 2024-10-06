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
    type: String,
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
    skills: [{
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
      }
    }],
    socialLinks: {
      type: Map,
      of: String,
      default: {},
    },
    experience: [{ type: String }],
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profilePhoto: { type: String, default: '' },
    profileCoverPhoto: { type: String, default: '' },
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  resumes: [{
    title: {
      type: String,
      required: true,
    },
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    summary: {
      type: String,
      default: '',
    },
    education: {
      type: [{
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
      }],
      default: [],
    },
    experience: {
      type: [{
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        responsibilities: [String],
      }],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: {
      type: [{
        name: String,
        description: String,
        technologies: [String],
      }],
      default: [],
    },
    certifications: {
      type: [{
        name: String,
        issuer: String,
        date: Date,
      }],
      default: [],
    },
    languages: {
      type: [{
        language: String,
        proficiency: String,
      }],
      default: [],
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
