import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  generatedAt: { type: Date, default: Date.now },
  weekly_schedule: Array
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;