import Subscription from '../models/Subscription.js';
import Trainer from '../models/Trainer.js';
import Payment from '../models/Payment.js';
import mongoose from 'mongoose';

// Helper function to get the highest payment ID across all collections
const getHighestPaymentId = async () => {
  try {
    const allPayments = await Payment.find({});
    let maxNumber = 0;
    
    // Check nextPaymentId fields
    allPayments.forEach(payment => {
      if (payment.nextPaymentId) {
        const number = parseInt(payment.nextPaymentId.replace('TRPM', ''));
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      }
      
      // Check individual payment IDs in the payments arrays
      if (payment.payments && Array.isArray(payment.payments)) {
        payment.payments.forEach(p => {
          if (p.paymentId) {
            const number = parseInt(p.paymentId.replace('TRPM', ''));
            if (!isNaN(number) && number > maxNumber) {
              maxNumber = number;
            }
          }
        });
      }
    });
    
    return maxNumber;
  } catch (error) {
    console.error('Error getting highest payment ID:', error);
    return 0;
  }
};

// Helper function to generate next payment ID
const generateNextPaymentId = async () => {
  const highestNumber = await getHighestPaymentId();
  const nextNumber = highestNumber + 1;
  const paymentId = `TRPM${nextNumber.toString().padStart(4, '0')}`;
  console.log('Generated next payment ID:', paymentId, 'from highest:', highestNumber);
  return paymentId;
};

// GET /api/v1/subscription/all-trainers/total-revenue
export const getAllTrainersSubscriptionTotals = async (req, res) => {
  try {
    // Get all trainers
    const trainers = await Trainer.find({ status: 'active' });
    const now = new Date();
    const results = [];
    
    // Get the current highest payment ID number across all collections
    let nextAvailableNumber = (await getHighestPaymentId()) + 1;
    
    // First, ensure all trainers with amounts due have unique nextPaymentIds
    for (const trainer of trainers) {
      // Find the payment record for this trainer
      let paymentRecord = await Payment.findOne({ trainerId: trainer._id });
      const lastPaidDate = paymentRecord?.lastPaidAt || new Date(0);
      
      // Get all subscriptions for this trainer from lastPaidDate up to now
      const subs = await Subscription.find({
        trainerId: trainer._id,
        startDate: { $gt: lastPaidDate, $lte: now }
      });
      
      // Calculate total amount due
      let total = 0;
      subs.forEach(sub => {
        const pkg = Array.isArray(trainer.packages)
          ? trainer.packages.find(p => p.name.toLowerCase() === sub.package.toLowerCase())
          : null;
        if (pkg) total += pkg.price;
      });
      
      // Ensure each trainer with amount due has a unique nextPaymentId
      if (total > 0) {
        if (!paymentRecord) {
          // Create new payment record with unique nextPaymentId
          const nextPaymentId = `TRPM${nextAvailableNumber.toString().padStart(4, '0')}`;
          paymentRecord = new Payment({
            trainerId: trainer._id,
            nextPaymentId: nextPaymentId,
            payments: [],
            totalAmountPaid: 0,
            status: 'active',
            createdAt: now
          });
          await paymentRecord.save();
          nextAvailableNumber++;
        } else if (!paymentRecord.nextPaymentId) {
          // Update existing record with unique nextPaymentId
          const nextPaymentId = `TRPM${nextAvailableNumber.toString().padStart(4, '0')}`;
          paymentRecord.nextPaymentId = nextPaymentId;
          await paymentRecord.save();
          nextAvailableNumber++;
        }
      }
      
      // Display the payment ID
      let displayPaymentId;
      if (paymentRecord && paymentRecord.nextPaymentId) {
        displayPaymentId = paymentRecord.nextPaymentId;
      } else if (total > 0) {
        displayPaymentId = "Pending Assignment";
      } else {
        displayPaymentId = "No amount due";
      }
      
      results.push({
        trainerId: trainer._id,
        trainerName: trainer.name,
        paymentId: displayPaymentId, // Unique payment ID per trainer
        total,
        count: subs.length,
        lastPaidDate
      });
    }
    
    res.json({ success: true, trainers: results });
  } catch (err) {
    console.error('Error in getAllTrainersSubscriptionTotals:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/subscription/:trainerId/total-revenue
export const getTrainerSubscriptionTotal = async (req, res) => {
  try {
    const trainerId = req.params.id;
    console.log("Calculating total revenue for trainer ID:", trainerId);
    const now = new Date();

    // Find payment record for this trainer
    const paymentRecord = await Payment.findOne({ trainerId });
    const lastPaidDate = paymentRecord?.lastPaidAt || new Date(0);

    // Get all subscriptions for this trainer from lastPaidDate up to now
    const subs = await Subscription.find({
      trainerId,
      startDate: { $gt: lastPaidDate, $lte: now }
    });
    
    // Get trainer and packages
    let trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ success: false, error: "Trainer not found" });
    
    // Calculate total
    let total = 0;
    subs.forEach(sub => {
      const pkg = Array.isArray(trainer.packages)
        ? trainer.packages.find(p => p.name.toLowerCase() === sub.package.toLowerCase())
        : null;
      if (pkg) total += pkg.price;
    });
    
    res.json({ 
      success: true, 
      total, 
      count: subs.length, 
      lastPaidDate, 
      nextPaymentId: paymentRecord?.nextPaymentId || await generateNextPaymentId()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

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

// GET /api/v1/subscription/:id/payment-history
export const getTrainerPaymentHistory = async (req, res) => {
  try {
    const trainerId = req.params.id;
    
    // Find the trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found' });
    }

    // Find the payment record for this trainer
    const paymentRecord = await Payment.findOne({ trainerId }).populate('trainerId', 'name email');
    
    if (!paymentRecord) {
      return res.json({ 
        success: true, 
        trainerName: trainer.name,
        trainerEmail: trainer.email,
        totalAmountPaid: 0,
        nextPaymentId: 'No payment record',
        paymentHistory: [],
        currentAmountDue: 0
      });
    }

    // Calculate current amount due (from last paid date until now)
    const now = new Date();
    const lastPaidDate = paymentRecord.lastPaidAt || new Date(0);
    
    const subs = await Subscription.find({
      trainerId: trainerId,
      startDate: { $gt: lastPaidDate, $lte: now }
    });
    
    let currentAmountDue = 0;
    subs.forEach(sub => {
      const pkg = Array.isArray(trainer.packages)
        ? trainer.packages.find(p => p.name.toLowerCase() === sub.package.toLowerCase())
        : null;
      if (pkg) currentAmountDue += pkg.price;
    });

    res.json({ 
      success: true,
      trainerName: trainer.name,
      trainerEmail: trainer.email,
      totalAmountPaid: paymentRecord.totalAmountPaid,
      nextPaymentId: paymentRecord.nextPaymentId,
      paymentHistory: paymentRecord.payments.sort((a, b) => new Date(b.datePaid) - new Date(a.datePaid)), // Most recent first
      currentAmountDue: currentAmountDue,
      lastPaidAt: paymentRecord.lastPaidAt,
      createdAt: paymentRecord.createdAt
    });
  } catch (err) {
    console.error('Error in getTrainerPaymentHistory:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/v1/subscription/:trainerId/mark-paid
export const markTrainerPaymentAsPaid = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const now = new Date();
    const amount = req.body.amount || 0;
    
    console.log('markTrainerPaymentAsPaid called with:', { trainerId, amount });
    
    // Validate trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found' });
    }

    // Find existing payment record for this trainer
    let paymentRecord = await Payment.findOne({ trainerId });
    
    if (!paymentRecord) {
      return res.status(404).json({ success: false, error: 'Payment record not found. Please refresh the page.' });
    }
    
    // Use the reserved nextPaymentId for this payment
    const currentPaymentId = paymentRecord.nextPaymentId;
    
    // Generate the next payment ID for future payments
    const highestPaymentId = await getHighestPaymentId();
    const nextPaymentId = `TRPM${(highestPaymentId + 1).toString().padStart(4, '0')}`;
    
    console.log('Using reserved payment ID:', currentPaymentId);
    console.log('New next payment ID:', nextPaymentId);
    
    // Add new payment to the payments array with the reserved payment ID
    paymentRecord.payments.push({
      paymentId: currentPaymentId, // Use the reserved payment ID
      amount,
      datePaid: now,
      status: 'completed'
    });
    
    // Update the next payment ID for future payments
    paymentRecord.nextPaymentId = nextPaymentId;
    
    // Update totals and dates
    paymentRecord.totalAmountPaid += amount;
    paymentRecord.lastPaidAt = now;
    
    console.log('About to save payment record with nextPaymentId:', paymentRecord.nextPaymentId);
    console.log('Current payment in array:', paymentRecord.payments[paymentRecord.payments.length - 1]);
    
    await paymentRecord.save();
    console.log('Payment saved successfully');
    
    res.json({ 
      success: true, 
      message: 'Payment marked as paid successfully',
      payment: {
        nextPaymentId: paymentRecord.nextPaymentId, // Next payment ID for future payments
        trainerId: paymentRecord.trainerId,
        totalAmountPaid: paymentRecord.totalAmountPaid,
        currentPayment: paymentRecord.payments[paymentRecord.payments.length - 1], // Payment that was just processed
        allPayments: paymentRecord.payments, // All payment history
        status: paymentRecord.status,
        lastPaidAt: paymentRecord.lastPaidAt
      }
    });
  } catch (err) {
    console.error('Error marking payment as paid:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/subscription/trainer/:trainerId
export const getSubscribersByTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const subscriptions = await Subscription.aggregate([
      // Match subscriptions for the given trainer that are currently active
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
          $or: [{ endDate: { $exists: false } }, { endDate: null }],
        },
      },
      // Sort by start date to be sure we get the most recent one
      { $sort: { startDate: -1 } },
      // Group by user to get only one subscription per user
      {
        $group: {
          _id: '$userId',
          latestSubscription: { $first: '$$ROOT' },
        },
      },
      // Make the subscription document the root
      { $replaceRoot: { newRoot: '$latestSubscription' } },
      // Populate user details
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      // Unwind the userId array
      { $unwind: '$userId' },
    ]);

    if (!subscriptions) {
      return res.status(404).json({ success: false, error: 'No subscribers found for this trainer.' });
    }

    res.json({ success: true, data: subscriptions });
  } catch (err) {
    console.error('Error in getSubscribersByTrainer:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/subscription/user/:userId/trainer/:trainerId - Get specific user's subscription details for a trainer
export const getUserSubscriptionForTrainer = async (req, res) => {
  try {
    const { userId, trainerId } = req.params;

    // Get the most recent active subscription for this user with this trainer
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
    res.status(500).json({ success: false, error: "Failed to fetch user subscription details", details: err.message });
  }
};