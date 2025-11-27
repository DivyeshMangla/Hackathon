import mongoose, { Document, Schema } from "mongoose";

export interface ITeam extends Document {
    // Team Info
    teamName: string;
    teamLeader: string;
    members: string[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema: Schema<ITeam> = new Schema<ITeam>(
    {
        teamName: {
            type: String,
            required: true,
            unique: true
        },

        teamLeader: {
            type: String,
            required: true
        },

        members: {
            type: [String],
            required: true,
            validate: {
                validator: function (arr: string[]) {
                    return arr.length <= 5;           // max 5 members  TODO: add user id validation too
                },
                message: "Team cannot have more than 5 members"
            }
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model<ITeam>("Team", TeamSchema);