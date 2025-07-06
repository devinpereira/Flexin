import mongoose from "mongoose";

async function generateWorkoutPlan(profile) {
  const Exercise = mongoose.model("Exercise");

  // Fetch exercises by difficulty & equipment
  const exercises = await Exercise.find({
    difficulty: profile.experience,
    equipment: { $in: [profile.equipmentAccess, "No equipment"] }
  });

  const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

  // Generate reps string like "3 x 12"
  const getFormattedReps = () => {
    const sets = 3;
    let reps;
    switch (profile.experience) {
      case "Beginner":
        reps = Math.floor(Math.random() * 3 + 8); // 8–10
        break;
      case "Intermediate":
        reps = Math.floor(Math.random() * 4 + 10); // 10–13
        break;
      case "Advanced":
        reps = Math.floor(Math.random() * 5 + 12); // 12–16
        break;
      default:
        reps = 10;
    }
    return `${sets} x ${reps}`;
  };

  // Avoid repeating exercises within a single day
  const pickExercisesForDay = (allExercises, count) => {
    const pickedNames = new Set();
    const result = [];

    const shuffled = shuffle(allExercises);

    for (let i = 0; i < shuffled.length && result.length < count; i++) {
      const ex = shuffled[i];
      if (!pickedNames.has(ex.name)) {
        pickedNames.add(ex.name);
        result.push(ex);
      }
    }

    // If still not enough (small DB), allow duplicates
    while (result.length < count && allExercises.length > 0) {
      const ex = allExercises[Math.floor(Math.random() * allExercises.length)];
      result.push(ex);
    }

    return result;
  };

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const selectedDays = weekDays.slice(0, profile.daysPerWeek);

  const restDay = {
    name: "Rest Day",
    reps: "Active Recovery",
    image: "https://res.cloudinary.com/dwpv4g1cb/image/upload/v1751708770/exercise1_wnehud.png",
    modalImage: "https://res.cloudinary.com/dwpv4g1cb/image/upload/v1751708771/exercise2_sp4k7h.png",
    description:
      "Take a day off from intense training. Focus on light stretching, walking, or other low-intensity activities to promote recovery."
  };

  const schedule = {};

  // Assign workouts
  selectedDays.forEach(day => {
    const dailyExercises = pickExercisesForDay(exercises, 3);
    schedule[day] = dailyExercises.map(ex => ({
      name: ex.name,
      reps: getFormattedReps(),
      image: ex.image,
      modalImage: ex.modalImage,
      description: ex.description
    }));
  });

  // Fill rest days
  weekDays.forEach(day => {
    if (!schedule[day]) schedule[day] = [restDay];
  });

  return schedule;
}

export default generateWorkoutPlan;