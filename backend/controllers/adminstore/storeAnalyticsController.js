import {
    StoreSalesAnalytics,
    StoreProductAnalytics,
    StoreCustomerAnalytics,
    StoreOrder,
    StoreProduct,
    StoreCategory
} from "../../models/adminstore/index.js";
import User from "../../models/User.js";

// Get Sales Analytics
export const getSalesAnalytics = async (req, res) => {
    try {
        const {
            period = 'monthly',
            startDate,
            endDate,
            compare = false
        } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        } else {
            // Default to last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
        }

        // Get current period analytics
        const currentAnalytics = await StoreOrder.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$pricing.totalPrice' },
                    averageOrderValue: { $avg: '$pricing.totalPrice' },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
                    },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
                    },
                    canceledOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'canceled'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get orders by date for chart data
        const ordersByDate = await StoreOrder.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: period === 'daily' ? '%Y-%m-%d' : '%Y-%m',
                            date: '$createdAt'
                        }
                    },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$pricing.totalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get top products
        const topProducts = await StoreOrder.aggregate([
            { $match: dateFilter },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    productName: '$product.productName',
                    sku: '$product.sku',
                    totalSold: 1,
                    totalRevenue: 1
                }
            }
        ]);

        const result = {
            summary: currentAnalytics[0] || {
                totalOrders: 0,
                totalRevenue: 0,
                averageOrderValue: 0,
                completedOrders: 0,
                pendingOrders: 0,
                canceledOrders: 0
            },
            chartData: ordersByDate,
            topProducts
        };

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Revenue Analytics
export const getRevenueAnalytics = async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const revenueData = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $in: ['delivered', 'shipped'] }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    dailyRevenue: { $sum: '$pricing.totalPrice' },
                    orderCount: { $sum: 1 },
                    averageOrderValue: { $avg: '$pricing.totalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Calculate revenue by payment method
        const revenueByPayment = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    revenue: { $sum: '$pricing.totalPrice' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                dailyRevenue: revenueData,
                paymentMethodBreakdown: revenueByPayment
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product Performance Analytics
export const getProductPerformance = async (req, res) => {
    try {
        const { period = '30', sortBy = 'revenue' } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const productPerformance = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: 'delivered'
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' },
                    orderCount: { $sum: 1 },
                    averagePrice: { $avg: '$items.price' }
                }
            },
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    productName: '$product.productName',
                    sku: '$product.sku',
                    category: '$product.categoryId',
                    totalSold: 1,
                    totalRevenue: 1,
                    orderCount: 1,
                    averagePrice: 1,
                    profitMargin: '$product.profitMargin'
                }
            },
            { $sort: { [sortBy]: -1 } },
            { $limit: 50 }
        ]);

        res.status(200).json({
            success: true,
            data: productPerformance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Customer Analytics
export const getCustomerAnalytics = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // New vs returning customers
        const customerTypes = await StoreOrder.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$userId',
                    orderCount: { $sum: 1 },
                    totalSpent: { $sum: '$pricing.totalPrice' },
                    firstOrder: { $min: '$createdAt' }
                }
            },
            {
                $group: {
                    _id: null,
                    newCustomers: {
                        $sum: { $cond: [{ $eq: ['$orderCount', 1] }, 1, 0] }
                    },
                    returningCustomers: {
                        $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] }
                    },
                    totalCustomers: { $sum: 1 },
                    averageOrdersPerCustomer: { $avg: '$orderCount' },
                    averageSpentPerCustomer: { $avg: '$totalSpent' }
                }
            }
        ]);

        // Top customers by revenue
        const topCustomers = await StoreOrder.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$userId',
                    totalSpent: { $sum: '$pricing.totalPrice' },
                    orderCount: { $sum: 1 },
                    averageOrderValue: { $avg: '$pricing.totalPrice' }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: '$customer' },
            {
                $project: {
                    customerName: '$customer.name',
                    customerEmail: '$customer.email',
                    totalSpent: 1,
                    orderCount: 1,
                    averageOrderValue: 1
                }
            }
        ]);

        const result = {
            summary: customerTypes[0] || {
                newCustomers: 0,
                returningCustomers: 0,
                totalCustomers: 0,
                averageOrdersPerCustomer: 0,
                averageSpentPerCustomer: 0
            },
            topCustomers
        };

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Inventory Reports
export const getInventoryReports = async (req, res) => {
    try {
        const inventoryStats = await StoreProduct.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
                    averagePrice: { $avg: '$price' },
                    lowStockProducts: {
                        $sum: {
                            $cond: [
                                { $lte: ['$quantity', '$lowStockThreshold'] },
                                1,
                                0
                            ]
                        }
                    },
                    outOfStockProducts: {
                        $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] }
                    }
                }
            }
        ]);

        // Products by category
        const productsByCategory = await StoreProduct.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    productCount: { $sum: 1 },
                    totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
                }
            },
            {
                $lookup: {
                    from: 'storecategories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $project: {
                    categoryName: '$category.name',
                    productCount: 1,
                    totalValue: 1
                }
            },
            { $sort: { productCount: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: inventoryStats[0] || {
                    totalProducts: 0,
                    totalValue: 0,
                    averagePrice: 0,
                    lowStockProducts: 0,
                    outOfStockProducts: 0
                },
                categoryBreakdown: productsByCategory
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Top Selling Products
export const getTopSellingProducts = async (req, res) => {
    try {
        const { period = '30', limit = 10 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const topProducts = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: 'delivered'
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    productName: '$product.productName',
                    sku: '$product.sku',
                    images: '$product.images',
                    currentPrice: '$product.price',
                    totalSold: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: topProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Sales by Category
export const getSalesByCategory = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const salesByCategory = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: 'delivered'
                }
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.categoryId',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'storecategories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $project: {
                    categoryName: '$category.name',
                    totalSold: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: salesByCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export Analytics Data
export const exportAnalytics = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        let exportData = [];

        switch (type) {
            case 'sales':
                exportData = await StoreOrder.find(dateFilter)
                    .populate('userId', 'name email')
                    .select('orderNumber customerInfo pricing orderStatus createdAt')
                    .sort({ createdAt: -1 });
                break;

            case 'products':
                exportData = await StoreProduct.find()
                    .populate('categoryId', 'name')
                    .select('productName sku price quantity salesCount averageRating')
                    .sort({ salesCount: -1 });
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid export type'
                });
        }

        res.status(200).json({
            success: true,
            data: exportData,
            message: `${type} data exported successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product Analytics
export const getProductAnalytics = getProductPerformance;

// Get Inventory Analytics  
export const getInventoryAnalytics = getInventoryReports;

// Get Order Analytics
export const getOrderAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, period = 'day' } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const groupBy = period === 'month' ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } } :
            period === 'week' ? { $week: "$createdAt" } :
                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };

        const analytics = await StoreOrder.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: groupBy,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Category Analytics
export const getCategoryAnalytics = getSalesByCategory;

// Get Coupon Analytics
export const getCouponAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const analytics = await StoreCoupon.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalCoupons: { $sum: 1 },
                    activeCoupons: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    totalUsage: { $sum: '$usedCount' },
                    totalDiscount: { $sum: '$totalDiscountGiven' }
                }
            }
        ]);

        const topCoupons = await StoreCoupon.find(matchStage)
            .sort({ usedCount: -1 })
            .limit(10)
            .select('code discountType discountValue usedCount totalDiscountGiven');

        res.status(200).json({
            success: true,
            data: {
                overview: analytics[0] || {
                    totalCoupons: 0,
                    activeCoupons: 0,
                    totalUsage: 0,
                    totalDiscount: 0
                },
                topCoupons
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Review Analytics
export const getReviewAnalytics = async (req, res) => {
    try {
        const analytics = await StoreProductReview.aggregate([
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    pendingReviews: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    approvedReviews: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    }
                }
            }
        ]);

        const ratingDistribution = await StoreProductReview.aggregate([
            { $match: { status: 'approved' } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: analytics[0] || {
                    totalReviews: 0,
                    averageRating: 0,
                    pendingReviews: 0,
                    approvedReviews: 0
                },
                ratingDistribution
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Today's stats
        const todayOrders = await StoreOrder.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        const todayRevenue = await StoreOrder.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Monthly stats
        const monthlyOrders = await StoreOrder.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        const monthlyRevenue = await StoreOrder.aggregate([
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Product stats
        const totalProducts = await StoreProduct.countDocuments();
        const lowStockProducts = await StoreInventory.countDocuments({
            currentStock: { $lte: '$lowStockThreshold' }
        });

        // Customer stats
        const totalCustomers = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                today: {
                    orders: todayOrders,
                    revenue: todayRevenue[0]?.total || 0
                },
                month: {
                    orders: monthlyOrders,
                    revenue: monthlyRevenue[0]?.total || 0
                },
                products: {
                    total: totalProducts,
                    lowStock: lowStockProducts
                },
                customers: {
                    total: totalCustomers
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Top Performing Categories
export const getTopPerformingCategories = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const categories = await StoreOrder.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $lookup: {
                    from: 'storecategories',
                    localField: 'product.categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: '$category._id',
                    categoryName: { $first: '$category.name' },
                    totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    totalOrders: { $sum: 1 },
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Customer Segments
export const getCustomerSegments = async (req, res) => {
    try {
        const segments = await StoreOrder.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalSpent: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                    lastOrderDate: { $max: '$createdAt' }
                }
            },
            {
                $addFields: {
                    segment: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$totalSpent', 1000] }, then: 'VIP' },
                                { case: { $gte: ['$totalSpent', 500] }, then: 'Premium' },
                                { case: { $gte: ['$totalSpent', 100] }, then: 'Regular' }
                            ],
                            default: 'New'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$segment',
                    customerCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalSpent' },
                    averageOrderValue: { $avg: { $divide: ['$totalSpent', '$orderCount'] } }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: segments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Sales by Region
export const getSalesByRegion = async (req, res) => {
    try {
        const sales = await StoreOrder.aggregate([
            {
                $group: {
                    _id: '$shippingAddress.state',
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: sales
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Sales by Channel
export const getSalesByChannel = async (req, res) => {
    try {
        const sales = await StoreOrder.aggregate([
            {
                $group: {
                    _id: '$channel',
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: sales
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Revenue by Period
export const getRevenueByPeriod = getRevenueAnalytics;

// Get Order Trends
export const getOrderTrends = getOrderAnalytics;

// Get Inventory Turnover
export const getInventoryTurnover = async (req, res) => {
    try {
        const turnover = await StoreInventory.aggregate([
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $addFields: {
                    turnoverRate: {
                        $cond: {
                            if: { $gt: ['$currentStock', 0] },
                            then: { $divide: ['$soldQuantity', '$currentStock'] },
                            else: 0
                        }
                    }
                }
            },
            {
                $project: {
                    productId: 1,
                    productName: '$product.productName',
                    sku: '$product.sku',
                    currentStock: 1,
                    soldQuantity: 1,
                    turnoverRate: 1
                }
            },
            { $sort: { turnoverRate: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: turnover
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Customer Lifetime Value
export const getCustomerLifetimeValue = async (req, res) => {
    try {
        const clv = await StoreOrder.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalValue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                    firstOrder: { $min: '$createdAt' },
                    lastOrder: { $max: '$createdAt' }
                }
            },
            {
                $addFields: {
                    customerLifetimeDays: {
                        $divide: [
                            { $subtract: ['$lastOrder', '$firstOrder'] },
                            1000 * 60 * 60 * 24
                        ]
                    },
                    averageOrderValue: { $divide: ['$totalValue', '$orderCount'] }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: '$customer' },
            {
                $project: {
                    customerName: '$customer.name',
                    customerEmail: '$customer.email',
                    totalValue: 1,
                    orderCount: 1,
                    averageOrderValue: 1,
                    customerLifetimeDays: 1
                }
            },
            { $sort: { totalValue: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: clv
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export Analytics Report
export const exportAnalyticsReport = exportAnalytics;

// Generate Custom Report
export const generateCustomReport = async (req, res) => {
    try {
        const { reportType, startDate, endDate, filters } = req.body;

        let pipeline = [];
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        switch (reportType) {
            case 'sales':
                pipeline.push({
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        totalSales: { $sum: '$totalAmount' },
                        orderCount: { $sum: 1 }
                    }
                });
                break;
            case 'products':
                pipeline = [
                    { $unwind: '$items' },
                    {
                        $group: {
                            _id: '$items.productId',
                            totalQuantity: { $sum: '$items.quantity' },
                            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                        }
                    }
                ];
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid report type'
                });
        }

        const data = await StoreOrder.aggregate(pipeline);

        res.status(200).json({
            success: true,
            data: {
                reportType,
                generatedAt: new Date(),
                filters: { startDate, endDate, ...filters },
                results: data
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Comparison Report
export const getComparisonReport = async (req, res) => {
    try {
        const {
            period1Start,
            period1End,
            period2Start,
            period2End
        } = req.query;

        const period1Stats = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(period1Start),
                        $lte: new Date(period1End)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        const period2Stats = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(period2Start),
                        $lte: new Date(period2End)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        const period1 = period1Stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
        const period2 = period2Stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };

        const comparison = {
            orders: {
                period1: period1.totalOrders,
                period2: period2.totalOrders,
                change: period2.totalOrders - period1.totalOrders,
                percentChange: period1.totalOrders > 0 ?
                    ((period2.totalOrders - period1.totalOrders) / period1.totalOrders) * 100 : 0
            },
            revenue: {
                period1: period1.totalRevenue,
                period2: period2.totalRevenue,
                change: period2.totalRevenue - period1.totalRevenue,
                percentChange: period1.totalRevenue > 0 ?
                    ((period2.totalRevenue - period1.totalRevenue) / period1.totalRevenue) * 100 : 0
            },
            averageOrderValue: {
                period1: period1.averageOrderValue,
                period2: period2.averageOrderValue,
                change: period2.averageOrderValue - period1.averageOrderValue,
                percentChange: period1.averageOrderValue > 0 ?
                    ((period2.averageOrderValue - period1.averageOrderValue) / period1.averageOrderValue) * 100 : 0
            }
        };

        res.status(200).json({
            success: true,
            data: comparison
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Profitability Analysis
export const getProfitabilityAnalysis = async (req, res) => {
    try {
        const analysis = await StoreOrder.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $addFields: {
                    profit: {
                        $subtract: [
                            { $multiply: ['$items.quantity', '$items.price'] },
                            { $multiply: ['$items.quantity', '$product.costPrice'] }
                        ]
                    },
                    revenue: { $multiply: ['$items.quantity', '$items.price'] }
                }
            },
            {
                $group: {
                    _id: '$items.productId',
                    productName: { $first: '$product.productName' },
                    totalRevenue: { $sum: '$revenue' },
                    totalProfit: { $sum: '$profit' },
                    unitsSold: { $sum: '$items.quantity' }
                }
            },
            {
                $addFields: {
                    profitMargin: {
                        $cond: {
                            if: { $gt: ['$totalRevenue', 0] },
                            then: { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { totalProfit: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Seasonal Trends
export const getSeasonalTrends = async (req, res) => {
    try {
        const trends = await StoreOrder.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            },
            {
                $addFields: {
                    month: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$_id', 1] }, then: 'January' },
                                { case: { $eq: ['$_id', 2] }, then: 'February' },
                                { case: { $eq: ['$_id', 3] }, then: 'March' },
                                { case: { $eq: ['$_id', 4] }, then: 'April' },
                                { case: { $eq: ['$_id', 5] }, then: 'May' },
                                { case: { $eq: ['$_id', 6] }, then: 'June' },
                                { case: { $eq: ['$_id', 7] }, then: 'July' },
                                { case: { $eq: ['$_id', 8] }, then: 'August' },
                                { case: { $eq: ['$_id', 9] }, then: 'September' },
                                { case: { $eq: ['$_id', 10] }, then: 'October' },
                                { case: { $eq: ['$_id', 11] }, then: 'November' },
                                { case: { $eq: ['$_id', 12] }, then: 'December' }
                            ],
                            default: 'Unknown'
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: trends
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Forecast Data
export const getForecastData = async (req, res) => {
    try {
        const { months = 6 } = req.query;

        // Get historical data for the past year
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const historicalData = await StoreOrder.aggregate([
            { $match: { createdAt: { $gte: oneYearAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalRevenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Simple trend calculation (you might want to use more sophisticated forecasting)
        const revenueValues = historicalData.map(item => item.totalRevenue);
        const averageRevenue = revenueValues.reduce((sum, val) => sum + val, 0) / revenueValues.length;

        // Generate forecast data (simplified linear projection)
        const forecast = [];
        for (let i = 1; i <= parseInt(months); i++) {
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + i);

            forecast.push({
                period: futureDate.toISOString().slice(0, 7), // YYYY-MM format
                predictedRevenue: averageRevenue * (1 + (Math.random() * 0.2 - 0.1)), // ±10% variance
                confidence: 0.8 - (i * 0.1) // Decreasing confidence over time
            });
        }

        res.status(200).json({
            success: true,
            data: {
                historical: historicalData,
                forecast: forecast
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Abandoned Cart Analytics
export const getAbandonedCartAnalytics = async (req, res) => {
    try {
        // This would require a separate cart tracking system
        // For now, return placeholder data
        res.status(200).json({
            success: true,
            data: {
                totalAbandonedCarts: 0,
                abandonmentRate: 0,
                recoveredRevenue: 0,
                topAbandonedProducts: []
            },
            message: 'Abandoned cart tracking not implemented yet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Conversion Funnel Analytics
export const getConversionFunnelAnalytics = async (req, res) => {
    try {
        // This would require detailed user behavior tracking
        // For now, return placeholder data based on orders
        const totalOrders = await StoreOrder.countDocuments();
        const completedOrders = await StoreOrder.countDocuments({ orderStatus: 'delivered' });

        res.status(200).json({
            success: true,
            data: {
                steps: [
                    { name: 'Product Views', count: totalOrders * 10, conversionRate: 100 },
                    { name: 'Add to Cart', count: totalOrders * 3, conversionRate: 30 },
                    { name: 'Checkout Initiated', count: totalOrders * 2, conversionRate: 20 },
                    { name: 'Order Placed', count: totalOrders, conversionRate: 10 },
                    { name: 'Order Completed', count: completedOrders, conversionRate: (completedOrders / totalOrders) * 10 }
                ]
            },
            message: 'Conversion funnel based on simplified data'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Cohort Analysis
export const getCohortAnalysis = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Get customer cohorts based on first order date
        const cohorts = await StoreOrder.aggregate([
            {
                $group: {
                    _id: '$userId',
                    firstOrderDate: { $min: '$createdAt' },
                    orders: { $push: { date: '$createdAt', amount: '$totalAmount' } }
                }
            },
            {
                $addFields: {
                    cohortMonth: {
                        $dateToString: { format: "%Y-%m", date: "$firstOrderDate" }
                    }
                }
            },
            {
                $group: {
                    _id: '$cohortMonth',
                    customers: { $sum: 1 },
                    customerIds: { $push: '$_id' },
                    totalRevenue: {
                        $sum: {
                            $reduce: {
                                input: '$orders',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.amount'] }
                            }
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: cohorts,
            message: 'Cohort analysis based on first order date'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get RFM Analysis (Recency, Frequency, Monetary)
export const getRFMAnalysis = async (req, res) => {
    try {
        const now = new Date();

        const rfmAnalysis = await StoreOrder.aggregate([
            {
                $group: {
                    _id: '$userId',
                    lastOrderDate: { $max: '$createdAt' },
                    orderCount: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' }
                }
            },
            {
                $addFields: {
                    recency: {
                        $divide: [
                            { $subtract: [now, '$lastOrderDate'] },
                            1000 * 60 * 60 * 24 // Convert to days
                        ]
                    }
                }
            },
            {
                $addFields: {
                    recencyScore: {
                        $switch: {
                            branches: [
                                { case: { $lte: ['$recency', 30] }, then: 5 },
                                { case: { $lte: ['$recency', 60] }, then: 4 },
                                { case: { $lte: ['$recency', 90] }, then: 3 },
                                { case: { $lte: ['$recency', 180] }, then: 2 }
                            ],
                            default: 1
                        }
                    },
                    frequencyScore: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$orderCount', 10] }, then: 5 },
                                { case: { $gte: ['$orderCount', 5] }, then: 4 },
                                { case: { $gte: ['$orderCount', 3] }, then: 3 },
                                { case: { $gte: ['$orderCount', 2] }, then: 2 }
                            ],
                            default: 1
                        }
                    },
                    monetaryScore: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$totalSpent', 1000] }, then: 5 },
                                { case: { $gte: ['$totalSpent', 500] }, then: 4 },
                                { case: { $gte: ['$totalSpent', 250] }, then: 3 },
                                { case: { $gte: ['$totalSpent', 100] }, then: 2 }
                            ],
                            default: 1
                        }
                    }
                }
            },
            {
                $addFields: {
                    rfmSegment: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $and: [
                                            { $gte: ['$recencyScore', 4] },
                                            { $gte: ['$frequencyScore', 4] },
                                            { $gte: ['$monetaryScore', 4] }
                                        ]
                                    },
                                    then: 'Champions'
                                },
                                {
                                    case: {
                                        $and: [
                                            { $gte: ['$recencyScore', 3] },
                                            { $gte: ['$frequencyScore', 3] },
                                            { $gte: ['$monetaryScore', 3] }
                                        ]
                                    },
                                    then: 'Loyal Customers'
                                },
                                {
                                    case: {
                                        $and: [
                                            { $gte: ['$recencyScore', 4] },
                                            { $lte: ['$frequencyScore', 2] }
                                        ]
                                    },
                                    then: 'New Customers'
                                },
                                {
                                    case: {
                                        $and: [
                                            { $lte: ['$recencyScore', 2] },
                                            { $gte: ['$frequencyScore', 3] }
                                        ]
                                    },
                                    then: 'At Risk'
                                }
                            ],
                            default: 'Others'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$rfmSegment',
                    customerCount: { $sum: 1 },
                    totalValue: { $sum: '$totalSpent' },
                    averageRecency: { $avg: '$recency' },
                    averageFrequency: { $avg: '$orderCount' },
                    averageMonetary: { $avg: '$totalSpent' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: rfmAnalysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get A/B Test Results
export const getABTestResults = async (req, res) => {
    try {
        // A/B testing would require specific test configurations and tracking
        // For now, return placeholder data
        res.status(200).json({
            success: true,
            data: {
                activeTests: [],
                completedTests: [],
                conversionRates: {}
            },
            message: 'A/B testing system not implemented yet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
