import {
    StoreOrder,
    StoreProduct,
    StoreInventory,
    StoreStockHistory
} from "../../models/adminstore/index.js";
import User from "../../models/User.js";
import { sendOrderConfirmationEmail, prepareOrderDataForEmail } from "../../utils/emailHelper.js";

// Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            paymentStatus,
            search,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.orderStatus = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (search) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customerInfo.email': { $regex: search, $options: 'i' } },
                { 'customerInfo.name': { $regex: search, $options: 'i' } }
            ];
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const orders = await StoreOrder.find(filter)
            .populate('userId', 'fullName email phone')
            .populate('items.productId', 'productName sku images')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreOrder.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: orders,
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

// Get Order Details
export const getOrderDetails = async (req, res) => {
    try {
        const order = await StoreOrder.findById(req.params.id)
            .populate('userId', 'fullName email phone')
            .populate('items.productId', 'productName sku images price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const order = await StoreOrder.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const oldStatus = order.orderStatus;

        // Update order status
        order.orderStatus = status;
        if (notes) {
            order.notes.adminNotes = notes;
        }

        // Handle status-specific logic
        switch (status) {
            case 'confirmed':
                // Reserve inventory
                for (const item of order.items) {
                    await StoreInventory.findOneAndUpdate(
                        { productId: item.productId },
                        { $inc: { 'stock.reservedStock': item.quantity } }
                    );
                }

                // Send order confirmation email to customer
                try {
                    // Populate the order with product details for email
                    await order.populate('items.productId', 'productName sku');

                    const orderDataForEmail = prepareOrderDataForEmail(order);
                    const emailResult = await sendOrderConfirmationEmail(orderDataForEmail);

                    if (emailResult.success) {
                        console.log(`Order confirmation email sent for order ${order.orderNumber}`);
                    } else {
                        console.error(`Failed to send confirmation email for order ${order.orderNumber}:`, emailResult.error);
                    }
                } catch (emailError) {
                    console.error(`Error sending confirmation email for order ${order.orderNumber}:`, emailError);
                    // Don't fail the status update if email fails
                }
                break;

            case 'shipped':
                order.shipping.shippedAt = new Date();
                if (req.body.trackingNumber) {
                    order.shipping.trackingNumber = req.body.trackingNumber;
                }
                if (req.body.shippingProvider) {
                    order.shipping.provider = req.body.shippingProvider;
                }
                break;

            case 'delivered':
                order.shipping.deliveredAt = new Date();
                order.fulfillment.deliveredAt = new Date();

                // Update inventory - remove reserved stock and reduce current stock
                for (const item of order.items) {
                    await StoreInventory.findOneAndUpdate(
                        { productId: item.productId },
                        {
                            $inc: {
                                'stock.currentStock': -item.quantity,
                                'stock.reservedStock': -item.quantity
                            }
                        }
                    );

                    // Create stock history record
                    await StoreStockHistory.create({
                        productId: item.productId,
                        sku: item.sku,
                        transaction: {
                            type: 'out',
                            reason: 'sale',
                            quantity: item.quantity
                        },
                        stock: {
                            previousStock: 0, // Will be updated by pre-save middleware
                            newStock: 0 // Will be updated by pre-save middleware
                        },
                        reference: order.orderNumber,
                        relatedDocument: {
                            documentType: 'order',
                            documentId: order._id
                        }
                    });

                    // Update product sales count
                    await StoreProduct.findByIdAndUpdate(item.productId, {
                        $inc: { salesCount: item.quantity }
                    });
                }
                break;

            case 'canceled':
                // Release reserved inventory
                if (oldStatus === 'confirmed' || oldStatus === 'processing') {
                    for (const item of order.items) {
                        await StoreInventory.findOneAndUpdate(
                            { productId: item.productId },
                            { $inc: { 'stock.reservedStock': -item.quantity } }
                        );
                    }
                }
                break;
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Orders by Status
export const getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        const orders = await StoreOrder.find({ orderStatus: status })
            .populate('userId', 'name email')
            .populate('items.productId', 'productName sku')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreOrder.countDocuments({ orderStatus: status });

        res.status(200).json({
            success: true,
            data: orders,
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

// Get Order Analytics
export const getOrderAnalytics = async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const analytics = await StoreOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$pricing.totalPrice' },
                    averageOrderValue: { $avg: '$pricing.totalPrice' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
                    },
                    confirmedOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
                    },
                    shippedOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] }
                    },
                    deliveredOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
                    },
                    canceledOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'canceled'] }, 1, 0] }
                    }
                }
            }
        ]);

        const result = analytics[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            pendingOrders: 0,
            confirmedOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            canceledOrders: 0
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

// Bulk Update Orders
export const bulkUpdateOrders = async (req, res) => {
    try {
        const { orderIds, updateData } = req.body;

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order IDs are required'
            });
        }

        const result = await StoreOrder.updateMany(
            { _id: { $in: orderIds } },
            updateData
        );

        res.status(200).json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            },
            message: `${result.modifiedCount} orders updated successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export Orders
export const exportOrders = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        const filter = {};
        if (status) filter.orderStatus = status;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const orders = await StoreOrder.find(filter)
            .populate('userId', 'fullName email')
            .populate('items.productId', 'productName sku')
            .sort({ createdAt: -1 });

        // Transform data for export
        const exportData = orders.map(order => ({
            orderNumber: order.orderNumber,
            customerName: order.customerInfo?.name || order.userId?.fullName || 'Unknown',
            customerEmail: order.customerInfo?.email || order.userId?.email || '',
            totalAmount: order.pricing.totalPrice,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            itemCount: order.items.length
        }));

        res.status(200).json({
            success: true,
            data: exportData,
            message: 'Orders exported successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Process Refund
export const processRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, reason } = req.body;

        const order = await StoreOrder.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order with refund information
        order.refund = {
            amount,
            reason,
            refundedAt: new Date()
        };
        order.orderStatus = 'refunded';
        order.paymentStatus = 'refunded';

        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Refund processed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Order by ID (alias for getOrderDetails)
export const getOrderById = getOrderDetails;

// Create Order
export const createOrder = async (req, res) => {
    try {
        const order = new StoreOrder(req.body);
        await order.save();

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Order
export const updateOrder = async (req, res) => {
    try {
        const order = await StoreOrder.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Order
export const deleteOrder = async (req, res) => {
    try {
        const order = await StoreOrder.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Delete Orders
export const bulkDeleteOrders = async (req, res) => {
    try {
        const { orderIds } = req.body;

        if (!orderIds || !Array.isArray(orderIds)) {
            return res.status(400).json({
                success: false,
                message: 'Order IDs array is required'
            });
        }

        const result = await StoreOrder.deleteMany({
            _id: { $in: orderIds }
        });

        res.status(200).json({
            success: true,
            data: { deletedCount: result.deletedCount },
            message: `${result.deletedCount} orders deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search Orders
export const searchOrders = async (req, res) => {
    try {
        const { q, status, startDate, endDate } = req.query;

        const filter = {};

        if (q) {
            filter.$or = [
                { orderNumber: { $regex: q, $options: 'i' } },
                { 'customer.email': { $regex: q, $options: 'i' } },
                { 'customer.name': { $regex: q, $options: 'i' } }
            ];
        }

        if (status) filter.status = status;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const orders = await StoreOrder.find(filter)
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Orders by Date Range
export const getOrdersByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const orders = await StoreOrder.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('items.productId');

        res.status(200).json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Generate Invoice
export const generateInvoice = async (req, res) => {
    try {
        const order = await StoreOrder.findById(req.params.id)
            .populate('items.productId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Generate invoice data
        const invoice = {
            orderNumber: order.orderNumber,
            customer: order.customer,
            items: order.items,
            totals: order.totals,
            createdAt: order.createdAt,
            status: order.status
        };

        res.status(200).json({
            success: true,
            data: invoice,
            message: 'Invoice generated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send Order Confirmation
export const sendOrderConfirmation = async (req, res) => {
    try {
        const order = await StoreOrder.findById(req.params.id)
            .populate('items.productId', 'productName sku');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Send order confirmation email to customer
        try {
            const orderDataForEmail = prepareOrderDataForEmail(order);
            const emailResult = await sendOrderConfirmationEmail(orderDataForEmail);

            if (emailResult.success) {
                // Mark as confirmation sent (if you want to track this)
                // order.confirmationSent = true;
                // await order.save();

                res.status(200).json({
                    success: true,
                    data: order,
                    message: 'Order confirmation email sent successfully',
                    emailInfo: {
                        messageId: emailResult.messageId,
                        sentTo: order.customerInfo.email
                    }
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to send order confirmation email',
                    error: emailResult.error
                });
            }
        } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
            res.status(500).json({
                success: false,
                message: 'Error sending order confirmation email',
                error: emailError.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Track Order
export const trackOrder = async (req, res) => {
    try {
        const order = await StoreOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const tracking = {
            orderNumber: order.orderNumber,
            status: order.status,
            trackingNumber: order.shipping?.trackingNumber,
            estimatedDelivery: order.shipping?.estimatedDelivery,
            statusHistory: order.statusHistory || []
        };

        res.status(200).json({
            success: true,
            data: tracking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Order Note
export const addOrderNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { note, isPrivate = false } = req.body;

        const order = await StoreOrder.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const newNote = {
            note,
            isPrivate,
            createdBy: req.user?.id || 'system',
            createdAt: new Date()
        };

        if (!order.notes) order.notes = [];
        order.notes.push(newNote);
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Note added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Order Note
export const updateOrderNote = async (req, res) => {
    try {
        const { id, noteId } = req.params;
        const { note, isPrivate } = req.body;

        const order = await StoreOrder.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const noteIndex = order.notes?.findIndex(n => n._id.toString() === noteId);
        if (noteIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        order.notes[noteIndex].note = note;
        order.notes[noteIndex].isPrivate = isPrivate;
        order.notes[noteIndex].updatedAt = new Date();
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Note updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Order Note
export const deleteOrderNote = async (req, res) => {
    try {
        const { id, noteId } = req.params;

        const order = await StoreOrder.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!order.notes) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        order.notes = order.notes.filter(n => n._id.toString() !== noteId);
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Order Notes
export const getOrderNotes = async (req, res) => {
    try {
        const order = await StoreOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order.notes || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Shipping Info
export const updateShippingInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const shippingData = req.body;

        const order = await StoreOrder.findByIdAndUpdate(
            id,
            { $set: { shipping: shippingData } },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Shipping info updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Payment Status
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        const order = await StoreOrder.findByIdAndUpdate(
            id,
            { 'payment.status': paymentStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Payment status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mark Order as Paid
export const markOrderAsPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await StoreOrder.findByIdAndUpdate(
            id,
            {
                'payment.status': 'paid',
                'payment.paidAt': new Date()
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order marked as paid successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mark Order as Shipped
export const markOrderAsShipped = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackingNumber, carrier } = req.body;

        const order = await StoreOrder.findByIdAndUpdate(
            id,
            {
                status: 'shipped',
                'shipping.trackingNumber': trackingNumber,
                'shipping.carrier': carrier,
                'shipping.shippedAt': new Date()
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order marked as shipped successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mark Order as Delivered
export const markOrderAsDelivered = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await StoreOrder.findByIdAndUpdate(
            id,
            {
                status: 'delivered',
                'shipping.deliveredAt': new Date()
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order marked as delivered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const order = await StoreOrder.findByIdAndUpdate(
            id,
            {
                status: 'cancelled',
                cancellation: {
                    reason: reason || 'Order cancelled',
                    cancelledAt: new Date(),
                    cancelledBy: req.user?.id || 'system'
                }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Fulfill Order
export const fulfillOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await StoreOrder.findByIdAndUpdate(
            id,
            {
                status: 'fulfilled',
                fulfilledAt: new Date(),
                fulfilledBy: req.user?.id || 'system'
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order fulfilled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
