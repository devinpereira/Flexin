// Admin store models for integration
import StoreCategory from "../models/adminstore/StoreCategory.js";
import StoreProduct from "../models/adminstore/StoreProduct.js";

// Get All Categories
export const getCategories = async (req, res) => {
    try {
        const { isActive = true } = req.query;


        const filter = isActive === 'true' ? { isActive: true } : {};
        const categories = await StoreCategory.find(filter).sort({ name: 1 });


        const transformedCategories = categories.map(category => ({
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
            isActive: category.isActive,
            isFeatured: category.isFeatured,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        }));

        res.status(200).json({
            success: true,
            categories: transformedCategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};

// Get Single Category
export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }


        const category = await StoreCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Get products for this category from admin store
        const products = await StoreProduct.find({
            categoryId: id,
            status: 'active'
        }).limit(20);

        // Transform admin store category format to match expected user store format
        const transformedCategory = {
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
            isActive: category.isActive,
            isFeatured: category.isFeatured,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };

        // Transform products to match expected format
        const transformedProducts = products.map(product => ({
            _id: product._id,
            productName: product.productName,
            name: product.productName,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            // Transform images from {url, alt, isPrimary} to simple URL strings
            images: product.images && Array.isArray(product.images) ? product.images.map(img => {
                if (typeof img === 'string') return img;
                if (img && img.url) return img.url;
                return null;
            }).filter(Boolean) : [],
            stock: product.quantity || 0,
            quantity: product.quantity || 0,
            isActive: product.status === 'active',
            isFeatured: product.isFeatured,
            averageRating: product.averageRating || 0,
            reviewCount: product.reviewCount || 0
        }));

        res.status(200).json({
            success: true,
            category: transformedCategory,
            products: transformedProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching category",
            error: error.message
        });
    }
};

// Create Category
export const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        // Check if category already exists
        const existingCategory = await StoreCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
        }

        const category = new StoreCategory({
            name,
            description,
            image
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message
        });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        const category = await StoreCategory.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: error.message
        });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        // Check if category has products
        const productCount = await StoreProduct.countDocuments({ categoryId: id, isActive: true });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${productCount} products associated with it.`
            });
        }

        const category = await StoreCategory.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: error.message
        });
    }
};

// Get Subcategories
export const getSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { isActive = true } = req.query;

        let filter = { isActive };
        if (categoryId) {
            if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID"
                });
            }
            filter.categoryId = categoryId;
        }

        const subcategories = await StoreCategory.find(filter)
            .populate('categoryId', 'name')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            subcategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching subcategories",
            error: error.message
        });
    }
};

// Create Subcategory
export const createSubcategory = async (req, res) => {
    try {
        const { name, categoryId, description, image } = req.body;

        if (!name || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Name and category ID are required"
            });
        }

        if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        // Check if category exists
        const category = await StoreCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const subcategory = new StoreCategory({
            name,
            categoryId,
            description,
            image
        });

        await subcategory.save();
        await subcategory.populate('categoryId', 'name');

        res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            subcategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating subcategory",
            error: error.message
        });
    }
};
