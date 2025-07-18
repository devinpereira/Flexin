import mongoose from 'mongoose';

const pendingTrainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  email: String,
  phone: String,
  experience: String,
  bio: String,
  specialties: [String],
  certificates: [String], // store file paths or URLs
  identificationDocument: String, // file path or URL
  profilePhoto: String, // file path or URL
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedDate: { type: Date, default: Date.now }
});

export default mongoose.model('PendingTrainer', pendingTrainerSchema);