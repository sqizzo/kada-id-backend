import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected succesfully");
  } catch (error) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
