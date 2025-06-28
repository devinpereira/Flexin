import mongoose from 'mongoose';
const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  package: { type: String, enum: ['silver', 'gold', 'ultimate'] },
  startDate: { type: Date, default: Date.now },
  endDate: Date
});

export default mongoose.model('Subscription', SubscriptionSchema);