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
            availabilityStatus,
            feedbacks, // <-- Add this line
            socialMedia, // (optional, if you want to allow setting social links at creation)
            rating,      // (optional)
            reviewCount  // (optional)
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
                availabilityStatus,
                feedbacks: feedbacks || [], // <-- Add this line
                socialMedia: socialMedia || {},
                rating: rating || 0,
                reviewCount: reviewCount || 0
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

export const addFollower = async (req, res) => {
  try {
    const userId = req.user._id;
    const { trainerId } = req.body;
    await Trainer.findByIdAndUpdate(
      trainerId,
      { $addToSet: { followers: userId } }, // prevents duplicates
      { new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFollower = async (req, res) => {
  try {
    const userId = req.user._id;
    const { trainerId } = req.body;
    await Trainer.findByIdAndUpdate( 
      trainerId,
      { $pull: { followers: userId } }, // removes the userId from followers
      { new: true }
    ); 

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTrainersForUser = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const trainers = await Trainer.find({ followers: userId });
    res.json({ success: true, trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
