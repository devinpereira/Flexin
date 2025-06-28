import Trainer from '../models/Trainer.js';

//Create trainer profile
export const createTrainer = async (req, res) => {
    try{
        const userId = req.user._id;
        const{
            name,
            age,
            bio,
            profilePhoto,
            certificates,
            services,
            photos,
            packages,
            availabilityStatus      
        } = req.body;

        const trainer = new Trainer(
            {
                userId,
                name,
                age,
                bio,
                profilePhoto,
                certificates,
                services,
                photos,
                packages,
                availabilityStatus
            }
        );
        await trainer.save();
        res.status(201).json({
            success: true,
            message: "Trainer profile created successfully",
            trainer
        });
}catch (err){
    res.status(500).json({
        success: false,
        message: "Failed to create trainer profile",
        error: err.message
    });
}
};

//Delete trainer profile
export const deleteTrainer = async (req, res) => {
    try {
        const trainerId = req.params.id;
        const trainer = await Trainer.findByIdAndDelete(trainerId);
        
        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trainer profile deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete trainer profile",
            error: err.message
        });
    }
};

//Update trainer profile
export const updateTrainer = async (req, res) => {
    try {
        const trainerId = req.params.id;
        const updates = req.body;

        const trainer = await Trainer.findByIdAndUpdate(trainerId, updates, { new: true });

        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trainer profile updated successfully",
            trainer
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update trainer profile",
            error: err.message
        });
    }
};  

//Get trainer by ID
export const getTrainerById = async (req, res) => {
    try {
        const trainerId = req.params.id;
        const trainer = await Trainer.findById(trainerId);

        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer profile not found"
            });
        }

        res.status(200).json({
            success: true,
            trainer
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to get trainer profile",
            error: err.message
        });
    }
};

//Get all trainers
export const getAllTrainers = async (req, res) => { 
    try {
        const trainers = await Trainer.find().populate('userId', 'name email');

        res.status(200).json({
            success: true,
            trainers
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to get trainers",
            error: err.message
        });
    }
};

// Add Feedback to Trainer
export const addFeedback = async (req, res) => {
  try {
    const { userName, comment, rating, photos } = req.body;
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    // Ensure feedbacks array exists
    if (!trainer.feedbacks) trainer.feedbacks = [];

    trainer.feedbacks.push({ userName, comment, rating, photos });
    await trainer.save();

    res.status(201).json({ message: "Feedback added", feedbacks: trainer.feedbacks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};