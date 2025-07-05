import FitnessProfile from "../../models/FitnessProfile.js";
import Exercise from "../../models/Exercise.js";
import generateWorkoutPlan from "../../utils/workoutGenerator.js";

export const generateWorkout = async (req, res) => {
  try {
    const userId  = req.user.id;
    const profile = await FitnessProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const exercises = await Exercise.find({});
    const workoutPlan = generateWorkoutPlan(profile, exercises);

    res.json(workoutPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};