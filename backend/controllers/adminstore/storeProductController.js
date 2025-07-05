import {
    StoreProduct,
    StoreCategory,
    StoreSubcategory,
    StoreInventory,
    StoreMedia
} from "../../models/adminstore/index.js";
import { cloudinary } from "../../config/cloudinary.js";
import mongoose from "mongoose";
import ProductReview from "../../models/ProductReview.js";

// Get All Products (Admin)
export const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            category,
            subcategory,
            status,
            isFeatured,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // Handle category filtering - support both ObjectId and category name
        if (category) {
            if (mongoose.Types.ObjectId.isValid(category)) {
                // If valid ObjectId, use it directly
                filter.categoryId = category;
            } else {
                // If not ObjectId, find category by name
                const categoryDoc = await StoreCategory.findOne({ name: { $regex: category, $options: 'i' } });
                if (categoryDoc) {
                    filter.categoryId = categoryDoc._id;
                } else {
                    // If category not found, return empty results
                    return res.status(200).json({
                        success: true,
                        data: [],
                        pagination: {
                            currentPage: 1,
                            totalPages: 0,
                            totalProducts: 0,
                            hasNextPage: false,
                            hasPrevPage: false
                        }
                    });
                }
            }
        }

        if (subcategory) filter.subcategoryId = subcategory;
        if (status) filter.status = status;
        if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const products = await StoreProduct.find(filter)
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreProduct.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: products,
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

// Get Single Product
export const getProduct = async (req, res) => {
    try {
        const product = await StoreProduct.findById(req.params.id)
            .populate('categoryId')
            .populate('subcategoryId');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Product
export const addProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Parse JSON fields that come as strings from FormData
        if (typeof productData.attributes === 'string') {
            try {
                productData.attributes = JSON.parse(productData.attributes);
            } catch (e) {
                productData.attributes = [];
            }
        }

        if (typeof productData.tags === 'string') {
            try {
                productData.tags = JSON.parse(productData.tags);
            } catch (e) {
                productData.tags = [];
            }
        }

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            const images = req.files.map((file, index) => ({
                url: file.path,
                alt: productData.productName,
                isPrimary: index === 0
            }));
            productData.images = images;

            // Save media records
            for (const file of req.files) {
                await StoreMedia.create({
                    filename: file.filename,
                    originalName: file.originalname,
                    url: file.path,
                    type: 'product',
                    mimeType: file.mimetype,
                    size: file.size,
                    storage: {
                        provider: 'cloudinary',
                        providerId: file.public_id
                    },
                    associatedWith: {
                        entityType: 'StoreProduct'
                    }
                });
            }
        }

        const product = new StoreProduct(productData);
        await product.save();

        // Create inventory record
        await StoreInventory.create({
            productId: product._id,
            sku: product.sku,
            stock: {
                currentStock: product.quantity,
                availableStock: product.quantity
            },
            thresholds: {
                lowStockThreshold: product.lowStockThreshold || 10
            },
            pricing: {
                costPrice: product.costPrice
            }
        });

        const populatedProduct = await StoreProduct.findById(product._id)
            .populate('categoryId')
            .populate('subcategoryId');

        res.status(201).json({
            success: true,
            data: populatedProduct,
            message: 'Product created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Parse JSON fields that come as strings from FormData
        if (typeof updateData.attributes === 'string') {
            try {
                updateData.attributes = JSON.parse(updateData.attributes);
            } catch (e) {
                updateData.attributes = [];
            }
        }

        if (typeof updateData.tags === 'string') {
            try {
                updateData.tags = JSON.parse(updateData.tags);
            } catch (e) {
                updateData.tags = [];
            }
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                url: file.path,
                alt: updateData.productName || 'Product image',
                isPrimary: index === 0 && (!updateData.images || updateData.images.length === 0)
            }));

            updateData.images = updateData.images ? [...updateData.images, ...newImages] : newImages;

            // Save media records
            for (const file of req.files) {
                await StoreMedia.create({
                    filename: file.filename,
                    originalName: file.originalname,
                    url: file.path,
                    type: 'product',
                    mimeType: file.mimetype,
                    size: file.size,
                    storage: {
                        provider: 'cloudinary',
                        providerId: file.public_id
                    },
                    associatedWith: {
                        entityType: 'StoreProduct',
                        entityId: id
                    }
                });
            }
        }

        const product = await StoreProduct.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).populate('categoryId').populate('subcategoryId');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update inventory if quantity changed
        if (updateData.quantity !== undefined) {
            await StoreInventory.findOneAndUpdate(
                { productId: id },
                {
                    'stock.currentStock': updateData.quantity,
                    'stock.availableStock': updateData.quantity
                }
            );
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await StoreProduct.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete associated media from cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                const media = await StoreMedia.findOne({ url: image.url });
                if (media && media.storage.providerId) {
                    await cloudinary.uploader.destroy(media.storage.providerId);
                    await StoreMedia.findByIdAndDelete(media._id);
                }
            }
        }

        // Delete inventory record
        await StoreInventory.findOneAndDelete({ productId: id });

        // Delete product
        await StoreProduct.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Product Status
export const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const product = await StoreProduct.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'Product status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Update Products
export const bulkUpdateProducts = async (req, res) => {
    try {
        const { productIds, updateData } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product IDs are required'
            });
        }

        const result = await StoreProduct.updateMany(
            { _id: { $in: productIds } },
            updateData
        );

        res.status(200).json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            },
            message: `${result.modifiedCount} products updated successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product Analytics
export const getProductAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const { period = 'monthly' } = req.query;

        const product = await StoreProduct.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Basic analytics from product data
        const analytics = {
            basicStats: {
                viewCount: product.viewCount || 0,
                salesCount: product.salesCount || 0,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
                currentStock: product.quantity || 0
            },
            profitability: {
                profit: product.price - product.costPrice,
                profitMargin: product.profitMargin || 0
            }
        };

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

// Get Product by ID (alias for getProduct)
export const getProductById = getProduct;

// Create Product (alias for addProduct)
export const createProduct = addProduct;

// Bulk Delete Products
export const bulkDeleteProducts = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product IDs are required'
            });
        }

        // Delete associated media for each product
        for (const id of productIds) {
            const product = await StoreProduct.findById(id);
            if (product && product.images && product.images.length > 0) {
                for (const image of product.images) {
                    const media = await StoreMedia.findOne({ url: image.url });
                    if (media && media.storage.providerId) {
                        await cloudinary.uploader.destroy(media.storage.providerId);
                        await StoreMedia.findByIdAndDelete(media._id);
                    }
                }
            }
        }

        // Delete inventory records
        await StoreInventory.deleteMany({ productId: { $in: productIds } });

        // Delete products
        const result = await StoreProduct.deleteMany({ _id: { $in: productIds } });

        res.status(200).json({
            success: true,
            data: {
                deletedCount: result.deletedCount
            },
            message: `${result.deletedCount} products deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export Products
export const exportProducts = async (req, res) => {
    try {
        const products = await StoreProduct.find({})
            .populate('categoryId')
            .populate('subcategoryId')
            .lean();

        res.status(200).json({
            success: true,
            data: products,
            message: 'Products exported successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search Products
export const searchProducts = async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, rating } = req.query;

        const filter = {};

        if (q) {
            filter.$or = [
                { productName: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { sku: { $regex: q, $options: 'i' } }
            ];
        }

        if (category) filter.categoryId = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (rating) filter.averageRating = { $gte: parseFloat(rating) };

        const products = await StoreProduct.find(filter)
            .populate('categoryId')
            .populate('subcategoryId');

        res.status(200).json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Featured Products
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await StoreProduct.find({ isFeatured: true, status: 'active' })
            .populate('categoryId')
            .populate('subcategoryId')
            .limit(20);

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Featured Status
export const updateFeaturedStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isFeatured } = req.body;

        const product = await StoreProduct.findByIdAndUpdate(
            id,
            { isFeatured },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'Featured status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upload Product Images
export const uploadProductImages = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images uploaded'
            });
        }

        const product = await StoreProduct.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const newImages = req.files.map(file => ({
            url: file.path,
            alt: product.productName,
            isPrimary: false
        }));

        // Save media records
        for (const file of req.files) {
            await StoreMedia.create({
                filename: file.filename,
                originalName: file.originalname,
                url: file.path,
                type: 'product',
                mimeType: file.mimetype,
                size: file.size,
                storage: {
                    provider: 'cloudinary',
                    providerId: file.public_id
                },
                associatedWith: {
                    entityType: 'StoreProduct',
                    entityId: id
                }
            });
        }

        product.images = [...(product.images || []), ...newImages];
        await product.save();

        res.status(200).json({
            success: true,
            data: product,
            message: 'Images uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Product Image
export const deleteProductImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;

        const product = await StoreProduct.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        const imageUrl = product.images[imageIndex].url;

        // Delete from cloudinary
        const media = await StoreMedia.findOne({ url: imageUrl });
        if (media && media.storage.providerId) {
            await cloudinary.uploader.destroy(media.storage.providerId);
            await StoreMedia.findByIdAndDelete(media._id);
        }

        // Remove from product
        product.images.splice(imageIndex, 1);
        await product.save();

        res.status(200).json({
            success: true,
            data: product,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Placeholder functions for variant management (if needed later)
export const getProductVariants = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: [],
            message: 'Variants feature not implemented yet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createProductVariant = async (req, res) => {
    try {
        res.status(501).json({
            success: false,
            message: 'Variants feature not implemented yet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProductVariant = async (req, res) => {
    try {
        res.status(501).json({
            success: false,
            message: 'Variants feature not implemented yet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProductVariant = async (req, res) => {
    try {
        res.status(501).json({
            success: false,
            message: 'Variants feature not implemented yet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Inventory Stock
export const updateInventoryStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await StoreProduct.findByIdAndUpdate(
            id,
            { quantity },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update inventory
        await StoreInventory.findOneAndUpdate(
            { productId: id },
            {
                'stock.currentStock': quantity,
                'stock.availableStock': quantity
            }
        );

        res.status(200).json({
            success: true,
            data: product,
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
        const { updates } = req.body; // Array of { productId, quantity }

        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({
                success: false,
                message: 'Updates array is required'
            });
        }

        const results = [];
        for (const update of updates) {
            try {
                await StoreProduct.findByIdAndUpdate(update.productId, { quantity: update.quantity });
                await StoreInventory.findOneAndUpdate(
                    { productId: update.productId },
                    {
                        'stock.currentStock': update.quantity,
                        'stock.availableStock': update.quantity
                    }
                );
                results.push({ productId: update.productId, success: true });
            } catch (error) {
                results.push({ productId: update.productId, success: false, error: error.message });
            }
        }

        res.status(200).json({
            success: true,
            data: results,
            message: 'Bulk stock update completed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Clone Product
export const cloneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { newName, newSku } = req.body;

        const originalProduct = await StoreProduct.findById(id).lean();
        if (!originalProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Create cloned product
        const clonedProduct = {
            ...originalProduct,
            _id: undefined,
            productName: newName || `${originalProduct.productName} - Copy`,
            sku: newSku || `${originalProduct.sku}-copy`,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newProduct = new StoreProduct(clonedProduct);
        await newProduct.save();

        // Create inventory record
        await StoreInventory.create({
            productId: newProduct._id,
            sku: newProduct.sku,
            stock: {
                currentStock: 0,
                availableStock: 0
            },
            thresholds: {
                lowStockThreshold: originalProduct.lowStockThreshold || 10
            },
            pricing: {
                costPrice: originalProduct.costPrice
            }
        });

        res.status(201).json({
            success: true,
            data: newProduct,
            message: 'Product cloned successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product Reviews
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await ProductReview.find({ productId })
            .populate('userId', 'firstName lastName email profilePicture')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalReviews = await ProductReview.countDocuments({ productId });

        // Calculate average rating
        const avgRating = await ProductReview.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: null, averageRating: { $avg: '$rating' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                totalReviews,
                averageRating: avgRating[0]?.averageRating || 0,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalReviews,
                    pages: Math.ceil(totalReviews / limit)
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