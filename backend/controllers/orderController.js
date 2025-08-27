import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import User from "../models/User.js";
// Import admin store models for correct product source and order integration
import StoreProduct from "../models/adminstore/StoreProduct.js";
import StoreOrder from "../models/adminstore/StoreOrder.js";
import StoreInventory from "../models/adminstore/StoreInventory.js";

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

            // Check inventory before order
            const inventoryBefore = await StoreInventory.findOne({ productId: item.productId });

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
        console.log('Updating inventory quantities for ordered items...');
        for (const item of items) {
            try {
                console.log(`Processing inventory update for item:`, {
                    productId: item.productId,
                    quantity: item.quantity,
                    itemDetails: JSON.stringify(item)
                });

                // Validate product ID
                if (!item.productId.match(/^[0-9a-fA-F]{24}$/)) {
                    console.error(`Invalid product ID format: ${item.productId}`);
                    continue;
                }

                // Get the product before update to log the change
                const productBefore = await StoreProduct.findById(item.productId);
                if (!productBefore) {
                    console.error(`Cannot find product with ID: ${item.productId} before update`);
                    continue;
                }

                console.log(`Found product before update:`, {
                    id: productBefore._id,
                    name: productBefore.productName,
                    currentQuantity: productBefore.quantity
                });

                // Ensure quantity is a number
                const deductQuantity = parseInt(item.quantity);
                if (isNaN(deductQuantity) || deductQuantity <= 0) {
                    console.error(`Invalid quantity to deduct: ${item.quantity}`);
                    continue;
                }

                // Direct update approach 1: findByIdAndUpdate
                console.log(`Attempting to update product ${item.productId} with quantity ${deductQuantity}`);

                // Try a different approach if normal update isn't working
                const productToUpdate = await StoreProduct.findById(item.productId);
                if (!productToUpdate) {
                    console.error(`Cannot find product for update: ${item.productId}`);
                    continue;
                }

                // Direct modification and save to trigger hooks
                productToUpdate.quantity = Math.max(0, productToUpdate.quantity - deductQuantity);
                await productToUpdate.save();

                // Also update the inventory record directly
                const inventory = await StoreInventory.findOne({ productId: item.productId });
                if (inventory) {
                    console.log(`Found inventory for product ${item.productId}, updating stock from ${inventory.stock.currentStock} to ${productToUpdate.quantity}`);
                    inventory.stock.currentStock = productToUpdate.quantity;
                    inventory.stock.availableStock = Math.max(0, productToUpdate.quantity - inventory.stock.reservedStock);
                    await inventory.save();
                    console.log(`Inventory updated successfully. New stock: ${inventory.stock.currentStock}`);
                } else {
                    console.log(`No inventory record found for product ${item.productId}, creating one`);
                    // Create inventory record if it doesn't exist
                    const newInventory = new StoreInventory({
                        productId: item.productId,
                        sku: productToUpdate.sku,
                        stock: {
                            currentStock: productToUpdate.quantity,
                            availableStock: productToUpdate.quantity,
                            reservedStock: 0
                        },
                        thresholds: {
                            lowStockThreshold: productToUpdate.lowStockThreshold || 10,
                            reorderPoint: 5
                        },
                        pricing: {
                            costPrice: productToUpdate.costPrice || 0,
                            totalValue: productToUpdate.quantity * (productToUpdate.costPrice || 0)
                        }
                    });
                    await newInventory.save();
                    console.log(`Created new inventory record for product ${item.productId}`);
                }

                // Get the updated product
                const updatedProduct = await StoreProduct.findById(item.productId);

                if (!updatedProduct) {
                    console.error(`Failed to update inventory for product ${item.productId} - Update returned null`);
                    continue;
                }

                console.log(`✅ Inventory updated for product ${updatedProduct.productName || item.productId}:`, {
                    productId: updatedProduct._id,
                    beforeQuantity: productBefore.quantity,
                    deducted: deductQuantity,
                    afterQuantity: updatedProduct.quantity,
                    updateSuccessful: productBefore.quantity !== updatedProduct.quantity
                });

                // Double-check the update with a fresh query
                const verifyProduct = await StoreProduct.findById(item.productId);
                console.log(`Verification check:`, {
                    productId: item.productId,
                    verifiedQuantity: verifyProduct?.quantity,
                    matchesUpdated: verifyProduct?.quantity === updatedProduct.quantity
                });
            } catch (inventoryError) {
                console.error(`Error updating inventory for product ${item.productId}:`, inventoryError);
                console.error(`Error stack:`, inventoryError.stack);
                // Continue with other items even if one fails
            }
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
        console.log('Restoring inventory quantities for cancelled items...');
        for (const item of order.items) {
            try {
                console.log(`Processing inventory restoration for item:`, {
                    productId: item.productId,
                    quantity: item.quantity,
                    productName: item.productName
                });

                // Check if productId is an ObjectId or a string representation
                const productIdStr = typeof item.productId === 'object' ? item.productId.toString() : item.productId;

                // Get product before update to log the change
                const productBefore = await StoreProduct.findById(productIdStr);
                if (!productBefore) {
                    console.error(`Cannot find product with ID: ${productIdStr} before restoration`);
                    continue;
                }

                console.log(`Found product before restoration:`, {
                    id: productBefore._id,
                    name: productBefore.productName,
                    currentQuantity: productBefore.quantity
                });

                // Ensure quantity is a number
                const restoreQuantity = parseInt(item.quantity);
                if (isNaN(restoreQuantity) || restoreQuantity <= 0) {
                    console.error(`Invalid quantity to restore: ${item.quantity}`);
                    continue;
                }

                // Direct update approach for restoration
                console.log(`Attempting to restore quantity ${restoreQuantity} to product ${productIdStr}`);

                // Try a different approach if normal update isn't working
                const productToRestore = await StoreProduct.findById(productIdStr);
                if (!productToRestore) {
                    console.error(`Cannot find product for restoration: ${productIdStr}`);
                    continue;
                }

                // Direct modification and save to trigger hooks
                productToRestore.quantity = productToRestore.quantity + restoreQuantity;
                await productToRestore.save();

                // Also update the inventory record directly
                const inventory = await StoreInventory.findOne({ productId: productIdStr });
                if (inventory) {
                    console.log(`Found inventory for product ${productIdStr}, restoring stock from ${inventory.stock.currentStock} to ${productToRestore.quantity}`);
                    inventory.stock.currentStock = productToRestore.quantity;
                    inventory.stock.availableStock = Math.max(0, productToRestore.quantity - inventory.stock.reservedStock);
                    await inventory.save();
                    console.log(`Inventory restored successfully. New stock: ${inventory.stock.currentStock}`);
                } else {
                    console.log(`No inventory record found for product ${productIdStr} when restoring stock`);
                    // Create inventory record if it doesn't exist
                    const newInventory = new StoreInventory({
                        productId: productIdStr,
                        sku: productToRestore.sku,
                        stock: {
                            currentStock: productToRestore.quantity,
                            availableStock: productToRestore.quantity,
                            reservedStock: 0
                        },
                        thresholds: {
                            lowStockThreshold: productToRestore.lowStockThreshold || 10,
                            reorderPoint: 5
                        },
                        pricing: {
                            costPrice: productToRestore.costPrice || 0,
                            totalValue: productToRestore.quantity * (productToRestore.costPrice || 0)
                        }
                    });
                    await newInventory.save();
                    console.log(`Created new inventory record for product ${productIdStr} during restoration`);
                }

                // Get the updated product
                const updatedProduct = await StoreProduct.findById(productIdStr);

                if (!updatedProduct) {
                    console.error(`Failed to restore inventory for product ${productIdStr} - Update returned null`);
                    continue;
                }

                console.log(`✅ Inventory restored for product ${updatedProduct.productName || productIdStr}:`, {
                    productId: updatedProduct._id,
                    beforeQuantity: productBefore.quantity,
                    restored: restoreQuantity,
                    afterQuantity: updatedProduct.quantity,
                    updateSuccessful: productBefore.quantity !== updatedProduct.quantity
                });

                // Double-check the update with a fresh query
                const verifyProduct = await StoreProduct.findById(productIdStr);
                console.log(`Verification check:`, {
                    productId: productIdStr,
                    verifiedQuantity: verifyProduct?.quantity,
                    matchesUpdated: verifyProduct?.quantity === updatedProduct.quantity
                });
            } catch (inventoryError) {
                console.error(`Error restoring inventory for product ${item.productId}:`, inventoryError);
                console.error(`Error stack:`, inventoryError.stack);
                // Continue with other items even if one fails
            }
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
// Sync Product and Inventory
export const syncProductInventory = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find product
        const product = await StoreProduct.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find inventory
        let inventory = await StoreInventory.findOne({ productId });

        if (!inventory) {
            // Create new inventory if it doesn't exist
            inventory = new StoreInventory({
                productId,
                sku: product.sku,
                stock: {
                    currentStock: product.quantity,
                    availableStock: product.quantity,
                    reservedStock: 0
                },
                thresholds: {
                    lowStockThreshold: product.lowStockThreshold || 10,
                    reorderPoint: 5
                },
                pricing: {
                    costPrice: product.costPrice || 0,
                    totalValue: product.quantity * (product.costPrice || 0)
                }
            });
            await inventory.save();
            console.log(`Created new inventory record for product ${productId}`);
        } else {
            // Update inventory to match product
            const beforeStock = inventory.stock.currentStock;
            inventory.stock.currentStock = product.quantity;
            inventory.stock.availableStock = Math.max(0, product.quantity - inventory.stock.reservedStock);
            inventory.pricing.totalValue = product.quantity * (inventory.pricing.costPrice || 0);
            await inventory.save();
            console.log(`Updated inventory for product ${productId} from ${beforeStock} to ${product.quantity}`);
        }

        res.status(200).json({
            success: true,
            message: "Product and inventory synchronized",
            data: {
                product,
                inventory
            }
        });
    } catch (error) {
        console.error("Error synchronizing product and inventory:", error);
        res.status(500).json({
            success: false,
            message: "Error synchronizing product and inventory",
            error: error.message
        });
    }
};

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

        // Find order first to apply updates correctly
        const order = await StoreOrder.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Get old status for potential inventory adjustments
        const oldStatus = order.orderStatus;

        // Update order status
        order.orderStatus = status;
        await order.save();

        // Handle inventory implications based on status change
        if (status === 'delivered' && oldStatus !== 'delivered') {
            // When an order is delivered, we should ensure inventory is properly deducted
            console.log(`Order ${id} marked as delivered, ensuring inventory is updated...`);

            for (const item of order.items) {
                const productId = typeof item.productId === 'object' ? item.productId.toString() : item.productId;

                // Update inventory directly
                const inventory = await StoreInventory.findOne({ productId });
                if (inventory) {
                    console.log(`Ensuring delivery inventory update for product ${productId}`);

                    // Deduct from reserved stock if there is any
                    if (inventory.stock.reservedStock > 0) {
                        inventory.stock.reservedStock = Math.max(0, inventory.stock.reservedStock - item.quantity);
                        await inventory.save();
                        console.log(`Updated reserved stock for product ${productId} on delivery`);
                    }
                }
            }
        }

        // Populate the order for the response
        await order.populate({
            path: 'items.productId',
            select: 'productName price images'
        });

        await order.populate('userId', 'fullName email');

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
