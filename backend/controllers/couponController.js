import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import Category from "../models/Catergory.js";

// Get All Coupons (Admin)
export const getAllCoupons = async (req, res) => {
    try {
        const { isActive, page = 1, limit = 20 } = req.query;

        let filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const coupons = await Coupon.find(filter)
            .populate('applicableProducts', 'productName')
            .populate('applicableCategories', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalCoupons = await Coupon.countDocuments(filter);
        const totalPages = Math.ceil(totalCoupons / parseInt(limit));

        res.status(200).json({
            success: true,
            coupons,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCoupons,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching coupons",
            error: error.message
        });
    }
};

// Get Active Coupons (User)
export const getActiveCoupons = async (req, res) => {
    try {
        const currentDate = new Date();

        const coupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
            $or: [
                { usageLimit: null },
                { $expr: { $lt: ["$usageCount", "$usageLimit"] } }
            ]
        })
            .select('code discountType discountValue minimumPurchase endDate')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching active coupons",
            error: error.message
        });
    }
};

// Validate Coupon
export const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal, productIds = [] } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required"
            });
        }

        if (!cartTotal || cartTotal <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid cart total is required"
            });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        })
            .populate('applicableProducts', '_id')
            .populate('applicableCategories', '_id');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code"
            });
        }

        const currentDate = new Date();

        // Check if coupon is within valid date range
        if (currentDate < coupon.startDate || currentDate > coupon.endDate) {
            return res.status(400).json({
                success: false,
                message: "Coupon has expired or not yet active"
            });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit exceeded"
            });
        }

        // Check minimum purchase requirement
        if (cartTotal < coupon.minimumPurchase) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase of $${coupon.minimumPurchase} required`
            });
        }

        // Check product/category restrictions
        if (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0) {
            let isApplicable = false;

            if (coupon.applicableProducts.length > 0) {
                const applicableProductIds = coupon.applicableProducts.map(p => p._id.toString());
                isApplicable = productIds.some(id => applicableProductIds.includes(id));
            }

            if (!isApplicable && coupon.applicableCategories.length > 0) {
                // Check if any products belong to applicable categories
                const products = await Product.find({
                    _id: { $in: productIds },
                    categoryId: { $in: coupon.applicableCategories.map(c => c._id) }
                });
                isApplicable = products.length > 0;
            }

            if (!isApplicable) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon is not applicable to selected products"
                });
            }
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = Math.min(coupon.discountValue, cartTotal);
        }

        const finalTotal = Math.max(0, cartTotal - discountAmount);

        res.status(200).json({
            success: true,
            message: "Coupon is valid",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                originalTotal: cartTotal,
                finalTotal: parseFloat(finalTotal.toFixed(2))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error validating coupon",
            error: error.message
        });
    }
};

// Create Coupon (Admin)
export const createCoupon = async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minimumPurchase = 0,
            startDate,
            endDate,
            usageLimit,
            applicableProducts = [],
            applicableCategories = []
        } = req.body;

        // Validation
        if (!code || !discountType || !discountValue || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Code, discount type, discount value, start date, and end date are required"
            });
        }

        if (!['percentage', 'fixed'].includes(discountType)) {
            return res.status(400).json({
                success: false,
                message: "Discount type must be 'percentage' or 'fixed'"
            });
        }

        if (discountValue <= 0) {
            return res.status(400).json({
                success: false,
                message: "Discount value must be greater than 0"
            });
        }

        if (discountType === 'percentage' && discountValue > 100) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount cannot exceed 100%"
            });
        }

        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase()
        });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minimumPurchase,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            usageLimit,
            applicableProducts,
            applicableCategories
        });

        await coupon.save();
        await coupon.populate('applicableProducts', 'productName');
        await coupon.populate('applicableCategories', 'name');

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating coupon",
            error: error.message
        });
    }
};

// Update Coupon (Admin)
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid coupon ID"
            });
        }

        // If updating code, check for duplicates
        if (updates.code) {
            const existingCoupon = await Coupon.findOne({
                code: updates.code.toUpperCase(),
                _id: { $ne: id }
            });
            if (existingCoupon) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon code already exists"
                });
            }
            updates.code = updates.code.toUpperCase();
        }

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        )
            .populate('applicableProducts', 'productName')
            .populate('applicableCategories', 'name');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating coupon",
            error: error.message
        });
    }
};

// Delete Coupon (Admin)
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid coupon ID"
            });
        }

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting coupon",
            error: error.message
        });
    }
};
