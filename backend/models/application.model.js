import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'Job No Longer Available', 'Company No Longer Available'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

export const Application = mongoose.model("Application", applicationSchema);