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

export const editWorkoutPlan = async (req, res) => {};