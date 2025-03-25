import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    specialization: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Trainer", trainerSchema);