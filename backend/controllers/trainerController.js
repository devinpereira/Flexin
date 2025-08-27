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

        console.log('Updating trainer with ID:', trainerId);
        console.log('Updates received:', updates);

        // Validate required fields if they're being updated
        if (updates.phone && !/\d{9}/.test(updates.phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 9 digits"
            });
        }

        if (updates.specialties && Array.isArray(updates.specialties)) {
            const validSpecialties = [
                "Strength & Conditioning",
                "Yoga & Flexibility", 
                "Weight Loss",
                "Nutrition",
                "Cardio & HIIT",
                "Pilates"
            ];
            const invalidSpecialties = updates.specialties.filter(s => !validSpecialties.includes(s));
            if (invalidSpecialties.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid specialties: ${invalidSpecialties.join(', ')}`
                });
            }
        }

        if (updates.availabilityStatus && !["available", "unavailable"].includes(updates.availabilityStatus)) {
            return res.status(400).json({
                success: false,
                message: "Availability status must be 'available' or 'unavailable'"
            });
        }

        if (updates.status && !["active", "inactive", "pending"].includes(updates.status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'active', 'inactive', or 'pending'"
            });
        }

        // Validate packages if they're being updated
        if (updates.packages && Array.isArray(updates.packages)) {
            const validPackageNames = ["Silver", "Gold", "Ultimate"];
            for (let i = 0; i < updates.packages.length; i++) {
                const pkg = updates.packages[i];
                if (pkg.name && !validPackageNames.includes(pkg.name)) {
                    // Try to capitalize the first letter if it's lowercase
                    const capitalizedName = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1).toLowerCase();
                    if (validPackageNames.includes(capitalizedName)) {
                        updates.packages[i].name = capitalizedName;
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: `Invalid package name: ${pkg.name}. Must be one of: ${validPackageNames.join(', ')}`
                        });
                    }
                }
                if (pkg.price && (typeof pkg.price !== 'number' || pkg.price < 0)) {
                    return res.status(400).json({
                        success: false,
                        message: "Package price must be a positive number"
                    });
                }
                if (pkg.features && !Array.isArray(pkg.features)) {
                    return res.status(400).json({
                        success: false,
                        message: "Package features must be an array"
                    });
                }
            }
        }

        const trainer = await Trainer.findByIdAndUpdate(trainerId, updates, { 
            new: true, 
            runValidators: true 
        });

        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer profile not found"
            });
        }

        console.log('Trainer profile updated successfully');
        res.status(200).json({
            success: true,
            message: "Trainer profile updated successfully",
            trainer
        });
    } catch (err) {
        console.error('Error updating trainer profile:', err);
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

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
        const trainer = await Trainer.findOne({ _id: trainerId, status: 'active' }).populate('userId', 'fullName email ');
        

        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer profile not found or not active"
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
        const trainers = await Trainer.find({ status: 'active' }).populate('userId', 'fullName email'); // Only get active trainers


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
    const trainers = await Trainer.find({ followers: userId, status: 'active' });
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

    console.log('Updating trainer profile for userId:', userId);
    console.log('Updates received:', updates);

    // Validate required fields if they're being updated
    if (updates.phone && !/\d{9}/.test(updates.phone)) {
        return res.status(400).json({
            success: false,
            message: "Phone number must be 9 digits"
        });
    }

    if (updates.specialties && Array.isArray(updates.specialties)) {
        const validSpecialties = [
            "Strength & Conditioning",
            "Yoga & Flexibility", 
            "Weight Loss",
            "Nutrition",
            "Cardio & HIIT",
            "Pilates"
        ];
        const invalidSpecialties = updates.specialties.filter(s => !validSpecialties.includes(s));
        if (invalidSpecialties.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid specialties: ${invalidSpecialties.join(', ')}`
            });
        }
    }

    if (updates.availabilityStatus && !["available", "unavailable"].includes(updates.availabilityStatus)) {
        return res.status(400).json({
            success: false,
            message: "Availability status must be 'available' or 'unavailable'"
        });
    }

    if (updates.status && !["active", "inactive", "pending"].includes(updates.status)) {
        return res.status(400).json({
            success: false,
            message: "Status must be 'active', 'inactive', or 'pending'"
        });
    }

    // Validate packages if they're being updated
    if (updates.packages && Array.isArray(updates.packages)) {
        const validPackageNames = ["Silver", "Gold", "Ultimate"];
        for (let i = 0; i < updates.packages.length; i++) {
            const pkg = updates.packages[i];
            if (pkg.name && !validPackageNames.includes(pkg.name)) {
                // Try to capitalize the first letter if it's lowercase
                const capitalizedName = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1).toLowerCase();
                if (validPackageNames.includes(capitalizedName)) {
                    updates.packages[i].name = capitalizedName;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid package name: ${pkg.name}. Must be one of: ${validPackageNames.join(', ')}`
                    });
                }
            }
            if (pkg.price && (typeof pkg.price !== 'number' || pkg.price < 0)) {
                return res.status(400).json({
                    success: false,
                    message: "Package price must be a positive number"
                });
            }
            if (pkg.features && !Array.isArray(pkg.features)) {
                return res.status(400).json({
                    success: false,
                    message: "Package features must be an array"
                });
            }
        }
    }

    // Find the trainer first to make sure it exists
    const existingTrainer = await Trainer.findOne({ userId });
    if (!existingTrainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found"
      });
    }

    // Separate User model updates from Trainer model updates
    const userUpdates = {};
    const trainerUpdates = { ...updates };

    // If updating email or name, prepare User model updates
    if (updates.email) {
      userUpdates.email = updates.email;
      delete trainerUpdates.email; // Remove from trainer updates since it's stored in User model
    }
    if (updates.name) {
      userUpdates.fullName = updates.name;
      // Keep name in trainer updates as well since Trainer model has its own name field
    }

    // Update User model if needed
    if (Object.keys(userUpdates).length > 0) {
      console.log('Updating User model with:', userUpdates);
      await User.findByIdAndUpdate(userId, userUpdates, { 
        new: true, 
        runValidators: true 
      });
    }

    // Update Trainer model
    console.log('Updating Trainer model with:', trainerUpdates);
    const trainer = await Trainer.findOneAndUpdate(
      { userId },
      trainerUpdates,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email profileImageUrl');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Failed to update trainer profile"
      });
    }

    console.log('Trainer profile updated successfully');
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      trainer
    });
  } catch (err) {
    console.error('Error updating trainer profile:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors
        });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update trainer profile",
      error: err.message
    });
  }
};

// Get all feedbacks for the current trainer
export const getMyTrainerFeedbacks = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find trainer profile for current user
    const trainer = await Trainer.findOne({ userId }).select('feedbacks');
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found"
      });
    }

    // Sort feedbacks by creation date (newest first)
    const sortedFeedbacks = trainer.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      feedbacks: sortedFeedbacks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get feedbacks",
      error: err.message
    });
  }
};

// Remove a specific feedback from trainer's profile
export const removeFeedback = async (req, res) => {
  try {
    const userId = req.user._id;
    const { feedbackId } = req.params;
    
    // Find trainer profile for current user
    const trainer = await Trainer.findOne({ userId });
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found"
      });
    }

    // Find the feedback to remove
    const feedbackIndex = trainer.feedbacks.findIndex(
      feedback => feedback._id.toString() === feedbackId
    );

    if (feedbackIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    // Remove the feedback
    const removedFeedback = trainer.feedbacks[feedbackIndex];
    trainer.feedbacks.splice(feedbackIndex, 1);

    // Recalculate rating and review count
    const feedbacks = trainer.feedbacks || [];
    const ratings = feedbacks.map(fb => fb.rating);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;
    
    trainer.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place
    trainer.reviewCount = feedbacks.length;

    await trainer.save();

    res.status(200).json({
      success: true,
      message: "Feedback removed successfully",
      removedFeedback,
      rating: trainer.rating,
      reviewCount: trainer.reviewCount
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to remove feedback",
      error: err.message
    });
  }
};
