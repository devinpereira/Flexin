import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  id: String, // UUID from frontend
  name: String,
  image: String,
  modalImage: String,
  bodyPart: String,
  category: String,
  description: String,
  equipment: String,
  difficulty: String,
  primaryMuscles: [String],
  secondaryMuscles: [String],
  sets: Number,
  reps: Number,
  type: String
});

const customWorkoutScheduleSchema = new mongoose.Schema({
  id: { type: String, required: true }, // UUID for frontend identification
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  exercises: {
    type: Map,
    of: [exerciseSchema]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CustomWorkoutSchedule', customWorkoutScheduleSchema);