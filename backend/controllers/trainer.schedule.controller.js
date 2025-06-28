import TrainerSchedule from "../models/Trainer.schedule.model.js";

// Create or update a schedule for a user and trainer
export const upsertTrainerSchedule = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const userId = req.user._id;
    const { days } = req.body;

    const schedule = await TrainerSchedule.findOneAndUpdate(
      { userId, trainerId },
      { days },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, schedule ,message: "Schedule created or updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a user's schedule for a trainer
export const getTrainerSchedule = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const userId = req.user._id;
    const schedule = await TrainerSchedule.findOne({ userId, trainerId });
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    res.status(200).json({ success: true, schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a user's schedule for a trainer
export const deleteTrainerSchedule = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const userId = req.user._id;
    const result = await TrainerSchedule.findOneAndDelete({ userId, trainerId });
    if (!result) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    res.status(200).json({ success: true, message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};