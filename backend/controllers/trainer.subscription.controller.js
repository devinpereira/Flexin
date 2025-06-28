import Subscription from '../models/Subscription.js';

// Get user's current subscription for a trainer
export const getSubscriptionDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    const subscription = await Subscription.findOne({ userId, trainerId });
    res.json({
      currentSubscription: subscription ? subscription.package : null,
      subscription,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Subscribe to a package
export const subscribeToPackage = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    const { package: packageName } = req.body;

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

    res.json({ success: true, subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainerId = req.params.id;
    await Subscription.deleteMany({ userId, trainerId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};