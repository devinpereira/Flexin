import {
    StoreCategory,
    StoreSubcategory,
    StoreProduct,
    StoreMedia
} from "../../models/adminstore/index.js";
import { cloudinary } from "../../config/cloudinary.js";

// Get All Categories
export const getAllCategories = async (req, res) => {
    try {
        const { includeSubcategories = false } = req.query;

        let query = StoreCategory.find();

        if (includeSubcategories === 'true') {
            query = query.populate('subcategories');
        }

        const categories = await query.sort({ sortOrder: 1, createdAt: -1 });

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

// Get Single Category
export const getCategory = async (req, res) => {
    try {
        const category = await StoreCategory.findById(req.params.id)
            .populate('subcategories');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Category
export const addCategory = async (req, res) => {
    try {
        const categoryData = req.body;

        // Handle image upload
        if (req.file) {
            categoryData.image = {
                url: req.file.path,
                alt: categoryData.name
            };

            // Save media record
            await StoreMedia.create({
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: req.file.path,
                type: 'category',
                mimeType: req.file.mimetype,
                size: req.file.size,
                storage: {
                    provider: 'cloudinary',
                    providerId: req.file.public_id
                },
                associatedWith: {
                    entityType: 'StoreCategory'
                }
            });
        }

        const category = new StoreCategory(categoryData);
        await category.save();

        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Handle new image upload
        if (req.file) {
            // Delete old image if exists
            const existingCategory = await StoreCategory.findById(id);
            if (existingCategory && existingCategory.image && existingCategory.image.url) {
                const oldMedia = await StoreMedia.findOne({ url: existingCategory.image.url });
                if (oldMedia && oldMedia.storage.providerId) {
                    await cloudinary.uploader.destroy(oldMedia.storage.providerId);
                    await StoreMedia.findByIdAndDelete(oldMedia._id);
                }
            }

            updateData.image = {
                url: req.file.path,
                alt: updateData.name || 'Category image'
            };

            // Save new media record
            await StoreMedia.create({
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: req.file.path,
                type: 'category',
                mimeType: req.file.mimetype,
                size: req.file.size,
                storage: {
                    provider: 'cloudinary',
                    providerId: req.file.public_id
                },
                associatedWith: {
                    entityType: 'StoreCategory',
                    entityId: id
                }
            });
        }

        const category = await StoreCategory.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category,
            message: 'Category updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has products
        const productCount = await StoreProduct.countDocuments({ categoryId: id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${productCount} products are using this category.`
            });
        }

        const category = await StoreCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Delete associated media
        if (category.image && category.image.url) {
            const media = await StoreMedia.findOne({ url: category.image.url });
            if (media && media.storage.providerId) {
                await cloudinary.uploader.destroy(media.storage.providerId);
                await StoreMedia.findByIdAndDelete(media._id);
            }
        }

        // Delete subcategories
        await StoreSubcategory.deleteMany({ categoryId: id });

        // Delete category
        await StoreCategory.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Subcategory
export const addSubcategory = async (req, res) => {
    try {
        const { id: categoryId } = req.params;
        const subcategoryData = { ...req.body, categoryId };

        // Verify category exists
        const category = await StoreCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Handle image upload
        if (req.file) {
            subcategoryData.image = {
                url: req.file.path,
                alt: subcategoryData.name
            };

            // Save media record
            await StoreMedia.create({
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: req.file.path,
                type: 'category',
                mimeType: req.file.mimetype,
                size: req.file.size,
                storage: {
                    provider: 'cloudinary',
                    providerId: req.file.public_id
                },
                associatedWith: {
                    entityType: 'StoreSubcategory'
                }
            });
        }

        const subcategory = new StoreSubcategory(subcategoryData);
        await subcategory.save();

        // Add subcategory to category
        await StoreCategory.findByIdAndUpdate(categoryId, {
            $push: { subcategories: subcategory._id }
        });

        res.status(201).json({
            success: true,
            data: subcategory,
            message: 'Subcategory created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Subcategory
export const updateSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;
        const updateData = req.body;

        // Handle image upload
        if (req.file) {
            // Delete old image if exists
            const existingSubcategory = await StoreSubcategory.findById(subcategoryId);
            if (existingSubcategory && existingSubcategory.image && existingSubcategory.image.url) {
                const oldMedia = await StoreMedia.findOne({ url: existingSubcategory.image.url });
                if (oldMedia && oldMedia.storage.providerId) {
                    await cloudinary.uploader.destroy(oldMedia.storage.providerId);
                    await StoreMedia.findByIdAndDelete(oldMedia._id);
                }
            }

            updateData.image = {
                url: req.file.path,
                alt: updateData.name || 'Subcategory image'
            };

            // Save new media record
            await StoreMedia.create({
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: req.file.path,
                type: 'category',
                mimeType: req.file.mimetype,
                size: req.file.size,
                storage: {
                    provider: 'cloudinary',
                    providerId: req.file.public_id
                },
                associatedWith: {
                    entityType: 'StoreSubcategory',
                    entityId: subcategoryId
                }
            });
        }

        const subcategory = await StoreSubcategory.findOneAndUpdate(
            { _id: subcategoryId, categoryId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subcategory,
            message: 'Subcategory updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Subcategory
export const deleteSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;

        // Check if subcategory has products
        const productCount = await StoreProduct.countDocuments({ subcategoryId });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete subcategory. ${productCount} products are using this subcategory.`
            });
        }

        const subcategory = await StoreSubcategory.findOneAndDelete({
            _id: subcategoryId,
            categoryId
        });

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        // Delete associated media
        if (subcategory.image && subcategory.image.url) {
            const media = await StoreMedia.findOne({ url: subcategory.image.url });
            if (media && media.storage.providerId) {
                await cloudinary.uploader.destroy(media.storage.providerId);
                await StoreMedia.findByIdAndDelete(media._id);
            }
        }

        // Remove from category
        await StoreCategory.findByIdAndUpdate(categoryId, {
            $pull: { subcategories: subcategoryId }
        });

        res.status(200).json({
            success: true,
            message: 'Subcategory deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Category by ID (alias for getCategory)
export const getCategoryById = getCategory;

// Create Category (alias for addCategory)
export const createCategory = addCategory;

// Update Category Status
export const updateCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const category = await StoreCategory.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category,
            message: 'Category status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Update Categories
export const bulkUpdateCategories = async (req, res) => {
    try {
        const { categoryIds, updateData } = req.body;

        if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category IDs are required'
            });
        }

        const result = await StoreCategory.updateMany(
            { _id: { $in: categoryIds } },
            updateData
        );

        res.status(200).json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            },
            message: `${result.modifiedCount} categories updated successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Delete Categories
export const bulkDeleteCategories = async (req, res) => {
    try {
        const { categoryIds } = req.body;

        if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category IDs are required'
            });
        }

        // Delete associated media for each category
        for (const id of categoryIds) {
            const category = await StoreCategory.findById(id);
            if (category && category.image) {
                const media = await StoreMedia.findOne({ url: category.image });
                if (media && media.storage.providerId) {
                    await cloudinary.uploader.destroy(media.storage.providerId);
                    await StoreMedia.findByIdAndDelete(media._id);
                }
            }
        }

        const result = await StoreCategory.deleteMany({ _id: { $in: categoryIds } });

        res.status(200).json({
            success: true,
            data: {
                deletedCount: result.deletedCount
            },
            message: `${result.deletedCount} categories deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upload Category Image
export const uploadCategoryImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image uploaded'
            });
        }

        const category = await StoreCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Delete old image if exists
        if (category.image) {
            const oldMedia = await StoreMedia.findOne({ url: category.image });
            if (oldMedia && oldMedia.storage.providerId) {
                await cloudinary.uploader.destroy(oldMedia.storage.providerId);
                await StoreMedia.findByIdAndDelete(oldMedia._id);
            }
        }

        // Save new media record
        await StoreMedia.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: req.file.path,
            type: 'category',
            mimeType: req.file.mimetype,
            size: req.file.size,
            storage: {
                provider: 'cloudinary',
                providerId: req.file.public_id
            },
            associatedWith: {
                entityType: 'StoreCategory',
                entityId: id
            }
        });

        category.image = req.file.path;
        await category.save();

        res.status(200).json({
            success: true,
            data: category,
            message: 'Category image uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Category Image
export const deleteCategoryImage = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await StoreCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (!category.image) {
            return res.status(400).json({
                success: false,
                message: 'Category has no image to delete'
            });
        }

        // Delete from cloudinary
        const media = await StoreMedia.findOne({ url: category.image });
        if (media && media.storage.providerId) {
            await cloudinary.uploader.destroy(media.storage.providerId);
            await StoreMedia.findByIdAndDelete(media._id);
        }

        category.image = null;
        await category.save();

        res.status(200).json({
            success: true,
            data: category,
            message: 'Category image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Category Products
export const getCategoryProducts = async (req, res) => {
    try {
        const { id } = req.params;

        const products = await StoreProduct.find({ categoryId: id })
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

// Get All Subcategories
export const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await StoreSubcategory.find({})
            .populate('categoryId');

        res.status(200).json({
            success: true,
            data: subcategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Subcategory by ID
export const getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await StoreSubcategory.findById(req.params.id)
            .populate('categoryId');

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subcategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Subcategory (alias for addSubcategory)
export const createSubcategory = addSubcategory;

// Update Subcategory Status
export const updateSubcategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const subcategory = await StoreSubcategory.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subcategory,
            message: 'Subcategory status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Update Subcategories
export const bulkUpdateSubcategories = async (req, res) => {
    try {
        const { subcategoryIds, updateData } = req.body;

        if (!subcategoryIds || !Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory IDs are required'
            });
        }

        const result = await StoreSubcategory.updateMany(
            { _id: { $in: subcategoryIds } },
            updateData
        );

        res.status(200).json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            },
            message: `${result.modifiedCount} subcategories updated successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Delete Subcategories
export const bulkDeleteSubcategories = async (req, res) => {
    try {
        const { subcategoryIds } = req.body;

        if (!subcategoryIds || !Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory IDs are required'
            });
        }

        // Delete associated media for each subcategory
        for (const id of subcategoryIds) {
            const subcategory = await StoreSubcategory.findById(id);
            if (subcategory && subcategory.image) {
                const media = await StoreMedia.findOne({ url: subcategory.image });
                if (media && media.storage.providerId) {
                    await cloudinary.uploader.destroy(media.storage.providerId);
                    await StoreMedia.findByIdAndDelete(media._id);
                }
            }
        }

        const result = await StoreSubcategory.deleteMany({ _id: { $in: subcategoryIds } });

        res.status(200).json({
            success: true,
            data: {
                deletedCount: result.deletedCount
            },
            message: `${result.deletedCount} subcategories deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upload Subcategory Image
export const uploadSubcategoryImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image uploaded'
            });
        }

        const subcategory = await StoreSubcategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        // Delete old image if exists
        if (subcategory.image) {
            const oldMedia = await StoreMedia.findOne({ url: subcategory.image });
            if (oldMedia && oldMedia.storage.providerId) {
                await cloudinary.uploader.destroy(oldMedia.storage.providerId);
                await StoreMedia.findByIdAndDelete(oldMedia._id);
            }
        }

        // Save new media record
        await StoreMedia.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: req.file.path,
            type: 'subcategory',
            mimeType: req.file.mimetype,
            size: req.file.size,
            storage: {
                provider: 'cloudinary',
                providerId: req.file.public_id
            },
            associatedWith: {
                entityType: 'StoreSubcategory',
                entityId: id
            }
        });

        subcategory.image = req.file.path;
        await subcategory.save();

        res.status(200).json({
            success: true,
            data: subcategory,
            message: 'Subcategory image uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Subcategory Image
export const deleteSubcategoryImage = async (req, res) => {
    try {
        const { id } = req.params;

        const subcategory = await StoreSubcategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        if (!subcategory.image) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory has no image to delete'
            });
        }

        // Delete from cloudinary
        const media = await StoreMedia.findOne({ url: subcategory.image });
        if (media && media.storage.providerId) {
            await cloudinary.uploader.destroy(media.storage.providerId);
            await StoreMedia.findByIdAndDelete(media._id);
        }

        subcategory.image = null;
        await subcategory.save();

        res.status(200).json({
            success: true,
            data: subcategory,
            message: 'Subcategory image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Subcategory Products
export const getSubcategoryProducts = async (req, res) => {
    try {
        const { id } = req.params;

        const products = await StoreProduct.find({ subcategoryId: id })
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

// Get Categories with Subcategories
export const getCategoriesWithSubcategories = async (req, res) => {
    try {
        const categories = await StoreCategory.find({ status: 'active' });
        const categoriesWithSubs = [];

        for (const category of categories) {
            const subcategories = await StoreSubcategory.find({
                categoryId: category._id,
                status: 'active'
            });

            categoriesWithSubs.push({
                ...category.toObject(),
                subcategories
            });
        }

        res.status(200).json({
            success: true,
            data: categoriesWithSubs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reorder Categories
export const reorderCategories = async (req, res) => {
    try {
        const { categoryOrders } = req.body; // Array of { id, order }

        if (!categoryOrders || !Array.isArray(categoryOrders)) {
            return res.status(400).json({
                success: false,
                message: 'Category orders array is required'
            });
        }

        for (const item of categoryOrders) {
            await StoreCategory.findByIdAndUpdate(item.id, { order: item.order });
        }

        res.status(200).json({
            success: true,
            message: 'Categories reordered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reorder Subcategories
export const reorderSubcategories = async (req, res) => {
    try {
        const { subcategoryOrders } = req.body; // Array of { id, order }

        if (!subcategoryOrders || !Array.isArray(subcategoryOrders)) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory orders array is required'
            });
        }

        for (const item of subcategoryOrders) {
            await StoreSubcategory.findByIdAndUpdate(item.id, { order: item.order });
        }

        res.status(200).json({
            success: true,
            message: 'Subcategories reordered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
