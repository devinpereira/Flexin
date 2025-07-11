import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import User from "../models/User.js";
// Import admin store models for correct product source and order integration
import StoreProduct from "../models/adminstore/StoreProduct.js";
import StoreOrder from "../models/adminstore/StoreOrder.js";

// Create Order - Using Admin Store Order Model
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, addressId, paymentMethod, customerInfo } = req.body;

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

        // Get user info for customer details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let subtotal = 0;
        const orderItems = [];

        // Validate each item and calculate total price
        for (const item of items) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Each item must have productId and quantity"
                });
            }

            const product = await StoreProduct.findOne({
                _id: item.productId,
                isActive: true,
                status: 'active'
            });
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
            subtotal += itemTotal;

            orderItems.push({
                productId: product._id,
                productName: product.productName,
                sku: product.sku,
                price: product.price,
                quantity: item.quantity,
                totalPrice: itemTotal,
                productImage: product.images && product.images.length > 0
                    ? (product.images[0].url || product.images[0])
                    : null
            });
        }

        // Map payment method to valid enum values
        let validPaymentMethod = 'cash_on_delivery'; // default
        if (paymentMethod) {
            const methodMap = {
                'card': 'card',
                'credit card': 'card',
                'paypal': 'paypal',
                'cash on delivery': 'cash_on_delivery',
                'cash_on_delivery': 'cash_on_delivery',
                'bank transfer': 'bank_transfer',
                'wallet': 'wallet'
            };
            validPaymentMethod = methodMap[paymentMethod.toLowerCase()] || 'cash_on_delivery';
        }

        // Calculate pricing
        const shippingCost = 10.99; // Fixed shipping cost
        const taxAmount = 0; // No tax for now
        const discountAmount = 0; // No discount for now
        const totalPrice = subtotal + shippingCost + taxAmount - discountAmount;

        // Generate order number
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        console.log('Creating order with data:', {
            orderNumber,
            userId,
            customerInfo,
            paymentMethod: validPaymentMethod,
            itemsCount: orderItems.length
        });

        // Create order using admin store model
        const order = new StoreOrder({
            orderNumber,
            userId,
            customerInfo: {
                name: customerInfo?.firstName && customerInfo?.lastName
                    ? `${customerInfo.firstName} ${customerInfo.lastName}`
                    : user.fullName || user.email,
                email: customerInfo?.email || user.email,
                phone: customerInfo?.phone || address.phoneNumber
            },
            items: orderItems,
            shippingAddress: {
                fullName: address.fullName,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                phoneNumber: address.phoneNumber
            },
            billingAddress: {
                fullName: address.fullName,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                phoneNumber: address.phoneNumber
            },
            pricing: {
                subtotal: parseFloat(subtotal.toFixed(2)),
                shippingCost: parseFloat(shippingCost.toFixed(2)),
                taxAmount: parseFloat(taxAmount.toFixed(2)),
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                totalPrice: parseFloat(totalPrice.toFixed(2))
            },
            paymentMethod: validPaymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'pending',
            shipping: {
                method: 'standard'
            },
            notes: {
                customerNotes: customerInfo?.notes || ''
            }
        });

        console.log('Order object before save:', order.toObject());

        try {
            await order.save();
            console.log('Order saved successfully:', order._id);
        } catch (saveError) {
            console.error('Order save error:', saveError);
            console.error('Order validation errors:', saveError.errors);
            throw saveError;
        }

        // Update product quantities in admin store
        for (const item of items) {
            await StoreProduct.findByIdAndUpdate(
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
        await order.populate([
            {
                path: 'userId',
                select: 'fullName email phone'
            },
            {
                path: 'items.productId',
                select: 'productName price images sku'
            }
        ]);

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

// Get User Orders - Using Admin Store Order Model
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, page = 1, limit = 10 } = req.query;

        let filter = { userId };
        if (status) {
            filter.orderStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await StoreOrder.find(filter)
            .populate({
                path: 'items.productId',
                select: 'productName price images sku'
            })
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalOrders = await StoreOrder.countDocuments(filter);
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

// Get Single Order - Using Admin Store Order Model
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

        const order = await StoreOrder.findOne({ _id: id, userId })
            .populate({
                path: 'items.productId',
                select: 'productName price images description shortDescription sku'
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

        const order = await StoreOrder.findOne({ _id: id, userId });
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

        // Restore product quantities in admin store
        for (const item of order.items) {
            await StoreProduct.findByIdAndUpdate(
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
                    from: 'storeproducts',
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

        const orders = await StoreOrder.aggregate(pipeline);
        const totalOrders = await StoreOrder.countDocuments(filter);
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

        const validStatuses = ['pending', 'confirmed', 'processing', 'picked', 'shipped', 'delivered', 'canceled', 'refunded', 'returned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await StoreOrder.findByIdAndUpdate(
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
