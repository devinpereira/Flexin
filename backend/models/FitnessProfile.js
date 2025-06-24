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
      required: true, // beginner, intermediate, advanced
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
      type: String, // male, female
      required: true,
    },
    goal: {
      type: String, // Loose weight, Build muscle, Improve endurance, General fitness
      required: true,
    },
    daysperweek: {
      type: Number,
      required: true,
    },
    preferredDuration: {
        type: String, // 15-30 minutes, 30-45 minutes, 45-60 minutes, 60+ minutes
        required: true,
    },
    activityLevel: {
      type: String, // Sedentary, Lightly active, Moderately active, active, Very active
      required: true,
    },
    equipmentAccess: {
      type: String, // No equipment, Limited equipment, Full gym access
      required: true,
    },
    healthConditions: {
      type: [String],
      default: [], // backpain, Joint pain, High blood pressure, Heart condition, Diabetes, Asthma, None
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FitnessProfile", fitnessProfileSchema);
