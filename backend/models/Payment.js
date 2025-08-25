import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true, unique: true }, // One payment record per trainer
  nextPaymentId: { type: String, required: true }, // Next payment ID that will be used - TRPM0001, TRPM0002, etc.
  payments: [{
    paymentId: { type: String, required: true }, // Individual payment ID for this specific payment (unique across all collections)
    amount: { type: Number, required: true },
    datePaid: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' }
  }],
  totalAmountPaid: { type: Number, default: 0 }, // Total amount paid so far
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  lastPaidAt: { type: Date },
});

export default mongoose.model('Payment', paymentSchema);
