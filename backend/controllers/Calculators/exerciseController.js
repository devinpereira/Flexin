import Exercise from "../../models/Exercise.js";

export const addExercise = async (req, res) => {
    const { name, image, modalImage, bodyPart, description, equipment, difficulty, type, primaryMuscles, secondaryMuscles, sets, reps } = req.body;

    try {
        const newExercise = new Exercise({
            name,
            image,
            modalImage,
            bodyPart,
            description,
            equipment,
            difficulty,
            type,
            primaryMuscles,
            secondaryMuscles,
            sets,
            reps
        });

        await newExercise.save();
        res.status(200).json({ message: "Exercise added successfully", exercise: newExercise });
    } catch (error) {
        res.status(500).json({ message: "Error adding exercise", error: error.message });
    }
}

export const deleteExercise = async (req, res) => {
    const exerciseId = req.params.id;

    try {
        const exercise = await Exercise.findByIdAndDelete(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }
        res.status(200).json({ message: "Exercise deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting exercise", error: error.message });
    }
}

export const updateExercise = async (req, res) => {
    const exerciseId = req.params.id;
    const { name, image, modalImage, bodyPart, description, equipment, difficulty, type, primaryMuscles, secondaryMuscles, sets, reps } = req.body;

    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(exerciseId, {
            name,
            image,
            modalImage,
            bodyPart,
            description,
            equipment,
            difficulty,
            type,
            primaryMuscles,
            secondaryMuscles,
            sets,
            reps
        }, { new: true });

        if (!updatedExercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }
        res.status(200).json({ message: "Exercise updated successfully", exercise: updatedExercise });
    } catch (error) {
        res.status(500).json({ message: "Error updating exercise", error: error.message });
    }
}

export const getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json({ message: "Exercises retrieved successfully", exercises });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving exercises", error: error.message });
    }
}