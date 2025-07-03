import Subscription from '../models/Subscription.js';
import Trainer from '../models/Trainer.js';

// Get user's current subscription for a trainer, including package details
export const getSubscriptionDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;

    // 1. Get user's subscription
    const subscription = await Subscription.findOne({ userId, trainerId });

    // 2. Get trainer's packages
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, error: "Trainer not found" });
    }

    // 3. Find the package details (if subscribed)
    let packageDetails = null;
    if (subscription && subscription.package) {
      // Find the package object by name (case-insensitive)
      packageDetails = Array.isArray(trainer.packages)
        ? trainer.packages.find(
            (pkg) =>
              pkg.name &&
              pkg.name.trim().toLowerCase() === subscription.package.trim().toLowerCase()
          )
        : null;
    }

    res.status(200).json({
      success: true,
      currentSubscription: subscription ? subscription.package : null,
      subscription,
      packageDetails: packageDetails || null,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch subscription details", details: err.message });
  }
};

// Subscribe to a package
export const subscribeToPackage = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    const { package: packageName } = req.body;

    if (!packageName || !['silver', 'gold', 'ultimate'].includes(packageName)) {
      return res.status(400).json({ success: false, error: "Invalid or missing package name" });
    }

    // Remove any existing subscription
    await Subscription.deleteMany({ userId, trainerId });

    // Create new subscription
    const subscription = new Subscription({
      userId,
      trainerId,
      package: packageName,
      startDate: new Date(),
    });
    await subscription.save();

    res.status(201).json({ success: true, message: "Subscribed successfully", subscription });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to subscribe", details: err.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    const result = await Subscription.deleteMany({ userId, trainerId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "No active subscription found to cancel" });
    }
    res.status(200).json({ success: true, message: "Subscription cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to cancel subscription", details: err.message });
  }
};