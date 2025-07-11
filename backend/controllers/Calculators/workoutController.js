import WorkoutSchedule from "../../models/WorkoutSchedule.js";
import CustomWorkoutSchedule from "../../models/CustomWorkoutSchedule.js";

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

export const createCustomWorkoutPlan = async (req, res) => {
  const userId = req.user.id;
  const { id, name, description, days, exercises } = req.body.newSchedule;

  try {
    if (!name || !days || !exercises) {
      return res.status(400).json({ message: "Name, days, and exercises are required" });
    }

    const newWorkoutPlan = new CustomWorkoutSchedule({
      id,
      userId,
      name,
      description,
      days,
      exercises,
      createdAt: new Date()
    });

    await newWorkoutPlan.save();
    return res.status(201).json({ message: "Workout plan created successfully", plan: newWorkoutPlan });
  } catch (err) {
    console.error("Error creating workout plan:", err);
    return res.status(500).json({ message: "Server error. Failed to create workout plan.", error: err.message });
  }
};

export const getCustomWorkoutPlans = async (req, res) => {
  const userId = req.user.id;

  try {
    const plans = await CustomWorkoutSchedule.find({ userId }).sort({ createdAt: -1 });
    if (!plans || plans.length === 0) {
      return res.status(404).json({ message: "No custom workout plans found" });
    }
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCustomWorkoutPlan = async (req, res) => {
  const { id: scheduleId } = req.params;

  try {
    const plan = await CustomWorkoutSchedule.findById(scheduleId);
    if (!plan || plan.length === 0) {
      return res.status(404).json({ message: "No custom workout plans found" });
    }
    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWorkoutPlan = async (req, res) => {
  const { id: scheduleId } = req.params;
  const { schedule } = req.body;

  try {
    if (!schedule || typeof schedule !== 'object') {
      return res.status(400).json({ message: "Invalid schedule format" });
    }

    // Get the latest workout plan
    const latestPlan = await CustomWorkoutSchedule.findById(scheduleId);

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