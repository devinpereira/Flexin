import Trainer from '../models/Trainer.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Payment from '../models/Payment.js';

// GET /api/v1/reports/overview
export const getReportsOverview = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(2020, 0, 1); // All time
    }

    // Get basic counts
    const totalTrainers = await Trainer.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments({
      startDate: { $gte: startDate },
      $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: startDate } }]
    });

    // Calculate total revenue from payments
    const paymentStats = await Payment.aggregate([
      {
        $unwind: '$payments'
      },
      {
        $match: {
          'payments.datePaid': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payments.amount' },
          totalPayments: { $sum: 1 }
        }
      }
    ]);

    const revenue = paymentStats[0]?.totalRevenue || 0;
    const paymentCount = paymentStats[0]?.totalPayments || 0;

    // Calculate average rating from trainer model
    const ratingStats = await Trainer.aggregate([
      {
        $match: { status: 'active', rating: { $gt: 0 } }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalRated: { $sum: 1 }
        }
      }
    ]);

    const avgRating = ratingStats[0]?.avgRating || 0;

    // Calculate previous period for comparison
    const prevPeriodEnd = new Date(startDate.getTime() - 1);
    let prevStartDate;
    const periodLength = now.getTime() - startDate.getTime();
    prevStartDate = new Date(prevPeriodEnd.getTime() - periodLength);

    // Get previous period stats for comparison
    const prevPaymentStats = await Payment.aggregate([
      {
        $unwind: '$payments'
      },
      {
        $match: {
          'payments.datePaid': { $gte: prevStartDate, $lte: prevPeriodEnd }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payments.amount' }
        }
      }
    ]);

    const prevRevenue = prevPaymentStats[0]?.totalRevenue || 0;
    const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue * 100) : 0;

    const prevTrainerCount = await Trainer.countDocuments({
      status: 'active',
      createdAt: { $lt: startDate }
    });
    const trainerChange = prevTrainerCount > 0 ? totalTrainers - prevTrainerCount : totalTrainers;

    res.json({
      success: true,
      data: {
        indicators: {
          totalTrainers,
          revenue,
          subscriptions: totalSubscriptions,
          avgRating: Math.round(avgRating * 10) / 10,
          changes: {
            trainers: trainerChange,
            revenue: Math.round(revenueChange * 10) / 10,
            subscriptions: 0, // Could calculate if needed
            rating: 0 // Could calculate if needed
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in getReportsOverview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/reports/revenue-trend
export const getRevenueTrend = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let months = 12;
    let groupBy;

    if (period === 'week') {
      months = 3; // Last 12 weeks would be too much, show last 3 months
      groupBy = { year: { $year: '$payments.datePaid' }, month: { $month: '$payments.datePaid' } };
    } else {
      groupBy = { year: { $year: '$payments.datePaid' }, month: { $month: '$payments.datePaid' } };
    }

    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const revenueData = await Payment.aggregate([
      { $unwind: '$payments' },
      {
        $match: {
          'payments.datePaid': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$payments.amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Create labels and data arrays
    const labels = [];
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      labels.push(monthName);
      
      const monthData = revenueData.find(item => 
        item._id.year === date.getFullYear() && item._id.month === date.getMonth() + 1
      );
      
      data.push(monthData ? monthData.revenue : 0);
    }

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{
          label: 'Revenue',
          data,
          borderColor: '#f67a45',
          backgroundColor: 'rgba(246, 122, 69, 0.2)',
          tension: 0.4,
          fill: true
        }]
      }
    });
  } catch (error) {
    console.error('Error in getRevenueTrend:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/reports/subscription-distribution
export const getSubscriptionDistribution = async (req, res) => {
  try {
    const subscriptionStats = await Subscription.aggregate([
      {
        $match: {
          $or: [{ endDate: { $exists: false } }, { endDate: null }]
        }
      },
      {
        $group: {
          _id: '$package',
          count: { $sum: 1 }
        }
      }
    ]);

    const labels = [];
    const data = [];
    const colors = ['#f67a45', '#3b82f6', '#8b5cf6'];

    subscriptionStats.forEach((stat, index) => {
      labels.push(stat._id.charAt(0).toUpperCase() + stat._id.slice(1) + ' Package');
      data.push(stat.count);
    });

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, data.length),
          borderWidth: 0
        }]
      }
    });
  } catch (error) {
    console.error('Error in getSubscriptionDistribution:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/reports/specialties-distribution
export const getSpecialtiesDistribution = async (req, res) => {
  try {
    const specialtyStats = await Trainer.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$specialties' },
      {
        $group: {
          _id: '$specialties',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const labels = specialtyStats.map(stat => stat._id);
    const data = specialtyStats.map(stat => stat.count);
    const colors = ['#f67a45', '#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#a855f7'];

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, data.length),
          borderWidth: 0
        }]
      }
    });
  } catch (error) {
    console.error('Error in getSpecialtiesDistribution:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/reports/top-trainers
export const getTopTrainers = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(2020, 0, 1);
    }

    // Get top trainers by revenue
    const topTrainers = await Payment.aggregate([
      {
        $unwind: '$payments'
      },
      {
        $match: {
          'payments.datePaid': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$trainerId',
          revenue: { $sum: '$payments.amount' },
          paymentCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'trainers',
          localField: '_id',
          foreignField: '_id',
          as: 'trainer'
        }
      },
      { $unwind: '$trainer' },
      {
        $lookup: {
          from: 'subscriptions',
          let: { trainerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$trainerId', '$$trainerId'] },
                $or: [{ endDate: { $exists: false } }, { endDate: null }]
              }
            }
          ],
          as: 'subscriptions'
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'trainerId',
          as: 'reviews'
        }
      },
      {
        $project: {
          name: '$trainer.name',
          revenue: 1,
          clients: { $size: '$subscriptions' },
          rating: '$trainer.rating' // Use rating from trainer model
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: topTrainers
    });
  } catch (error) {
    console.error('Error in getTopTrainers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/reports/client-distribution
export const getClientDistribution = async (req, res) => {
  try {
    // Get subscription stats to determine new vs returning clients
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Count new subscriptions (first-time subscribers)
    const newSubscriptions = await Subscription.aggregate([
      {
        $group: {
          _id: '$userId',
          firstSubscription: { $min: '$startDate' },
          totalSubscriptions: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          newClients: {
            $sum: {
              $cond: [
                { $gte: ['$firstSubscription', oneMonthAgo] },
                1,
                0
              ]
            }
          },
          returningClients: {
            $sum: {
              $cond: [
                { $and: [
                  { $lt: ['$firstSubscription', oneMonthAgo] },
                  { $gt: ['$totalSubscriptions', 1] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const stats = newSubscriptions[0] || { newClients: 0, returningClients: 0 };

    res.json({
      success: true,
      data: {
        labels: ['New Clients', 'Returning Clients'],
        datasets: [{
          data: [stats.newClients, stats.returningClients],
          backgroundColor: ['#3b82f6', '#f67a45'],
          borderWidth: 0
        }]
      }
    });
  } catch (error) {
    console.error('Error in getClientDistribution:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/reports/trainers-list
export const getTrainersList = async (req, res) => {
  try {
    const trainers = await Trainer.find({ status: 'active' }, 'name _id').sort({ name: 1 });
    
    res.json({
      success: true,
      data: trainers.map(trainer => ({
        id: trainer._id,
        name: trainer.name
      }))
    });
  } catch (error) {
    console.error('Error in getTrainersList:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
