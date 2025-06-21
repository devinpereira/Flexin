import mongoose from "mongoose";

const fitnessProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    experience: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    daysperweek: {
      type: Number,
      required: true,
    },
    preferredDuration: {
        type: String,
        required: true,
    },
    activityLevel: {
      type: String,
      required: true,
    },
    equipmentAccess: {
      type: String,
      required: true,
    },
    healthConditions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FitnessProfile", fitnessProfileSchema);
