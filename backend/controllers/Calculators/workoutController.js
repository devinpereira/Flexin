import FitnessProfile from "../../models/FitnessProfile.js";
import Exercise from "../../models/Exercise.js";
import generateWorkoutPlan from "../../utils/workoutGenerator.js";

export const getWorkoutPlans = async (req, res) => {
  const userId = req.user.id;
  try {
    const currentPlan = await WorkoutSchedule.findOne({ userId: userId }).sort({
      createdAt: -1,
    });
    if (!currentPlan) {
      return res.status(404).json({ message: "No workout plan found" });
    }
    res.json(currentPlan);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editWorkoutPlan = async (req, res) => {};

export const generateWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await FitnessProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const workoutPlan = generateWorkoutPlan(profile);

    res.json(workoutPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
