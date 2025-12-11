import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        excerpt: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            default: "Scanmed Team",
        },
        category: {
            type: String,
            required: true,
            enum: ["Eye Health", "Dental Health", "Wellness", "Preventive Care", "Healthcare", "Mental Health", "Nutrition"],
        },
        tags: [{
            type: String,
        }],
        readTime: {
            type: String,
            default: "5 min read",
        },
        featured: {
            type: Boolean,
            default: false,
        },
        published: {
            type: Boolean,
            default: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index for search
articleSchema.index({ title: "text", excerpt: "text", content: "text" });

export const Article = mongoose.model("Article", articleSchema);
