import {
    StoreInventory,
    StoreProduct,
    StoreStockHistory
} from "../../models/adminstore/index.js";

// Get Inventory
export const getInventory = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            lowStock = false,
            outOfStock = false,
            sortBy = 'updatedAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (search) {
            // First find products matching search criteria
            const matchingProducts = await StoreProduct.find({
                $or: [
                    { productName: { $regex: search, $options: 'i' } },
                    { sku: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');

            filter.productId = { $in: matchingProducts.map(p => p._id) };
        }

        if (lowStock === 'true') {
            filter.$expr = { $lte: ['$stock.currentStock', '$thresholds.lowStockThreshold'] };
        }

        if (outOfStock === 'true') {
            filter['stock.currentStock'] = 0;
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const inventory = await StoreInventory.find(filter)
            .populate({
                path: 'productId',
                select: 'productName sku images price categoryId subcategoryId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'subcategoryId', select: 'name' }
                ]
            })
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreInventory.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: inventory,
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

// Update Stock
export const updateStock = async (req, res) => {
    try {
        const { id } = req.params; // This should be the inventory ID or productId
        const { quantity, reason = 'adjustment', notes } = req.body;

        if (typeof quantity !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a number'
            });
        }

        // Try to find inventory by productId first, then by inventory ID
        let inventory = await StoreInventory.findOne({ productId: id });
        if (!inventory) {
            inventory = await StoreInventory.findById(id);
        }

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory record not found'
            });
        }

        const productId = inventory.productId;
        const previousStock = inventory.stock.currentStock;
        const difference = quantity - previousStock;

        // Update inventory
        inventory.stock.currentStock = quantity;
        await inventory.save();

        // Update product quantity - using direct modification and save to trigger hooks
        const productToUpdate = await StoreProduct.findById(productId);
        if (productToUpdate) {
            productToUpdate.quantity = quantity;
            await productToUpdate.save();
            console.log(`Updated product ${productId} quantity to ${quantity}`);
        } else {
            console.error(`Product ${productId} not found for quantity update`);
        }

        // Create stock history record
        await StoreStockHistory.create({
            productId,
            sku: inventory.sku,
            transaction: {
                type: difference > 0 ? 'in' : 'out',
                reason,
                quantity: Math.abs(difference)
            },
            stock: {
                previousStock,
                newStock: quantity,
                difference
            },
            notes,
            performedBy: req.user?._id
        });

        const updatedInventory = await StoreInventory.findOne({ productId })
            .populate({
                path: 'productId',
                select: 'productName sku images price categoryId subcategoryId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'subcategoryId', select: 'name' }
                ]
            });

        res.status(200).json({
            success: true,
            data: updatedInventory,
            message: 'Stock updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Update Stock
export const bulkUpdateStock = async (req, res) => {
    try {
        const { updates } = req.body; // Array of { productId, quantity, reason, notes }

        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Updates array is required'
            });
        }

        const results = [];
        const errors = [];

        for (const update of updates) {
            try {
                const { productId, quantity, reason = 'bulk_adjustment', notes } = update;

                const inventory = await StoreInventory.findOne({ productId });
                if (!inventory) {
                    errors.push({ productId, error: 'Inventory record not found' });
                    continue;
                }

                const previousStock = inventory.stock.currentStock;
                const difference = quantity - previousStock;

                // Update inventory
                inventory.stock.currentStock = quantity;
                await inventory.save();

                // Update product quantity - using direct modification and save to trigger hooks
                const productToUpdate = await StoreProduct.findById(productId);
                if (productToUpdate) {
                    productToUpdate.quantity = quantity;
                    await productToUpdate.save();
                    console.log(`Updated product ${productId} quantity to ${quantity} in bulk operation`);
                } else {
                    console.error(`Product ${productId} not found for bulk quantity update`);
                }

                // Create stock history record
                await StoreStockHistory.create({
                    productId,
                    sku: inventory.sku,
                    transaction: {
                        type: difference > 0 ? 'in' : 'out',
                        reason,
                        quantity: Math.abs(difference)
                    },
                    stock: {
                        previousStock,
                        newStock: quantity,
                        difference
                    },
                    notes,
                    performedBy: req.user?._id
                });

                results.push({ productId, success: true });
            } catch (error) {
                errors.push({ productId: update.productId, error: error.message });
            }
        }

        res.status(200).json({
            success: true,
            data: {
                successful: results.length,
                failed: errors.length,
                results,
                errors
            },
            message: `Bulk update completed. ${results.length} successful, ${errors.length} failed.`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Low Stock Alerts
export const getLowStockAlerts = async (req, res) => {
    try {
        const lowStockItems = await StoreInventory.find({
            'alerts.lowStockAlert': true,
            isActive: true
        })
            .populate({
                path: 'productId',
                select: 'productName sku images categoryId subcategoryId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'subcategoryId', select: 'name' }
                ]
            })
            .sort({ 'stock.currentStock': 1 });

        const outOfStockItems = await StoreInventory.find({
            'alerts.outOfStockAlert': true,
            isActive: true
        })
            .populate({
                path: 'productId',
                select: 'productName sku images categoryId subcategoryId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'subcategoryId', select: 'name' }
                ]
            });

        const reorderItems = await StoreInventory.find({
            'alerts.reorderAlert': true,
            isActive: true
        })
            .populate({
                path: 'productId',
                select: 'productName sku images categoryId subcategoryId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'subcategoryId', select: 'name' }
                ]
            });

        res.status(200).json({
            success: true,
            data: {
                lowStock: lowStockItems,
                outOfStock: outOfStockItems,
                reorderAlerts: reorderItems,
                summary: {
                    lowStockCount: lowStockItems.length,
                    outOfStockCount: outOfStockItems.length,
                    reorderCount: reorderItems.length
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

// Update Reorder Point
export const updateReorderPoint = async (req, res) => {
    try {
        const { productId } = req.params;
        const { reorderPoint, lowStockThreshold } = req.body;

        // Find inventory first
        const inventory = await StoreInventory.findOne({ productId });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory record not found'
            });
        }

        // Update fields directly
        if (reorderPoint !== undefined) {
            inventory.thresholds.reorderPoint = reorderPoint;
        }

        if (lowStockThreshold !== undefined) {
            inventory.thresholds.lowStockThreshold = lowStockThreshold;

            // Update product lowStockThreshold as well
            const product = await StoreProduct.findById(productId);
            if (product) {
                product.lowStockThreshold = lowStockThreshold;
                await product.save();
                console.log(`Updated product ${productId} lowStockThreshold to ${lowStockThreshold}`);
            }
        }

        // Save with hooks
        await inventory.save();

        // Populate after save
        await inventory.populate('productId', 'productName sku');

        res.status(200).json({
            success: true,
            data: inventory,
            message: 'Reorder settings updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Stock History
export const getStockHistory = async (req, res) => {
    try {
        const { id } = req.params; // Change from productId to id
        const { page = 1, limit = 50, type, reason, days } = req.query;

        // Find inventory by productId first, then use the productId for history
        let productId = id;

        // If id is not a valid ObjectId, try to find the inventory record
        const inventory = await StoreInventory.findOne({ productId: id });
        if (inventory) {
            productId = inventory.productId;
        }

        // Build filter
        const filter = { productId };
        if (type) filter['transaction.type'] = type;
        if (reason) filter['transaction.reason'] = reason;

        // Add date filter if specified
        if (days && days !== 'all') {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - parseInt(days));
            filter.createdAt = { $gte: daysAgo };
        }

        const skip = (page - 1) * limit;

        const history = await StoreStockHistory.find(filter)
            .populate('productId', 'productName sku')
            .populate('performedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreStockHistory.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: history,
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

// Get Inventory Reports
export const getInventoryReports = async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Get inventory summary
        const totalInventory = await StoreInventory.countDocuments({ isActive: true });
        const lowStockCount = await StoreInventory.countDocuments({ 'alerts.lowStockAlert': true });
        const outOfStockCount = await StoreInventory.countDocuments({ 'alerts.outOfStockAlert': true });

        // Get total inventory value
        const inventoryValue = await StoreInventory.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, totalValue: { $sum: '$pricing.totalValue' } } }
        ]);

        // Get stock movements in the period
        const stockMovements = await StoreStockHistory.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$transaction.type',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$transaction.quantity' }
                }
            }
        ]);

        // Get top moving products
        const topMovingProducts = await StoreStockHistory.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$productId',
                    totalMovement: { $sum: '$transaction.quantity' },
                    transactionCount: { $sum: 1 }
                }
            },
            { $sort: { totalMovement: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'storeproducts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            }
        ]);

        const report = {
            summary: {
                totalProducts: totalInventory,
                lowStockItems: lowStockCount,
                outOfStockItems: outOfStockCount,
                totalInventoryValue: inventoryValue[0]?.totalValue || 0
            },
            stockMovements,
            topMovingProducts
        };

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Inventory (alias for getInventory)
export const getAllInventory = getInventory;

// Get Inventory by ID
export const getInventoryById = async (req, res) => {
    try {
        const inventory = await StoreInventory.findById(req.params.id)
            .populate('productId');

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Inventory
export const createInventory = async (req, res) => {
    try {
        const inventory = new StoreInventory(req.body);
        await inventory.save();

        res.status(201).json({
            success: true,
            data: inventory,
            message: 'Inventory created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Inventory
export const updateInventory = async (req, res) => {
    try {
        // Find the inventory first
        const inventory = await StoreInventory.findById(req.params.id);

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // If updating stock, also update the product
        let productUpdated = false;
        if (req.body.stock && req.body.stock.currentStock !== undefined) {
            const productToUpdate = await StoreProduct.findById(inventory.productId);
            if (productToUpdate) {
                productToUpdate.quantity = req.body.stock.currentStock;
                await productToUpdate.save();
                productUpdated = true;
                console.log(`Updated product ${inventory.productId} quantity to ${req.body.stock.currentStock}`);
            }
        }

        // Update the inventory object
        Object.keys(req.body).forEach(key => {
            inventory[key] = req.body[key];
        });

        // Save to trigger hooks
        await inventory.save();

        res.status(200).json({
            success: true,
            data: inventory,
            message: `Inventory updated successfully${productUpdated ? ' with product stock' : ''}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Inventory
export const deleteInventory = async (req, res) => {
    try {
        const inventory = await StoreInventory.findByIdAndDelete(req.params.id);

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Inventory deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Delete Inventory
export const bulkDeleteInventory = async (req, res) => {
    try {
        const { inventoryIds } = req.body;

        if (!inventoryIds || !Array.isArray(inventoryIds)) {
            return res.status(400).json({
                success: false,
                message: 'Inventory IDs array is required'
            });
        }

        const result = await StoreInventory.deleteMany({
            _id: { $in: inventoryIds }
        });

        res.status(200).json({
            success: true,
            data: { deletedCount: result.deletedCount },
            message: `${result.deletedCount} inventory items deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Inventory Alerts (alias for getLowStockAlerts)
export const getInventoryAlerts = getLowStockAlerts;

// Get Low Stock Items
export const getLowStockItems = async (req, res) => {
    try {
        const lowStockItems = await StoreInventory.find({
            $expr: {
                $lte: ['$stock.currentStock', '$thresholds.lowStockThreshold']
            }
        }).populate('productId');

        res.status(200).json({
            success: true,
            data: lowStockItems,
            count: lowStockItems.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Out of Stock Items
export const getOutOfStockItems = async (req, res) => {
    try {
        const outOfStockItems = await StoreInventory.find({
            'stock.currentStock': { $lte: 0 }
        }).populate('productId');

        res.status(200).json({
            success: true,
            data: outOfStockItems,
            count: outOfStockItems.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Generate Stock Report (alias for getInventoryReports)
export const generateStockReport = getInventoryReports;

// Export Inventory
export const exportInventory = async (req, res) => {
    try {
        const inventory = await StoreInventory.find({})
            .populate('productId')
            .lean();

        res.status(200).json({
            success: true,
            data: inventory,
            message: 'Inventory exported successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search Inventory
export const searchInventory = async (req, res) => {
    try {
        const { q, category, lowStock } = req.query;

        let pipeline = [
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
                $lookup: {
                    from: 'storecategories',
                    localField: 'product.categoryId',
                    foreignField: '_id',
                    as: 'product.category'
                }
            },
            {
                $lookup: {
                    from: 'storesubcategories',
                    localField: 'product.subcategoryId',
                    foreignField: '_id',
                    as: 'product.subcategory'
                }
            },
            {
                $addFields: {
                    'product.category': { $arrayElemAt: ['$product.category', 0] },
                    'product.subcategory': { $arrayElemAt: ['$product.subcategory', 0] }
                }
            }
        ];

        const matchConditions = {};

        if (q) {
            matchConditions.$or = [
                { 'product.productName': { $regex: q, $options: 'i' } },
                { sku: { $regex: q, $options: 'i' } }
            ];
        }

        if (category) {
            matchConditions['product.categoryId'] = category;
        }

        if (lowStock === 'true') {
            matchConditions.$expr = {
                $lte: ['$stock.currentStock', '$thresholds.lowStockThreshold']
            };
        }

        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }

        const inventory = await StoreInventory.aggregate(pipeline);

        res.status(200).json({
            success: true,
            data: inventory,
            count: inventory.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Adjust Stock
export const adjustStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { adjustment, reason, type = 'adjustment' } = req.body;

        const inventory = await StoreInventory.findById(id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        const oldStock = inventory.stock.currentStock;
        const newStock = Math.max(0, oldStock + adjustment);

        inventory.stock.currentStock = newStock;
        inventory.stock.availableStock = newStock - inventory.stock.reservedStock;
        await inventory.save();

        // Record in stock history
        await StoreStockHistory.create({
            productId: inventory.productId,
            transaction: {
                type: type,
                quantity: Math.abs(adjustment),
                direction: adjustment > 0 ? 'in' : 'out',
                reason: reason || 'Stock adjustment'
            },
            previousStock: oldStock,
            newStock: newStock,
            performedBy: req.user?.id || 'system'
        });

        res.status(200).json({
            success: true,
            data: inventory,
            message: 'Stock adjusted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reserve Stock
export const reserveStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, reason } = req.body;

        const inventory = await StoreInventory.findById(id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        if (inventory.stock.availableStock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient available stock'
            });
        }

        inventory.stock.reservedStock += quantity;
        inventory.stock.availableStock -= quantity;
        await inventory.save();

        // Record in stock history
        await StoreStockHistory.create({
            productId: inventory.productId,
            transaction: {
                type: 'reservation',
                quantity: quantity,
                direction: 'reserved',
                reason: reason || 'Stock reservation'
            },
            previousStock: inventory.stock.currentStock,
            newStock: inventory.stock.currentStock,
            performedBy: req.user?.id || 'system'
        });

        res.status(200).json({
            success: true,
            data: inventory,
            message: 'Stock reserved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Release Stock
export const releaseStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, reason } = req.body;

        const inventory = await StoreInventory.findById(id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        if (inventory.stock.reservedStock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Cannot release more than reserved stock'
            });
        }

        inventory.stock.reservedStock -= quantity;
        inventory.stock.availableStock += quantity;
        await inventory.save();

        // Record in stock history
        await StoreStockHistory.create({
            productId: inventory.productId,
            transaction: {
                type: 'release',
                quantity: quantity,
                direction: 'released',
                reason: reason || 'Stock release'
            },
            previousStock: inventory.stock.currentStock,
            newStock: inventory.stock.currentStock,
            performedBy: req.user?.id || 'system'
        });

        res.status(200).json({
            success: true,
            data: inventory,
            message: 'Stock released successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Transfer Stock
export const transferStock = async (req, res) => {
    try {
        const { fromProductId, toProductId, quantity, reason } = req.body;

        // Get both inventory items
        const fromInventory = await StoreInventory.findOne({ productId: fromProductId });
        const toInventory = await StoreInventory.findOne({ productId: toProductId });

        if (!fromInventory || !toInventory) {
            return res.status(404).json({
                success: false,
                message: 'One or both inventory items not found'
            });
        }

        if (fromInventory.stock.availableStock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock for transfer'
            });
        }

        // Update from inventory
        fromInventory.stock.currentStock -= quantity;
        fromInventory.stock.availableStock -= quantity;
        await fromInventory.save();

        // Update to inventory
        toInventory.stock.currentStock += quantity;
        toInventory.stock.availableStock += quantity;
        await toInventory.save();

        // Record history for both
        await StoreStockHistory.create({
            productId: fromProductId,
            transaction: {
                type: 'transfer',
                quantity: quantity,
                direction: 'out',
                reason: reason || 'Stock transfer',
                relatedProduct: toProductId
            },
            previousStock: fromInventory.stock.currentStock + quantity,
            newStock: fromInventory.stock.currentStock,
            performedBy: req.user?.id || 'system'
        });

        await StoreStockHistory.create({
            productId: toProductId,
            transaction: {
                type: 'transfer',
                quantity: quantity,
                direction: 'in',
                reason: reason || 'Stock transfer',
                relatedProduct: fromProductId
            },
            previousStock: toInventory.stock.currentStock - quantity,
            newStock: toInventory.stock.currentStock,
            performedBy: req.user?.id || 'system'
        });

        res.status(200).json({
            success: true,
            data: { fromInventory, toInventory },
            message: 'Stock transferred successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Audit Inventory
export const auditInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { actualStock, notes } = req.body;

        const inventory = await StoreInventory.findById(id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        const systemStock = inventory.stock.currentStock;
        const discrepancy = actualStock - systemStock;

        if (discrepancy !== 0) {
            // Update stock to actual count
            inventory.stock.currentStock = actualStock;
            inventory.stock.availableStock = actualStock - inventory.stock.reservedStock;
            await inventory.save();

            // Record the audit in history
            await StoreStockHistory.create({
                productId: inventory.productId,
                transaction: {
                    type: 'audit',
                    quantity: Math.abs(discrepancy),
                    direction: discrepancy > 0 ? 'in' : 'out',
                    reason: `Inventory audit: ${notes || 'Stock count adjustment'}`
                },
                previousStock: systemStock,
                newStock: actualStock,
                performedBy: req.user?.id || 'system',
                metadata: {
                    auditType: 'manual',
                    discrepancy: discrepancy,
                    notes: notes
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                inventory,
                audit: {
                    systemStock,
                    actualStock,
                    discrepancy,
                    notes
                }
            },
            message: discrepancy === 0 ? 'No discrepancy found' : 'Inventory adjusted based on audit'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Inventory Analytics
export const getInventoryAnalytics = async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;

        // Basic inventory stats
        const totalItems = await StoreInventory.countDocuments();
        const lowStockCount = await StoreInventory.countDocuments({
            $expr: { $lte: ['$stock.currentStock', '$thresholds.lowStockThreshold'] }
        });
        const outOfStockCount = await StoreInventory.countDocuments({
            'stock.currentStock': { $lte: 0 }
        });

        // Total inventory value
        const inventoryValue = await StoreInventory.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: {
                        $sum: {
                            $multiply: ['$stock.currentStock', '$pricing.costPrice']
                        }
                    }
                }
            }
        ]);

        // Recent stock movements
        const recentMovements = await StoreStockHistory.find({})
            .populate('productId', 'productName')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalItems,
                    lowStockCount,
                    outOfStockCount,
                    totalValue: inventoryValue[0]?.totalValue || 0
                },
                recentMovements
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Set Stock Alerts
export const setStockAlerts = async (req, res) => {
    try {
        const { id } = req.params;
        const { lowStockThreshold, reorderThreshold } = req.body;

        // Find inventory first
        const inventory = await StoreInventory.findById(id);

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Update fields directly
        if (lowStockThreshold !== undefined) {
            inventory.thresholds.lowStockThreshold = lowStockThreshold;

            // Update product lowStockThreshold as well
            const product = await StoreProduct.findById(inventory.productId);
            if (product) {
                product.lowStockThreshold = lowStockThreshold;
                await product.save();
                console.log(`Updated product ${inventory.productId} lowStockThreshold to ${lowStockThreshold}`);
            }
        }

        if (reorderThreshold !== undefined) {
            inventory.thresholds.reorderPoint = reorderThreshold;
        }

        // Save with hooks
        await inventory.save();

        res.status(200).json({
            success: true,
            data: inventory,
            message: 'Stock alerts updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Stock Alerts (alias for setStockAlerts)
export const updateStockAlerts = setStockAlerts;

// Delete Stock Alerts
export const deleteStockAlerts = async (req, res) => {
    try {
        const { id } = req.params;

        // Find inventory first
        const inventory = await StoreInventory.findById(id);

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Update product as well
        const product = await StoreProduct.findById(inventory.productId);
        if (product) {
            // Reset to default values instead of unsetting
            product.lowStockThreshold = 10; // Default value from schema
            await product.save();
            console.log(`Reset product ${inventory.productId} lowStockThreshold to default`);
        }

        // Reset to default values instead of unsetting
        inventory.thresholds.lowStockThreshold = 10;
        inventory.thresholds.reorderPoint = 5;

        // Save with hooks
        await inventory.save();

        res.status(200).json({
            success: true,
            data: inventory,
            message: 'Stock alerts removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Stock Movements (alias for getStockHistory)
export const getStockMovements = getStockHistory;

// Bulk Stock Adjustment
export const bulkStockAdjustment = async (req, res) => {
    try {
        const { adjustments } = req.body; // Array of { productId, adjustment, reason }

        if (!adjustments || !Array.isArray(adjustments)) {
            return res.status(400).json({
                success: false,
                message: 'Adjustments array is required'
            });
        }

        const results = [];

        for (const item of adjustments) {
            try {
                const inventory = await StoreInventory.findOne({ productId: item.productId });
                if (!inventory) {
                    results.push({
                        productId: item.productId,
                        success: false,
                        error: 'Inventory not found'
                    });
                    continue;
                }

                const oldStock = inventory.stock.currentStock;
                const newStock = Math.max(0, oldStock + item.adjustment);

                inventory.stock.currentStock = newStock;
                inventory.stock.availableStock = newStock - inventory.stock.reservedStock;
                await inventory.save();

                // Record in history
                await StoreStockHistory.create({
                    productId: item.productId,
                    transaction: {
                        type: 'bulk_adjustment',
                        quantity: Math.abs(item.adjustment),
                        direction: item.adjustment > 0 ? 'in' : 'out',
                        reason: item.reason || 'Bulk stock adjustment'
                    },
                    previousStock: oldStock,
                    newStock: newStock,
                    performedBy: req.user?.id || 'system'
                });

                results.push({
                    productId: item.productId,
                    success: true,
                    oldStock,
                    newStock
                });
            } catch (error) {
                results.push({
                    productId: item.productId,
                    success: false,
                    error: error.message
                });
            }
        }

        res.status(200).json({
            success: true,
            data: results,
            message: 'Bulk stock adjustment completed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Import Inventory
export const importInventory = async (req, res) => {
    try {
        const { inventoryData } = req.body; // Array of inventory objects

        if (!inventoryData || !Array.isArray(inventoryData)) {
            return res.status(400).json({
                success: false,
                message: 'Inventory data array is required'
            });
        }

        const results = [];

        for (const data of inventoryData) {
            try {
                const inventory = new StoreInventory(data);
                await inventory.save();
                results.push({
                    success: true,
                    data: inventory
                });
            } catch (error) {
                results.push({
                    success: false,
                    data: data,
                    error: error.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;

        res.status(200).json({
            success: true,
            data: results,
            message: `Import completed: ${successCount} successful, ${errorCount} failed`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Sync Inventory with Products
export const syncInventoryWithProducts = async (req, res) => {
    try {
        const products = await StoreProduct.find({});
        const results = [];

        for (const product of products) {
            try {
                let inventory = await StoreInventory.findOne({ productId: product._id });

                if (!inventory) {
                    // Create new inventory record
                    inventory = new StoreInventory({
                        productId: product._id,
                        sku: product.sku,
                        stock: {
                            currentStock: product.quantity || 0,
                            availableStock: product.quantity || 0,
                            reservedStock: 0
                        },
                        thresholds: {
                            lowStockThreshold: product.lowStockThreshold || 10,
                            reorderThreshold: product.reorderThreshold || 5
                        },
                        pricing: {
                            costPrice: product.costPrice || 0,
                            totalValue: (product.quantity || 0) * (product.costPrice || 0)
                        }
                    });
                    await inventory.save();
                    results.push({
                        productId: product._id,
                        action: 'created',
                        success: true
                    });
                } else {
                    // Update existing inventory
                    inventory.sku = product.sku;
                    inventory.pricing.costPrice = product.costPrice || inventory.pricing.costPrice;
                    inventory.pricing.totalValue = inventory.stock.currentStock * inventory.pricing.costPrice;
                    await inventory.save();
                    results.push({
                        productId: product._id,
                        action: 'updated',
                        success: true
                    });
                }
            } catch (error) {
                results.push({
                    productId: product._id,
                    action: 'failed',
                    success: false,
                    error: error.message
                });
            }
        }

        const createdCount = results.filter(r => r.action === 'created').length;
        const updatedCount = results.filter(r => r.action === 'updated').length;
        const failedCount = results.filter(r => r.action === 'failed').length;

        res.status(200).json({
            success: true,
            data: results,
            message: `Sync completed: ${createdCount} created, ${updatedCount} updated, ${failedCount} failed`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
