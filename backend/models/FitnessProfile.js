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
      enum: ["Beginner", "Intermediate", "Advanced"],
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
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    goal: {
      type: String,
      enum: ["Lose weight", "Build muscle", "Improve endurance", "General fitness"],
      required: true,
    },
    daysPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    preferredWorkoutDuration: {
      type: String,
      enum: ["15-30", "30-45 minutes", "45-60 minutes", "60+ minutes"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["Sedentary", "Lightly active", "Moderately active", "Active", "Very active"],
      required: true,
    },
    equipmentAccess: {
      type: String,
      enum: ["No equipment", "Limited equipment", "Full gym access"],
      required: true,
    },
    healthConditions: {
      type: [String],
      enum: ["Back pain", "Joint pain", "High blood pressure", "Heart condition", "Diabetes", "Asthma", "None"],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FitnessProfile", fitnessProfileSchema);