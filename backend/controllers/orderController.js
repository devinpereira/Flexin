import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import User from "../models/User.js";

// Create Order
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, addressId, paymentMethod } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required"
            });
        }

        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Delivery address is required"
            });
        }

        // Validate address belongs to user
        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        // Validate each item and calculate total price
        for (const item of items) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Each item must have productId and quantity"
                });
            }

            const product = await Product.findOne({ _id: item.productId, isActive: true });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found or unavailable`
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.productName}. Only ${product.quantity} available`
                });
            }

            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity
            });
        }

        // Create order
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice: parseFloat(totalPrice.toFixed(2)),
            orderStatus: 'pending'
        });

        await order.save();

        // Update product quantities
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { quantity: -item.quantity } }
            );
        }

        // Clear cart items that were ordered
        const cart = await Cart.findOne({ userId });
        if (cart) {
            const orderedProductIds = items.map(item => item.productId);
            cart.items = cart.items.filter(
                cartItem => !orderedProductIds.includes(cartItem.productId.toString())
            );
            await cart.save();
        }

        // Populate order details for response
        await order.populate({
            path: 'items.productId',
            select: 'productName price images'
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
};

// Get User Orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, page = 1, limit = 10 } = req.query;

        let filter = { userId };
        if (status) {
            filter.orderStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(filter)
            .populate({
                path: 'items.productId',
                select: 'productName price images'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / parseInt(limit));

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalOrders,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

// Get Single Order
export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({ _id: id, userId })
            .populate({
                path: 'items.productId',
                select: 'productName price images description'
            })
            .populate('userId', 'fullName email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching order",
            error: error.message
        });
    }
};

// Cancel Order (only if status is pending)
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({ _id: id, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Only pending orders can be cancelled"
            });
        }

        // Update order status
        order.orderStatus = 'canceled';
        await order.save();

        // Restore product quantities
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { quantity: item.quantity } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error cancelling order",
            error: error.message
        });
    }
};

// Admin: Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const {
            status,
            startDate,
            endDate,
            page = 1,
            limit = 20,
            search
        } = req.query;

        let filter = {};

        if (status) {
            filter.orderStatus = status;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let pipeline = [
            { $match: filter },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            }
        ];

        // Add search filter if provided
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { 'user.fullName': { $regex: search, $options: 'i' } },
                        { 'user.email': { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        );

        const orders = await Order.aggregate(pipeline);
        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / parseInt(limit));

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalOrders,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

// Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus: status },
            { new: true }
        )
            .populate({
                path: 'items.productId',
                select: 'productName price images'
            })
            .populate('userId', 'fullName email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message
        });
    }
};
