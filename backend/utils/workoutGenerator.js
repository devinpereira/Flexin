const generateWorkoutPlan = (profile, exercises) => {
  const { experience, goal, daysperweek, preferredDuration, equipmentAccess, healthConditions } = profile;

  // Filter exercises based on equipment
  let filteredExercises = exercises.filter(ex => {
    if (equipmentAccess === "No equipment") return ex.equipment === "Bodyweight";
    if (equipmentAccess === "Limited equipment") return ex.equipment !== "Gym only";
    return true;
  });

  // Remove exercises for sensitive conditions
  if (healthConditions.includes("backpain")) {
    filteredExercises = filteredExercises.filter(ex => !ex.primaryMuscles.includes("Lower Back"));
  }

  // Filter by experience (example)
  filteredExercises = filteredExercises.filter(ex => {
    if (experience === "beginner") return ex.difficulty === "easy" || ex.difficulty === "medium";
    if (experience === "intermediate") return ex.difficulty !== "hard";
    return true;
  });

  // Plan generator — Simple per day split logic
  const workoutPlan = [];

  for (let i = 0; i < daysperweek; i++) {
    const dayPlan = {
      day: `Day ${i + 1}`,
      exercises: []
    };

    const selectedExercises = filteredExercises.sort(() => 0.5 - Math.random()).slice(0, 5);

    selectedExercises.forEach(ex => {
      dayPlan.exercises.push({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        instructions: ex.instructions
      });
    });

    workoutPlan.push(dayPlan);
  }

  return workoutPlan;
};

export default generateWorkoutPlan;
