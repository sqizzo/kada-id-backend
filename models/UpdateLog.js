import mongoose from "mongoose";

const updateLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["general", "admin", "curriculum", "highlight", "social"],
      default: "general",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UpdateLog", updateLogSchema);
