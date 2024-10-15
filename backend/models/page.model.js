import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        default: "linear-gradient(0deg, #000000, #000000)",
        trim: true,
        validate: {
            validator: function(v) {
                return /^linear-gradient\(\d{1,3}deg,\s*#[0-9A-Fa-f]{6},\s*#[0-9A-Fa-f]{6}\)$/.test(v);
            },
            message: props => `${props.value} is not a valid gradient format!`
        }
    },
    fontSize: {
        type: Number,
        default: 16,
        min: 8,
        max: 72
    },
    content: {
        type: String,
        // required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    featuredImage: {
        type: String,
        trim: true
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Page = mongoose.model("Page", pageSchema);


