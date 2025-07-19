import PendingTrainer from '../models/PendingTrainer.js';
import User from '../models/User.js';
import Trainer from '../models/Trainer.js'; // Assuming you have a Trainer model

export const applyAsTrainer = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // Parse specialties safely
    let specialtiesArr = [];
    try {
      specialtiesArr = Array.isArray(req.body.specialties)
        ? req.body.specialties
        : JSON.parse(req.body.specialties);
    } catch {
      specialtiesArr = [];
    }

    // Collect certificates
    const certificates = [];
    for (let i = 0; i < 5; i++) {
      if (req.files[`certificate${i}`]) {
        certificates.push(req.files[`certificate${i}`][0].path);
      }
    }

    const pendingTrainer = new PendingTrainer({
      userId: req.user._id,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      experience: req.body.experience,
      bio: req.body.bio,
      specialties: specialtiesArr,
      certificates,
      identificationDocument: req.files.identificationDocument
        ? req.files.identificationDocument[0].path
        : "",
        
    });

    await pendingTrainer.save();
    res.json({ success: true, message: 'Application submitted' });
  } catch (err) {
    console.error("ApplyAsTrainer error:", err);
    res.status(500).json({ success: false, message: 'Failed to submit application', error: err.message });
  }
};

export const getPendingTrainers = async (req, res) => {
  try {
    const pendingTrainers = await PendingTrainer.find({})
      .populate('userId', 'name email profilePicture') // Get user info
      .sort({ createdAt: -1 }); // Newest first

    res.json({ 
      success: true, 
      data: pendingTrainers,
      count: pendingTrainers.length 
    });
  } catch (err) {
    console.error("Get pending trainers error:", err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending trainers', 
      error: err.message 
    });
  }
};

export const acceptTrainer = async (req, res) => {
  try {
    const { pendingTrainerId } = req.params;

    // Find the pending trainer application
    const pendingTrainer = await PendingTrainer.findById(pendingTrainerId);
    if (!pendingTrainer) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Map certificates (from URLs to objects)
    const certificateObjs = (pendingTrainer.certificates || []).map(url => ({
      title: "Certificate",
      issuer: "N/A",
      year: new Date().getFullYear(),
      url
    }));

    // Create a new Trainer record
    const trainer = new Trainer({
      userId: pendingTrainer.userId,
      name: pendingTrainer.fullName,
      phone: pendingTrainer.phone,
      bio: pendingTrainer.bio,
      profilePhoto: req.user.profileImageUrl,
      certificates: certificateObjs,
      services: [],
      photos: [],
      packages: [],
      feedbacks: [],
      socialMedia: {},
      rating: 0,
      reviewCount: 0,
      availabilityStatus: "available",
      followers: [],
      specialties: pendingTrainer.specialties,
      status: "active",
      title: "Certified Trainer",
    });

    await trainer.save();

    // Update user role to 'trainer'
    await User.findByIdAndUpdate(pendingTrainer.userId, {
      role: 'trainer'
    });

    // Remove from pending trainers
    await PendingTrainer.findByIdAndDelete(pendingTrainerId);

    res.json({
      success: true,
      message: 'Trainer application accepted successfully',
      data: trainer
    });
  } catch (err) {
    console.error("Accept trainer error:", err);
    res.status(500).json({
      success: false,
      message: 'Failed to accept trainer application',
      error: err.message
    });
  }
};

export const rejectTrainer = async (req, res) => {
  try {
    const { pendingTrainerId } = req.params;
    const { reason } = req.body; // Optional rejection reason

    // Find and delete the pending trainer application
    const pendingTrainer = await PendingTrainer.findByIdAndDelete(pendingTrainerId);
    if (!pendingTrainer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    // Optional: Send rejection notification (email, etc.)
    // await sendRejectionEmail(pendingTrainer.email, reason);

    res.json({ 
      success: true, 
      message: 'Trainer application rejected successfully',
      rejectedApplication: {
        id: pendingTrainer._id,
        fullName: pendingTrainer.fullName,
        email: pendingTrainer.email,
        reason: reason || 'No reason provided'
      }
    });
  } catch (err) {
    console.error("Reject trainer error:", err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject trainer application', 
      error: err.message 
    });
  }
};