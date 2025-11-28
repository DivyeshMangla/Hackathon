import mongoose, { Document, Schema } from "mongoose";

export interface ISubmission extends Document {
    // Project Info
    title: string;
    description: string;
    techStack: string[];

    // File Info
    videoUrl: string;
    figmaUrl?: string;
    githubRepoUrl?: string;
    deploymentUrl?: string;

    // Submission Info
    submittedByTeam: string; // Team ID, the actual submission can only be done by the team leader.
    submittedAt: Date;
    status: "pending" | "approved" | "rejected";
}

const submissionSchema: Schema = new Schema<ISubmission>({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    techStack: {
        type: [String],
        required: true
    },

    figmaUrl: {
        type: String,
        required: false
    },

    videoUrl: {
        type: String,
        required: true
    },

    githubRepoUrl: {
        type: String,
        required: false
    },

    deploymentUrl: {
        type: String,
        required: false
    },

    submittedByTeam: {
        type: String,
        required: true
    },

    submittedAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
})

export default mongoose.model<ISubmission>("Submission", submissionSchema);