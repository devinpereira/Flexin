import mongoose from "mongoose";

async function generateWorkoutPlan(profile) {
  const Exercise = mongoose.model("Exercise");
  
  // Example: fetch all exercises, you can filter smarter (e.g. difficulty, equipment)
  const exercises = await Exercise.find({
    difficulty: profile.experience,
    equipment: { $in: [profile.equipmentAccess, "No equipment"] }, // flex this logic
  });

  // Shuffle + slice helper
  const shuffle = arr => arr.sort(() => 0.5 - Math.random());
  
  const selectedExercises = shuffle(exercises).slice(0, profile.daysPerWeek * 3); // example logic

  // Distribute over days
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const selectedDays = shuffle(days).slice(0, profile.daysPerWeek);

  const schedule = {};
  selectedDays.forEach((day, idx) => {
    schedule[day] = selectedExercises.slice(idx * 3, (idx + 1) * 3).map(ex => ({
      name: ex.name,
      reps: `${ex.reps}`,
      image: ex.image,
      modalImage: ex.modalImage,
      description: ex.description
    }));
  });

  // Fill empty days
  days.forEach(day => {
    if (!schedule[day]) schedule[day] = [];
  });

  return schedule;
}

export default generateWorkoutPlan;