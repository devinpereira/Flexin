import User from '../../models/User.js';
import Trainer from '../../models/Trainer.js';
import subscription from '../../models/Subscription.js';
import FitnessProfile from '../../models/FitnessProfile.js';

export const getStatistics = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const trainerCount = await Trainer.countDocuments();
        const subscriberCount = await subscription.countDocuments();

        res.status(200).json({ userCount, trainerCount, subscriberCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserRegistrationInfo = async (req, res) => {
    try {
        const userRegistrations = await User.aggregate([
            {
                $group: {
                    _id: { $year: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.status(200).json(userRegistrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGenderDistribution = async (req, res) => {
    try {
        const result = await FitnessProfile.aggregate([
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            }
        ]);

            // Transform aggregation result into expected object shape
        const distribution = result.reduce(
          (acc, item) => {
            const gender = item._id?.toLowerCase(); // Convert "Male" -> "male"
            if (gender === "male" || gender === "female") {
              acc[gender] = item.count;
              acc.total += item.count;
            }
            return acc;
          },
          { male: 0, female: 0, total: 0 }
        );

        res.status(200).json(distribution);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};