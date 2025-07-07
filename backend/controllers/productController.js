import Product from "../models/Product.js";
import ProductReview from "../models/ProductReview.js";
import Category from "../models/Catergory.js";
import Subcategory from "../models/Subcategory.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";
import PaymentMethod from "../models/PaymentMethod.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
// Admin store models for integration
import StoreProduct from "../models/adminstore/StoreProduct.js";
import StoreCategory from "../models/adminstore/StoreCategory.js";
import StoreProductReview from "../models/adminstore/StoreProductReview.js";

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      isFeatured,
      isActive = true
    } = req.query;

    // Build filter object - using admin store model structure
    const filter = { isActive: true }; // Use isActive for now, will check both status and isActive

    if (category) filter.categoryId = category;
    if (subcategory) filter.subcategoryId = subcategory;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: 'i' } }, // StoreProduct uses 'productName'
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch from admin store products instead of regular products
    const products = await StoreProduct.find(filter)
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await StoreProduct.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    // Transform admin store product format to match expected user store format
    const transformedProducts = products.map(product => ({
      _id: product._id,
      productName: product.productName, 
      name: product.productName,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      brand: product.brand,
      // Transform images from {url, alt, isPrimary} to simple URL strings
      images: product.images && Array.isArray(product.images) ? product.images.map(img => {
        if (typeof img === 'string') return img; 
        if (img && img.url) return img.url; 
        return null; // Invalid image entry
      }).filter(Boolean) : [], // Filter out null values
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      category: product.categoryId,
      subcategory: product.subcategoryId,
      stock: product.quantity || 0,
      quantity: product.quantity || 0,
      isActive: product.status === 'active' || product.isActive,
      isFeatured: product.isFeatured,
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      tags: product.tags,
      specifications: product.specifications || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    res.status(200).json({
      success: true,
      products: transformedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      // Debug info
      debug: {
        filter,
        productsFound: products.length,
        totalInDB: totalProducts
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Fetch from admin store product instead of regular product
    const product = await StoreProduct.findOne({ _id: id, isActive: true })
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Get product reviews from admin store
    const reviews = await StoreProductReview.find({ productId: id })
      .populate('userId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    // Transform admin store product format to match expected user store format
    const transformedProduct = {
      _id: product._id,
      productName: product.productName, 
      name: product.productName,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage || 0,
      brand: product.brand,
      // Transform images from {url, alt, isPrimary} to simple URL strings
      images: product.images && Array.isArray(product.images) ? product.images.map(img => {
        if (typeof img === 'string') return img; 
        if (img && img.url) return img.url; 
        return null; // Invalid image entry
      }).filter(Boolean) : [], // Filter out null values
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      category: product.categoryId,
      subcategory: product.subcategoryId,
      stock: product.quantity || 0,
      quantity: product.quantity || 0,
      isActive: product.status === 'active' || product.isActive,
      isFeatured: product.isFeatured,
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      tags: product.tags,
      specifications: product.specifications || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    res.status(200).json({
      success: true,
      product: transformedProduct,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    });
  }
};

// Add New Product
export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      shortDescription,
      price,
      originalPrice,
      discountPercentage = 0,
      quantity,
      images = [],
      categoryId,
      subcategoryId,
      brand,
      isFeatured = false,
      specifications = []
    } = req.body;

    // Validation
    if (!productName || !description || !price || !quantity || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: productName, description, price, quantity, categoryId"
      });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    // Validate subcategory if provided
    if (subcategoryId) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID"
        });
      }
    }

    // Create new product
    const product = new Product({
      productName,
      description,
      shortDescription,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      discountPercentage: parseFloat(discountPercentage),
      quantity: parseInt(quantity),
      images,
      categoryId,
      subcategoryId,
      brand,
      isFeatured,
      specifications
    });

    await product.save();

    // Populate the response
    await product.populate('categoryId', 'name description');
    if (subcategoryId) {
      await product.populate('subcategoryId', 'name description');
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message
    });
  }
};

// Update Product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Validate category if being updated
    if (updates.categoryId) {
      const category = await Category.findById(updates.categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID"
        });
      }
    }

    // Validate subcategory if being updated
    if (updates.subcategoryId) {
      const subcategory = await Subcategory.findById(updates.subcategoryId);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID"
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message
    });
  }
};

// Add Product Review
export const addProductReview = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user already reviewed this product
    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    // Create new review
    const review = new ProductReview({
      productId,
      userId,
      rating: parseInt(rating),
      comment
    });

    await review.save();
    await review.populate('userId', 'fullName profileImageUrl');

    // Update product average rating and review count
    const reviews = await ProductReview.find({ productId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message
    });
  }
};

// Get Product Reviews
export const getProductReviews = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch reviews from admin store instead of regular product reviews
    const reviews = await StoreProductReview.find({ productId })
      .populate('userId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await StoreProductReview.countDocuments({ productId });
    const totalPages = Math.ceil(totalReviews / parseInt(limit));

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};

// Debug function to check admin store data - TEMPORARY
export const debugStoreData = async (req, res) => {
  try {
    const totalProducts = await StoreProduct.countDocuments();
    const activeProducts = await StoreProduct.countDocuments({ isActive: true });
    const featuredProducts = await StoreProduct.countDocuments({ isFeatured: true });
    const products = await StoreProduct.find().limit(5); // Get first 5 products

    const totalCategories = await StoreCategory.countDocuments();
    const activeCategories = await StoreCategory.countDocuments({ isActive: true });
    const categories = await StoreCategory.find().limit(5); // Get first 5 categories

    // Transform a sample product to show the image transformation
    const sampleTransformedProducts = products.map(product => ({
      _id: product._id,
      productName: product.productName,
      price: product.price,
      originalImages: product.images,
      transformedImages: product.images ? product.images.map(img => img.url || img) : [],
      isActive: product.isActive,
      isFeatured: product.isFeatured
    }));

    res.status(200).json({
      success: true,
      debug: {
        products: {
          total: totalProducts,
          active: activeProducts,
          featured: featuredProducts,
          sampleTransformed: sampleTransformedProducts
        },
        categories: {
          total: totalCategories,
          active: activeCategories,
          sample: categories
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Debug error",
      error: error.message
    });
  }
};
