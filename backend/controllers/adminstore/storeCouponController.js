import {
    StoreCoupon,
    StoreCouponUsage,
    StoreProduct,
    StoreCategory
} from "../../models/adminstore/index.js";

// Get All Coupons
export const getAllCoupons = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            type,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (search) {
            filter.$or = [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const coupons = await StoreCoupon.find(filter)
            .populate('conditions.applicableProducts', 'productName sku')
            .populate('conditions.applicableCategories', 'name')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreCoupon.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: coupons,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Coupon
export const getCoupon = async (req, res) => {
    try {
        const coupon = await StoreCoupon.findById(req.params.id)
            .populate('conditions.applicableProducts', 'productName sku price')
            .populate('conditions.applicableCategories', 'name')
            .populate('conditions.excludedProducts', 'productName sku')
            .populate('conditions.excludedCategories', 'name');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Coupon
export const createCoupon = async (req, res) => {
    try {
        const couponData = req.body;

        // Validate required fields
        if (!couponData.code || !couponData.name || !couponData.type) {
            return res.status(400).json({
                success: false,
                message: 'Code, name, and type are required'
            });
        }

        // Check if coupon code already exists
        const existingCoupon = await StoreCoupon.findOne({ code: couponData.code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        const coupon = new StoreCoupon(couponData);
        await coupon.save();

        res.status(201).json({
            success: true,
            data: coupon,
            message: 'Coupon created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Coupon
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If updating code, check for duplicates
        if (updateData.code) {
            const existingCoupon = await StoreCoupon.findOne({
                code: updateData.code.toUpperCase(),
                _id: { $ne: id }
            });
            if (existingCoupon) {
                return res.status(400).json({
                    success: false,
                    message: 'Coupon code already exists'
                });
            }
        }

        const coupon = await StoreCoupon.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: 'Coupon updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if coupon has been used
        const usageCount = await StoreCouponUsage.countDocuments({ couponId: id });
        if (usageCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete coupon. It has been used ${usageCount} times.`
            });
        }

        const coupon = await StoreCoupon.findByIdAndDelete(id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Activate Coupon
export const activateCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await StoreCoupon.findByIdAndUpdate(
            id,
            { status: 'active' },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: 'Coupon activated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Deactivate Coupon
export const deactivateCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await StoreCoupon.findByIdAndUpdate(
            id,
            { status: 'disabled' },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: 'Coupon deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Coupon Usage
export const getCouponUsage = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        const usage = await StoreCouponUsage.find({ couponId: id })
            .populate('userId', 'name email')
            .populate('orderId', 'orderNumber')
            .sort({ usedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreCouponUsage.countDocuments({ couponId: id });

        // Get usage statistics
        const stats = await StoreCouponUsage.aggregate([
            { $match: { couponId: id } },
            {
                $group: {
                    _id: null,
                    totalUsage: { $sum: 1 },
                    totalDiscount: { $sum: '$usage.discountAmount' },
                    averageDiscount: { $avg: '$usage.discountAmount' },
                    totalOrderValue: { $sum: '$usage.orderTotal' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                usage,
                statistics: stats[0] || {
                    totalUsage: 0,
                    totalDiscount: 0,
                    averageDiscount: 0,
                    totalOrderValue: 0
                }
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Validate Coupon (for frontend use)
export const validateCoupon = async (req, res) => {
    try {
        const { code, userId, cartTotal, productIds } = req.body;

        if (!code || !cartTotal) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code and cart total are required'
            });
        }

        const coupon = await StoreCoupon.findOne({
            code: code.toUpperCase(),
            status: 'active'
        });

        if (!coupon) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or inactive coupon code'
            });
        }

        // Check validity dates
        const now = new Date();
        if (now < coupon.validity.startDate || now > coupon.validity.endDate) {
            return res.status(400).json({
                success: false,
                message: 'Coupon has expired or not yet active'
            });
        }

        // Check usage limits
        if (coupon.usage.totalLimit && coupon.usage.totalUsed >= coupon.usage.totalLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon usage limit exceeded'
            });
        }

        // Check per customer limit
        if (userId && coupon.usage.perCustomerLimit) {
            const customerUsage = await StoreCouponUsage.countDocuments({
                couponId: coupon._id,
                userId
            });
            if (customerUsage >= coupon.usage.perCustomerLimit) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already used this coupon the maximum number of times'
                });
            }
        }

        // Check minimum amount
        if (cartTotal < coupon.conditions.minimumAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is $${coupon.conditions.minimumAmount}`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        switch (coupon.type) {
            case 'percentage':
                discountAmount = (cartTotal * coupon.discount.value) / 100;
                if (coupon.discount.maxAmount) {
                    discountAmount = Math.min(discountAmount, coupon.discount.maxAmount);
                }
                break;
            case 'fixed_amount':
                discountAmount = coupon.discount.value;
                break;
            case 'free_shipping':
                discountAmount = 0; // Handled separately
                break;
        }

        discountAmount = Math.min(discountAmount, cartTotal);

        res.status(200).json({
            success: true,
            data: {
                coupon: {
                    id: coupon._id,
                    code: coupon.code,
                    name: coupon.name,
                    type: coupon.type
                },
                discountAmount,
                finalTotal: cartTotal - discountAmount
            },
            message: 'Coupon is valid'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Coupon by ID (alias for getCoupon)
export const getCouponById = getCoupon;

// Bulk Update Coupons
export const bulkUpdateCoupons = async (req, res) => {
    try {
        const { couponIds, updateData } = req.body;

        if (!couponIds || !Array.isArray(couponIds)) {
            return res.status(400).json({
                success: false,
                message: 'Coupon IDs array is required'
            });
        }

        const result = await StoreCoupon.updateMany(
            { _id: { $in: couponIds } },
            updateData
        );

        res.status(200).json({
            success: true,
            data: { modifiedCount: result.modifiedCount },
            message: `${result.modifiedCount} coupons updated successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Delete Coupons
export const bulkDeleteCoupons = async (req, res) => {
    try {
        const { couponIds } = req.body;

        if (!couponIds || !Array.isArray(couponIds)) {
            return res.status(400).json({
                success: false,
                message: 'Coupon IDs array is required'
            });
        }

        const result = await StoreCoupon.deleteMany({
            _id: { $in: couponIds }
        });

        res.status(200).json({
            success: true,
            data: { deletedCount: result.deletedCount },
            message: `${result.deletedCount} coupons deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Coupon Analytics
export const getCouponAnalytics = async (req, res) => {
    try {
        const totalCoupons = await StoreCoupon.countDocuments();
        const activeCoupons = await StoreCoupon.countDocuments({ status: 'active' });
        const expiredCoupons = await StoreCoupon.countDocuments({ expiresAt: { $lt: new Date() } });

        const usageStats = await StoreCouponUsage.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsage: { $sum: 1 },
                    totalSavings: { $sum: '$discountAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalCoupons,
                    activeCoupons,
                    expiredCoupons
                },
                usage: usageStats[0] || { totalUsage: 0, totalSavings: 0 }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export Coupons
export const exportCoupons = async (req, res) => {
    try {
        const coupons = await StoreCoupon.find({}).lean();

        res.status(200).json({
            success: true,
            data: coupons,
            message: 'Coupons exported successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search Coupons
export const searchCoupons = async (req, res) => {
    try {
        const { q, status, type } = req.query;

        const filter = {};

        if (q) {
            filter.$or = [
                { code: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        if (status) filter.status = status;
        if (type) filter.type = type;

        const coupons = await StoreCoupon.find(filter);

        res.status(200).json({
            success: true,
            data: coupons,
            count: coupons.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Apply Coupon
export const applyCoupon = async (req, res) => {
    try {
        const { code, orderTotal, customerId } = req.body;

        const coupon = await StoreCoupon.findOne({ code, status: 'active' });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or inactive coupon'
            });
        }

        // Validate coupon (reuse validateCoupon logic)
        const validation = await validateCoupon(req, res);
        if (!validation.success) {
            return validation;
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.type === 'percentage') {
            discountAmount = (orderTotal * coupon.value) / 100;
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
        } else if (coupon.type === 'fixed') {
            discountAmount = Math.min(coupon.value, orderTotal);
        }

        res.status(200).json({
            success: true,
            data: {
                coupon,
                discountAmount,
                finalTotal: orderTotal - discountAmount
            },
            message: 'Coupon applied successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Coupons by Type
export const getCouponsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const coupons = await StoreCoupon.find({ type });

        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Coupons by Status
export const getCouponsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const coupons = await StoreCoupon.find({ status });

        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Coupons Expiring Soon
export const getCouponsExpiringeSoon = async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const expiringDate = new Date();
        expiringDate.setDate(expiringDate.getDate() + parseInt(days));

        const coupons = await StoreCoupon.find({
            expiresAt: {
                $gte: new Date(),
                $lte: expiringDate
            },
            status: 'active'
        });

        res.status(200).json({
            success: true,
            data: coupons,
            count: coupons.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Duplicate Coupon
export const duplicateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { newCode } = req.body;

        const originalCoupon = await StoreCoupon.findById(id).lean();
        if (!originalCoupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        const duplicatedCoupon = {
            ...originalCoupon,
            _id: undefined,
            code: newCode || `${originalCoupon.code}_COPY`,
            status: 'inactive',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newCoupon = new StoreCoupon(duplicatedCoupon);
        await newCoupon.save();

        res.status(201).json({
            success: true,
            data: newCoupon,
            message: 'Coupon duplicated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Generate Coupon Code
export const generateCouponCode = async (req, res) => {
    try {
        const { prefix = '', length = 8 } = req.body;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = prefix;

        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Check if code already exists
        const existingCoupon = await StoreCoupon.findOne({ code });
        if (existingCoupon) {
            // Generate a new one recursively
            return generateCouponCode(req, res);
        }

        res.status(200).json({
            success: true,
            data: { code },
            message: 'Coupon code generated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Schedule Coupon
export const scheduleCopon = async (req, res) => {
    try {
        const { id } = req.params;
        const { activateAt, deactivateAt } = req.body;

        const coupon = await StoreCoupon.findByIdAndUpdate(
            id,
            {
                scheduledActivation: {
                    activateAt: activateAt ? new Date(activateAt) : undefined,
                    deactivateAt: deactivateAt ? new Date(deactivateAt) : undefined
                }
            },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: 'Coupon scheduled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Coupon Statistics
export const getCouponStatistics = async (req, res) => {
    try {
        const stats = await StoreCouponUsage.aggregate([
            {
                $group: {
                    _id: '$couponId',
                    usageCount: { $sum: 1 },
                    totalSavings: { $sum: '$discountAmount' }
                }
            },
            {
                $lookup: {
                    from: 'storecoupons',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'coupon'
                }
            },
            { $unwind: '$coupon' },
            {
                $project: {
                    code: '$coupon.code',
                    usageCount: 1,
                    totalSavings: 1
                }
            },
            { $sort: { usageCount: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Active Coupons
export const getActiveCoupons = async (req, res) => {
    try {
        const coupons = await StoreCoupon.find({
            status: 'active',
            expiresAt: { $gt: new Date() }
        });

        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Expired Coupons
export const getExpiredCoupons = async (req, res) => {
    try {
        const coupons = await StoreCoupon.find({
            $or: [
                { expiresAt: { $lt: new Date() } },
                { status: 'expired' }
            ]
        });

        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Extend Coupon Validity
export const extendCouponValidity = async (req, res) => {
    try {
        const { id } = req.params;
        const { newExpiryDate } = req.body;

        const coupon = await StoreCoupon.findByIdAndUpdate(
            id,
            { expiresAt: new Date(newExpiryDate) },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: 'Coupon validity extended successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Limit Coupon Usage
export const limitCouponUsage = async (req, res) => {
    try {
        const { id } = req.params;
        const { usageLimit, perCustomerLimit } = req.body;

        const coupon = await StoreCoupon.findByIdAndUpdate(
            id,
            {
                usageLimit,
                perCustomerLimit
            },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: 'Coupon usage limits updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Track Coupon Performance
export const trackCouponPerformance = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await StoreCoupon.findById(id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        const usage = await StoreCouponUsage.find({ couponId: id });
        const totalUsage = usage.length;
        const totalSavings = usage.reduce((sum, u) => sum + u.discountAmount, 0);

        const performance = {
            coupon: coupon.code,
            totalUsage,
            totalSavings,
            usageRate: coupon.usageLimit ? (totalUsage / coupon.usageLimit) * 100 : 0,
            averageDiscount: totalUsage > 0 ? totalSavings / totalUsage : 0
        };

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
