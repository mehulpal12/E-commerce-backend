import mongoose from "mongoose";

let isConnected = false; // track the connection

export async function connectDB() {
  if (isConnected) {
    return; // reuse existing connection
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    // console.log("MongoDB connected", process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
