import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ["moderator", "admin"], default: "moderator" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
