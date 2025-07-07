import Subscription from '../models/Subscription.js';
import Trainer from '../models/Trainer.js';

// Get user's current subscription for a trainer, including package details
export const getSubscriptionDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;

    // Get the most recent active subscription
    const subscription = await Subscription.findOne({
      userId,
      trainerId,
      $or: [{ endDate: { $exists: false } }, { endDate: null }]
    }).sort({ startDate: -1 });

    // Get trainer's packages
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, error: "Trainer not found" });
    }

    // Find the package details (if subscribed)
    let packageDetails = null;
    if (subscription && subscription.package) {
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

// Subscribe to a package (start new subscription, end any active one)
export const subscribeToPackage = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    const { package: packageName } = req.body;

    if (!packageName || !['silver', 'gold', 'ultimate'].includes(packageName)) {
      return res.status(400).json({ success: false, error: "Invalid or missing package name" });
    }

    // End any current active subscription
    await Subscription.updateMany(
      { userId, trainerId, $or: [{ endDate: { $exists: false } }, { endDate: null }] },
      { $set: { endDate: new Date() } }
    );

    // Create new subscription
    const subscription = new Subscription({
      userId,
      trainerId,
      package: packageName,
      startDate: new Date(),
      // endDate: left undefined/null for active
    });
    await subscription.save();

    res.status(201).json({ success: true, message: "Subscribed successfully", subscription });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to subscribe", details: err.message });
  }
};

// Cancel subscription (end current active subscription)
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    // End any current active subscription
    const result = await Subscription.updateMany(
      { userId, trainerId, $or: [{ endDate: { $exists: false } }, { endDate: null }] },
      { $set: { endDate: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, error: "No active subscription found to cancel" });
    }
    res.status(200).json({ success: true, message: "Subscription cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to cancel subscription", details: err.message });
  }
};

// Change subscription package (end current, start new)
export const changeSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    const { newPackage } = req.body;

    if (!newPackage || !['silver', 'gold', 'ultimate'].includes(newPackage)) {
      return res.status(400).json({ success: false, error: "Invalid or missing package name" });
    }

    // End current active subscription
    await Subscription.updateMany(
      { userId, trainerId, $or: [{ endDate: { $exists: false } }, { endDate: null }] },
      { $set: { endDate: new Date() } }
    );

    // Create new subscription
    const newSub = await Subscription.create({
      userId,
      trainerId,
      package: newPackage,
      startDate: new Date()
      // endDate: left undefined/null for active
    });

    res.json({ success: true, subscription: newSub });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to change subscription", details: err.message });
  }
};

// GET /api/v1/subscription/:trainerId/history
export const getSubscriptionHistory = async (req, res) => {
  const userId = req.user._id;
  const trainerId = req.params.id;
  const history = await Subscription.find({ userId, trainerId }).sort({ startDate: -1 });
  res.json({ success: true, history });
};