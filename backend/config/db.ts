import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
    try {
        // In-Memory Database - Dev
        const mongoServer = await MongoMemoryServer.create();
        const devUri = mongoServer.getUri();

        await mongoose.connect(devUri);
        console.log("Connected to In-Memory MongoDB (DEV MODE)");

        // Actual MongoDB - Prod
        // await mongoose.connect(process.env.MONGO_URI as string);
        // console.log("Connected to MongoDB Atlas (PRODUCTION MODE)");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
