import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  modalImage: { type: String, required: true },
  bodyPart: { type: String, required: true },
  description: { type: String, required: true },
  equipment: { type: String, required: true }, // "No equipment", "Limited equipment", "Full gym access"
  type: { type: String, required: true }, 
  difficulty: { type: String, required: true }, // "Beginner", "Intermediate", "Advanced"
  primaryMuscles: { type: [String], required: true },
  secondaryMuscles: { type: [String], default: [] },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
});

export default mongoose.model("Exercise", exerciseSchema);