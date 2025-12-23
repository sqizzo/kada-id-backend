import mongoose from "mongoose";

const ProgramSettingSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    program: {
      name: { type: String, required: true },
      nameSuffix: { type: String, required: true },
      shortName: { type: String, required: true },
      batch: { type: Number, required: true },
      batchName: { type: String, required: true },
      organizer: { type: String, required: true },
    },

    schedule: {
      applicationDeadline: { type: Date, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      trainingDays: { type: String, required: true },
      trainingHours: { type: String, required: true },
      timezone: { type: String, default: "WIB" },
    },

    participants: {
      total: { type: Number, default: 60 },
      minAge: { type: Number },
      maxAge: { type: Number },
    },

    location: {
      venue: { type: String, required: true },
      city: { type: String, required: true },
      fullAddress: { type: String, required: true },
      googleMapsUrl: { type: String, required: true },
      country: { type: String, required: true },
    },

    programFeatures: {
      isFunded: { type: Boolean, default: false },
      providesAccommodation: { type: Boolean, default: false },
      providesFoodAllowance: { type: Boolean, default: false },
      providesCertificate: { type: Boolean, default: false },
      providesJobPlacement: { type: Boolean, default: false },
      costToParticipate: { type: String, default: "Free" },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProgramSetting", ProgramSettingSchema);
