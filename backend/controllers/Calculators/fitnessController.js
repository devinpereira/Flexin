import FitnessProfile from "../../models/FitnessProfile.js";
import WorkoutSchedule from "../../models/WorkoutSchedule.js";
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