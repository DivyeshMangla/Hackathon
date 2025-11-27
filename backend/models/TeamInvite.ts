import mongoose, { Document, Schema } from "mongoose";

export interface ITeamInvite extends Document {
    fromUser: string;  // team leader id
    toUser: string;    // invited user id
    teamId: string;    // team making the invite
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
}

const TeamInviteSchema: Schema<ITeamInvite> = new Schema(
    {
        fromUser: {
            type: String,
            required: true
        },

        toUser: {
            type: String,
            required: true
        },

        teamId: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model<ITeamInvite>("TeamInvite", TeamInviteSchema);
