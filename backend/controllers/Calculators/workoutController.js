import WorkoutSchedule from "../../models/WorkoutSchedule.js";

// Get the workout plan for the week
export const getWorkoutPlans = async (req, res) => {
  const userId = req.user.id;
  try {
    const currentPlan = await WorkoutSchedule.findOne({ userId: userId }).sort({
      createdAt: -1,
    });
    if (!currentPlan) {
      return res.status(404).json({ message: "No workout plan found" });
    }
    res.status(200).json(currentPlan);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWorkoutPlans = async (req, res) => {
  const userId = req.user.id;
  const { schedule } = req.body;

  try {
    if (!schedule || typeof schedule !== 'object') {
      return res.status(400).json({ message: "Invalid schedule format" });
    }

    // Get the latest workout plan
    const latestPlan = await WorkoutSchedule.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestPlan) {
      return res.status(404).json({ message: "No existing workout plan found to update" });
    }

    // Update the schedule
    latestPlan.schedule = schedule;
    await latestPlan.save();

    return res.status(200).json({ message: "Workout plan updated successfully", schedule: latestPlan.schedule });
  } catch (err) {
    console.error("Error updating workout plan:", err);
    return res.status(500).json({ message: "Server error. Failed to update workout plan." });
  }
};