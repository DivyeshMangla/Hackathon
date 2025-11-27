import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    // Basic user properties
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    // More specific info
    rollNumber: string
    year: number

    role: "participant" | "judge" | "admin";
    teamId?: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        updatedAt: {
            type: Date,
            default: Date.now
        },

        rollNumber: {
            type: String,
            required: true,
            unique: true
        },

        year: {
            type: Number,
            required: true
        },

        role: {
            type: String,
            enum: ["participant", "judge", "admin"],
            default: "participant",
        },

        teamId: {
            type: String,
            default: null
        }
    }
)

export default mongoose.model<IUser>("User", UserSchema);