import TrainerSchedule from "../models/Trainer.schedule.model.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Exercise from "../models/Exercise.js";
import Trainer from "../models/Trainer.js";

// Helper function to enrich exercise data with details from Exercise collection
const enrichExerciseData = async (exerciseData) => {
  try {
    // Find the exercise in the database by name
    const exerciseFromDB = await Exercise.findOne({ name: exerciseData.name });
    
    if (exerciseFromDB) {
      return {
        ...exerciseData,
        image: exerciseFromDB.image,
        modalImage: exerciseFromDB.modalImage,
        bodyPart: exerciseFromDB.bodyPart,
        equipment: exerciseFromDB.equipment,
        difficulty: exerciseFromDB.difficulty,
        primaryMuscles: exerciseFromDB.primaryMuscles,
        secondaryMuscles: exerciseFromDB.secondaryMuscles
      };
    }
    
    // If exercise not found in DB, return original data
    return exerciseData;
  } catch (error) {
    console.error('Error enriching exercise data:', error);
    return exerciseData;
  }
};

// Helper function to process days and enrich exercises
const enrichScheduleDays = async (days) => {
  const enrichedDays = [];
  
  for (const day of days) {
    const enrichedExercises = [];
    
    for (const exercise of day.exercises) {
      const enrichedExercise = await enrichExerciseData(exercise);
      enrichedExercises.push(enrichedExercise);
    }
    
    enrichedDays.push({
      ...day,
      exercises: enrichedExercises
    });
  }
  
  return enrichedDays;
};

// Create or update a schedule for a user and trainer
export const upsertTrainerSchedule = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const userId = req.user._id;
    const { days } = req.body;

    // Enrich the exercise data with images and details from Exercise collection
    const enrichedDays = await enrichScheduleDays(days);

    const schedule = await TrainerSchedule.findOneAndUpdate(
      { userId, trainerId },
      { days: enrichedDays },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, schedule ,message: "Schedule created or updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Trainer assigns schedule to a user
export const assignScheduleToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;
    const { days } = req.body;

    // Enrich the exercise data with images and details from Exercise collection
    const enrichedDays = await enrichScheduleDays(days);

    const schedule = await TrainerSchedule.findOneAndUpdate(
      { userId, trainerId },
      { 
        days: enrichedDays,
        assignedBy: trainerId,
        assignedAt: new Date(),
        updatedBy: trainerId,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    ).populate('userId', 'fullName email profileImageUrl');

    res.status(200).json({ 
      success: true, 
      schedule,
      message: "Schedule assigned successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all users who have schedules assigned by this trainer (simplified)
export const getTrainerSubscribers = async (req, res) => {
  try {
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;
    
    // Get all schedules assigned by this trainer to get the users
    const schedules = await TrainerSchedule.find({ trainerId })
      .populate('userId', 'fullName email profileImageUrl')
      .sort({ updatedAt: -1 });

    // Extract unique users and format as subscribers
    const subscribers = schedules.map(schedule => ({
      _id: schedule._id,
      userId: schedule.userId,
      package: 'Active', // Simplified since they already have schedules
      assignedAt: schedule.assignedAt,
      updatedAt: schedule.updatedAt
    }));

    res.status(200).json({ 
      success: true, 
      subscribers 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all schedules assigned by trainer
export const getTrainerAssignedSchedules = async (req, res) => {
  try {
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;
    
    const schedules = await TrainerSchedule.find({ trainerId })
      .populate('userId', 'fullName email profileImageUrl')
      .sort({ updatedAt: -1 });

    res.status(200).json({ 
      success: true, 
      schedules 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get specific user's schedule for trainer
export const getUserScheduleForTrainer = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;
    console.log("Fetching schedule for userId:", userId, "by trainerId:", trainerId);
    
    const schedule = await TrainerSchedule.findOne({ userId, trainerId })
      .populate('userId', 'fullName');
    
    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "No schedule found for this user" 
      });
    }

    res.status(200).json({ 
      success: true, 
      schedule 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete user's schedule (trainer perspective)
export const deleteUserScheduleByTrainer = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;
    
    const result = await TrainerSchedule.findOneAndDelete({ userId, trainerId });
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: "Schedule not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Schedule deleted successfully" 
    });
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

// Get all available exercises
export const getAvailableExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({})
      .select('name bodyPart equipment difficulty instructions')
      .sort({ name: 1 });

    res.status(200).json({ 
      success: true, 
      exercises 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update user's schedule (trainer perspective)
export const updateUserScheduleByTrainer = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;
    const { days } = req.body;

    // Enrich the exercise data with images and details from Exercise collection
    const enrichedDays = await enrichScheduleDays(days);

    const schedule = await TrainerSchedule.findOneAndUpdate(
      { userId, trainerId },
      { 
        days: enrichedDays,
        updatedAt: new Date(),
        updatedBy: trainerId
      },
      { new: true }
    ).populate('userId', 'fullName email profileImageUrl');

    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "Schedule not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      schedule,
      message: "Schedule updated successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};