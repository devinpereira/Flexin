import PendingTrainer from '../models/PendingTrainer.js';

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
      profilePhoto: req.files.profilePhoto
        ? req.files.profilePhoto[0].path
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
  const pending = await PendingTrainer.find({ status: 'pending' });
  res.json({ success: true, pending });
};