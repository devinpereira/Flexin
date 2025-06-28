import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  type: { type: String, required: true },
  time: { type: String, required: true },
  meal: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: String, required: true },
  carbs: { type: String, required: true },
  fats: { type: String, required: true },
  recipe: { type: String, required: true }
});

const MealPlanSchema = new mongoose.Schema({
  trainerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trainer', 
    required: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  week: { type: String, required: true }, // e.g., "2024-W23" or "default"
  days: {
    type: Map,
    of: [MealSchema],
    required: true
  }
}, { timestamps: true });

export default mongoose.model('MealPlan', MealPlanSchema);