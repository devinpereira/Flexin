import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
  image: String,
});

const daySchema = new mongoose.Schema({
  day: String, // e.g., "Day 1"
  exercises: [exerciseSchema],
});

const trainerScheduleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    days: [daySchema], // Array of days, each with exercises
  },
  { timestamps: true,
    collection: "trainerSchedules" 
  } // Custom collection name
   
);

export default mongoose.model("TrainerSchedule", trainerScheduleSchema);