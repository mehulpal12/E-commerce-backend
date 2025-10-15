import mongoose from "mongoose";

let isConnected = false; // track the connection

export async function connectDB() {
  if (isConnected) {
    return; // reuse existing connection
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
