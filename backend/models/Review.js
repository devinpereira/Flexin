import mongoose from 'mongoose';
const ReviewSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  rating: Number,
  text: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);