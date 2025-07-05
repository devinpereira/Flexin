import mongoose from "mongoose";

const exerciseItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    reps: { type: String, required: true },
    image: { type: String, required: true },
    modalImage: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const workoutScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schedule: {
    Monday: [exerciseItemSchema],
    Tuesday: [exerciseItemSchema],
    Wednesday: [exerciseItemSchema],
    Thursday: [exerciseItemSchema],
    Friday: [exerciseItemSchema],
    Saturday: [exerciseItemSchema],
    Sunday: [exerciseItemSchema],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add pre-save hook to update `updatedAt`
workoutScheduleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("WorkoutSchedule", workoutScheduleSchema);