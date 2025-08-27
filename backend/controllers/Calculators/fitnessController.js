import FitnessProfile from "../../models/FitnessProfile.js";
import WorkoutSchedule from "../../models/WorkoutSchedule.js";
import FitnessStats from "../../models/FitnessStats.js";
import generateWorkoutPlan from "../../utils/workoutGenerator.js";

export const getFitnessProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const existingProfile = await FitnessProfile.findOne({ userId });
        if (existingProfile) {
            return res.status(200).json({ exists: true, profile: existingProfile });
        } else {
            return res.status(200).json({ exists: false, message: "No fitness profile found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error checking existing profile", error: error.message });
    }
};

export const createFitnessProfile = async (req, res) => {
    const { experience, age, gender, weight, weightUnit, height, heightUnit, activityLevel, goals, preferredWorkoutDuration, workoutDaysPerWeek, healthConditions, equipmentAccess } = req.body;
    const userId = req.user.id;

    try {
        const existingProfile = await FitnessProfile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Fitness profile already exists" });
        }

        let weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
        let heightInCm = heightUnit === "ft" ? height * 30.48 : height;

        const newProfile = new FitnessProfile({
            userId,
            experience,
            age,
            gender,
            weight: weightInKg,
            height: heightInCm,
            activityLevel,
            goal: goals,
            preferredWorkoutDuration,
            daysPerWeek: workoutDaysPerWeek,
            healthConditions,
            equipmentAccess
        });

        await newProfile.save();

        // Generate initial workout plan
        const schedule = await generateWorkoutPlan(newProfile);

        await WorkoutSchedule.create({
            userId,
            schedule
        });

        return res.status(200).json({ message: "Fitness profile created successfully", profile: newProfile });

    } catch (error) {
        return res.status(500).json({ message: "Error checking existing profile", error: error.message });
    }
};

export const recalculateFitnessProfile = async (req, res) => {
    const userId = req.user.id;
    const { weight, weightUnit, height, heightUnit, } = req.body;

    try {
        const existingProfile = await FitnessProfile.findOne({ userId });
        if (!existingProfile) {
            return res.status(404).json({ message: "Fitness profile not found" });
        }

        // Convert weight and height to consistent units
        existingProfile.weight = weightUnit === "lbs" ? weight * 0.453592 : weight;
        existingProfile.height = heightUnit === "ft" ? height * 30.48 : height;

        await existingProfile.save();

        // Regenerate workout plan
        const schedule = await generateWorkoutPlan(existingProfile);

        return res.status(200).json({ message: "Fitness profile updated successfully", profile: existingProfile });

    } catch (error) {
        return res.status(500).json({ message: "Error updating fitness profile", error: error.message });
    }
};

export const getFitnessStats = async (req, res) => {
    const userId = req.user.id;
    const { timeRange = 'month' } = req.query; // week, month, quarter

    try {
        const fitnessStats = await FitnessStats.findOne({ userId });
        
        if (!fitnessStats) {
            return res.status(404).json({ message: "No fitness stats found" });
        }

        // Filter data based on time range
        const now = new Date();
        let startDate;
        
        switch (timeRange) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'quarter':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Filter historical data by date range
        const filteredStats = {
            bmiHistory: fitnessStats.bmiHistory.filter(entry => new Date(entry.date) >= startDate),
            bmrHistory: fitnessStats.bmrHistory.filter(entry => new Date(entry.date) >= startDate),
            workoutHistory: fitnessStats.workoutHistory.filter(entry => new Date(entry.date) >= startDate),
            weightHistory: fitnessStats.weightHistory.filter(entry => new Date(entry.date) >= startDate),
            scheduleAdherence: fitnessStats.scheduleAdherence,
            calorieIntake: fitnessStats.calorieIntake.filter(entry => new Date(entry.date) >= startDate)
        };

        return res.status(200).json({ 
            message: "Fitness stats retrieved successfully", 
            data: filteredStats 
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Error retrieving fitness stats", 
            error: error.message 
        });
    }
};

// Create or update fitness stats entry
export const saveFitnessStats = async (req, res) => {
    const userId = req.user.id;
    const { 
        bmiEntry, 
        bmrEntry, 
        workoutEntry, 
        weightEntry, 
        scheduleAdherenceEntry, 
        calorieIntakeEntry 
    } = req.body;

    try {
        let fitnessStats = await FitnessStats.findOne({ userId });

        // Create new fitness stats record if doesn't exist
        if (!fitnessStats) {
            fitnessStats = new FitnessStats({
                userId,
                bmiHistory: [],
                bmrHistory: [],
                workoutHistory: [],
                weightHistory: [],
                scheduleAdherence: {
                    Monday: { scheduled: 0, completed: 0 },
                    Tuesday: { scheduled: 0, completed: 0 },
                    Wednesday: { scheduled: 0, completed: 0 },
                    Thursday: { scheduled: 0, completed: 0 },
                    Friday: { scheduled: 0, completed: 0 },
                    Saturday: { scheduled: 0, completed: 0 },
                    Sunday: { scheduled: 0, completed: 0 }
                },
                calorieIntake: []
            });
        }

        // Add BMI entry
        if (bmiEntry) {
            fitnessStats.bmiHistory.push({
                date: bmiEntry.date || new Date(),
                value: bmiEntry.value,
                category: bmiEntry.category
            });
        }

        // Add BMR entry
        if (bmrEntry) {
            fitnessStats.bmrHistory.push({
                date: bmrEntry.date || new Date(),
                value: bmrEntry.value,
                goal: bmrEntry.goal
            });
        }

        // Add workout entry
        if (workoutEntry) {
            fitnessStats.workoutHistory.push({
                date: workoutEntry.date || new Date(),
                duration: workoutEntry.duration,
                caloriesBurned: workoutEntry.caloriesBurned,
                type: workoutEntry.type
            });
        }

        // Add weight entry
        if (weightEntry) {
            fitnessStats.weightHistory.push({
                date: weightEntry.date || new Date(),
                value: weightEntry.value
            });
        }

        // Update schedule adherence
        if (scheduleAdherenceEntry) {
            fitnessStats.scheduleAdherence = {
                ...fitnessStats.scheduleAdherence,
                ...scheduleAdherenceEntry
            };
        }

        // Add calorie intake entry
        if (calorieIntakeEntry) {
            fitnessStats.calorieIntake.push({
                date: calorieIntakeEntry.date || new Date(),
                intake: calorieIntakeEntry.intake,
                goal: calorieIntakeEntry.goal,
                protein: calorieIntakeEntry.protein,
                carbs: calorieIntakeEntry.carbs,
                fat: calorieIntakeEntry.fat
            });
        }

        await fitnessStats.save();

        return res.status(200).json({ 
            message: "Fitness stats saved successfully", 
            data: fitnessStats 
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Error saving fitness stats", 
            error: error.message 
        });
    }
};

// Update specific fitness stats entry
export const updateFitnessStatsEntry = async (req, res) => {
    const userId = req.user.id;
    const { entryType, entryId, updatedData } = req.body;

    try {
        const fitnessStats = await FitnessStats.findOne({ userId });
        
        if (!fitnessStats) {
            return res.status(404).json({ message: "No fitness stats found" });
        }

        let entryFound = false;

        switch (entryType) {
            case 'bmi':
                const bmiEntry = fitnessStats.bmiHistory.id(entryId);
                if (bmiEntry) {
                    Object.assign(bmiEntry, updatedData);
                    entryFound = true;
                }
                break;
            case 'bmr':
                const bmrEntry = fitnessStats.bmrHistory.id(entryId);
                if (bmrEntry) {
                    Object.assign(bmrEntry, updatedData);
                    entryFound = true;
                }
                break;
            case 'workout':
                const workoutEntry = fitnessStats.workoutHistory.id(entryId);
                if (workoutEntry) {
                    Object.assign(workoutEntry, updatedData);
                    entryFound = true;
                }
                break;
            case 'weight':
                const weightEntry = fitnessStats.weightHistory.id(entryId);
                if (weightEntry) {
                    Object.assign(weightEntry, updatedData);
                    entryFound = true;
                }
                break;
            case 'calorie':
                const calorieEntry = fitnessStats.calorieIntake.id(entryId);
                if (calorieEntry) {
                    Object.assign(calorieEntry, updatedData);
                    entryFound = true;
                }
                break;
            case 'scheduleAdherence':
                if (updatedData && typeof updatedData === 'object') {
                    fitnessStats.scheduleAdherence = {
                        ...fitnessStats.scheduleAdherence,
                        ...updatedData
                    };
                    entryFound = true;
                }
                break;
            default:
                return res.status(400).json({ message: "Invalid entry type" });
        }

        if (!entryFound) {
            return res.status(404).json({ message: "Entry not found" });
        }

        await fitnessStats.save();

        return res.status(200).json({ 
            message: "Fitness stats entry updated successfully", 
            data: fitnessStats 
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Error updating fitness stats entry", 
            error: error.message 
        });
    }
};

// Delete specific fitness stats entry
export const deleteFitnessStatsEntry = async (req, res) => {
    const userId = req.user.id;
    const { entryType, entryId } = req.params;

    try {
        const fitnessStats = await FitnessStats.findOne({ userId });
        
        if (!fitnessStats) {
            return res.status(404).json({ message: "No fitness stats found" });
        }

        let entryFound = false;

        switch (entryType) {
            case 'bmi':
                const bmiEntry = fitnessStats.bmiHistory.id(entryId);
                if (bmiEntry) {
                    bmiEntry.deleteOne();
                    entryFound = true;
                }
                break;
            case 'bmr':
                const bmrEntry = fitnessStats.bmrHistory.id(entryId);
                if (bmrEntry) {
                    bmrEntry.deleteOne();
                    entryFound = true;
                }
                break;
            case 'workout':
                const workoutEntry = fitnessStats.workoutHistory.id(entryId);
                if (workoutEntry) {
                    workoutEntry.deleteOne();
                    entryFound = true;
                }
                break;
            case 'weight':
                const weightEntry = fitnessStats.weightHistory.id(entryId);
                if (weightEntry) {
                    weightEntry.deleteOne();
                    entryFound = true;
                }
                break;
            case 'calorie':
                const calorieEntry = fitnessStats.calorieIntake.id(entryId);
                if (calorieEntry) {
                    calorieEntry.deleteOne();
                    entryFound = true;
                }
                break;
            default:
                return res.status(400).json({ message: "Invalid entry type" });
        }

        if (!entryFound) {
            return res.status(404).json({ message: "Entry not found" });
        }

        await fitnessStats.save();

        return res.status(200).json({ 
            message: "Fitness stats entry deleted successfully" 
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Error deleting fitness stats entry", 
            error: error.message 
        });
    }
};