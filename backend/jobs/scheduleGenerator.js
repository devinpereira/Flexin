import FitnessProfile from "../models/FitnessProfile.js";
import WorkoutSchedule from "../models/WorkoutSchedule.js";
import generateWorkoutPlan from "../utils/workoutGenerator.js";

const generateSchedulesForAllUsers = async () => {
  try {
    const profiles = await FitnessProfile.find();

  for (const profile of profiles) {
    const schedule = await generateWorkoutPlan(profile);
    await WorkoutSchedule.create({
      userId: profile.userId,
      schedule,
    });
  }

    console.log("Weekly workout plans generated!");
  } catch (err) {
    console.error('Error generating schedules:', err);
  }
};

export default generateSchedulesForAllUsers;