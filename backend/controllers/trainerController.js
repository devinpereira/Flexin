import Trainer from '../models/Trainer.js';
import User from '../models/User.js';

// Upload a trainer photo to Cloudinary and return the URL
export const uploadTrainerPhoto = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // The file path is the Cloudinary URL
    return res.status(200).json({ success: true, url: req.file.path });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to upload photo', error: err.message });
  }
};


//Create trainer profile
export const createTrainer = async (req, res) => {
    try{
        const userId = req.user._id;
        const{
            name,
            phone,
            bio,
            profilePhoto,
            certificates,
            services,
            photos,
            packages,
            availabilityStatus,
            feedbacks, 
            socialMedia, 
            rating,     
            reviewCount,
            specialties,
            status, 
        } = req.body;

        const trainer = new Trainer(
            {
                userId,
                name,
                phone,
                bio,
                profilePhoto,
                certificates,
                services,
                photos,
                packages,
                availabilityStatus,
                feedbacks: feedbacks || [], 
                socialMedia: socialMedia || {},
                rating: rating || 0,
                reviewCount: reviewCount || 0,
                specialties: specialties || [],
                status: status || 'pending',
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
        const trainer = await Trainer.findById(trainerId).populate('userId', 'fullName email ');
        

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
        const trainers = await Trainer.find().populate('userId', 'fullName email'); // Populate userId with name and email


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
      { $addToSet: { followers: userId } },
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
      { $pull: { followers: userId } },
      { new: true }
    ); 

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTrainersForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainers = await Trainer.find({ followers: userId });
    res.json({ success: true, trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add feedback to trainer
export const addFeedbackToTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const { comment, rating } = req.body;
    const userName = req.user.fullName; 
    const profilePhoto = req.user.profileImageUrl || req.user.profilePhoto || ""; 
    
    const feedback = {
      userName,
      comment,
      rating,
      createdAt: new Date(),
      profilePhoto
    };

    await Trainer.findByIdAndUpdate(
      trainerId,
      { $push: { feedbacks: feedback } }
    );

    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    const feedbacks = trainer.feedbacks || [];
    const ratings = feedbacks.map(fb => fb.rating);
    const avgRating = ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;

    trainer.rating = avgRating;
    trainer.reviewCount = feedbacks.length;
    await trainer.save();

    res.json({ success: true, feedbacks: trainer.feedbacks, rating: trainer.rating, reviewCount: trainer.reviewCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add feedback", error: err.message });
  }
};

// Get current trainer's profile (for trainer dashboard)
export const getMyTrainerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find trainer profile for current user
    const trainer = await Trainer.findOne({ userId }).populate('userId', 'fullName email profileImageUrl');
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found. Please contact support."
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

// Update current trainer's profile (for trainer dashboard)
export const updateMyTrainerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Find and update trainer profile for current user
    const trainer = await Trainer.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email profileImageUrl');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found"
      });
    }

    // If updating email or name, also update in User model
    if (updates.email || updates.name) {
      await User.findByIdAndUpdate(userId, {
        ...(updates.email && { email: updates.email }),
        ...(updates.name && { fullName: updates.name })
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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
