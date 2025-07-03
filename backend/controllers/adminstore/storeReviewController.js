import {
    StoreProductReview,
    StoreProduct,
    StoreMedia
} from "../../models/adminstore/index.js";
import User from "../../models/User.js";

// Get All Reviews
export const getAllReviews = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            rating,
            productId,
            userId,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter['moderation.status'] = status;
        if (rating) filter['review.rating'] = parseInt(rating);
        if (productId) filter.productId = productId;
        if (userId) filter.userId = userId;
        if (search) {
            filter.$or = [
                { 'review.title': { $regex: search, $options: 'i' } },
                { 'review.comment': { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const reviews = await StoreProductReview.find(filter)
            .populate('productId', 'productName sku images')
            .populate('userId', 'name email')
            .populate('moderation.moderatedBy', 'name')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreProductReview.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: reviews,
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

// Get Product Reviews
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const {
            page = 1,
            limit = 20,
            status = 'approved',
            rating
        } = req.query;

        const filter = {
            productId,
            'moderation.status': status
        };

        if (rating) filter['review.rating'] = parseInt(rating);

        const skip = (page - 1) * limit;

        const reviews = await StoreProductReview.find(filter)
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreProductReview.countDocuments(filter);

        // Get rating statistics
        const ratingStats = await StoreProductReview.aggregate([
            { $match: { productId, 'moderation.status': 'approved' } },
            {
                $group: {
                    _id: '$review.rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                ratingStats
            },
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

// Approve Review
export const approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { moderatorNotes } = req.body;

        const review = await StoreProductReview.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Update review status
        review.moderation.status = 'approved';
        review.moderation.moderatedAt = new Date();
        if (moderatorNotes) review.moderation.moderatorNotes = moderatorNotes;
        review.moderation.moderatedBy = req.user?._id;

        await review.save();

        // Update product rating
        await updateProductRating(review.productId);

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review approved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reject Review
export const rejectReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { moderatorNotes } = req.body;

        const review = await StoreProductReview.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Update review status
        review.moderation.status = 'rejected';
        review.moderation.moderatedAt = new Date();
        if (moderatorNotes) review.moderation.moderatorNotes = moderatorNotes;
        review.moderation.moderatedBy = req.user?._id;

        await review.save();

        // Update product rating (excluding rejected reviews)
        await updateProductRating(review.productId);

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review rejected successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await StoreProductReview.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const productId = review.productId;

        // Delete associated media if any
        if (review.media.images && review.media.images.length > 0) {
            for (const image of review.media.images) {
                const media = await StoreMedia.findOne({ url: image.url });
                if (media && media.storage.providerId) {
                    await cloudinary.uploader.destroy(media.storage.providerId);
                    await StoreMedia.findByIdAndDelete(media._id);
                }
            }
        }

        await StoreProductReview.findByIdAndDelete(id);

        // Update product rating
        await updateProductRating(productId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Pending Reviews
export const getPendingReviews = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await StoreProductReview.find({ 'moderation.status': 'pending' })
            .populate('productId', 'productName sku images')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StoreProductReview.countDocuments({ 'moderation.status': 'pending' });

        res.status(200).json({
            success: true,
            data: reviews,
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

// Bulk Moderate Reviews
export const bulkModerateReviews = async (req, res) => {
    try {
        const { reviewIds, action, moderatorNotes } = req.body;

        if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Review IDs are required'
            });
        }

        if (!['approve', 'reject', 'delete'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action'
            });
        }

        const productIds = new Set();

        for (const reviewId of reviewIds) {
            const review = await StoreProductReview.findById(reviewId);
            if (review) {
                productIds.add(review.productId.toString());

                if (action === 'delete') {
                    await StoreProductReview.findByIdAndDelete(reviewId);
                } else {
                    review.moderation.status = action === 'approve' ? 'approved' : 'rejected';
                    review.moderation.moderatedAt = new Date();
                    if (moderatorNotes) review.moderation.moderatorNotes = moderatorNotes;
                    review.moderation.moderatedBy = req.user?._id;
                    await review.save();
                }
            }
        }

        // Update product ratings for affected products
        for (const productId of productIds) {
            await updateProductRating(productId);
        }

        res.status(200).json({
            success: true,
            message: `${reviewIds.length} reviews ${action}d successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Review by ID
export const getReviewById = async (req, res) => {
    try {
        const review = await StoreProductReview.findById(req.params.id)
            .populate('productId', 'productName')
            .populate('userId', 'name email');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Review
export const createReview = async (req, res) => {
    try {
        const reviewData = req.body;

        // Handle media uploads if any
        if (req.files && req.files.length > 0) {
            const media = req.files.map(file => ({
                url: file.path,
                type: file.mimetype.startsWith('image') ? 'image' : 'video',
                alt: 'Review media'
            }));
            reviewData.media = media;
        }

        const review = new StoreProductReview(reviewData);
        await review.save();

        // Update product rating
        await updateProductRating(review.productId);

        res.status(201).json({
            success: true,
            data: review,
            message: 'Review created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Handle new media uploads
        if (req.files && req.files.length > 0) {
            const newMedia = req.files.map(file => ({
                url: file.path,
                type: file.mimetype.startsWith('image') ? 'image' : 'video',
                alt: 'Review media'
            }));
            updateData.media = [...(updateData.media || []), ...newMedia];
        }

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Update product rating
        await updateProductRating(review.productId);

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Update Reviews
export const bulkUpdateReviews = async (req, res) => {
    try {
        const { reviewIds, updateData } = req.body;

        if (!reviewIds || !Array.isArray(reviewIds)) {
            return res.status(400).json({
                success: false,
                message: 'Review IDs array is required'
            });
        }

        const result = await StoreProductReview.updateMany(
            { _id: { $in: reviewIds } },
            updateData
        );

        res.status(200).json({
            success: true,
            data: { modifiedCount: result.modifiedCount },
            message: `${result.modifiedCount} reviews updated successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Delete Reviews
export const bulkDeleteReviews = async (req, res) => {
    try {
        const { reviewIds } = req.body;

        if (!reviewIds || !Array.isArray(reviewIds)) {
            return res.status(400).json({
                success: false,
                message: 'Review IDs array is required'
            });
        }

        const result = await StoreProductReview.deleteMany({
            _id: { $in: reviewIds }
        });

        res.status(200).json({
            success: true,
            data: { deletedCount: result.deletedCount },
            message: `${result.deletedCount} reviews deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Review Analytics
export const getReviewAnalytics = async (req, res) => {
    try {
        const totalReviews = await StoreProductReview.countDocuments();
        const pendingReviews = await StoreProductReview.countDocuments({ status: 'pending' });
        const approvedReviews = await StoreProductReview.countDocuments({ status: 'approved' });

        const ratingDistribution = await StoreProductReview.aggregate([
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalReviews,
                    pendingReviews,
                    approvedReviews
                },
                ratingDistribution
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export Reviews
export const exportReviews = async (req, res) => {
    try {
        const reviews = await StoreProductReview.find({})
            .populate('productId', 'productName')
            .populate('userId', 'name email')
            .lean();

        res.status(200).json({
            success: true,
            data: reviews,
            message: 'Reviews exported successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search Reviews
export const searchReviews = async (req, res) => {
    try {
        const { q, rating, status } = req.query;

        const filter = {};

        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { review: { $regex: q, $options: 'i' } }
            ];
        }

        if (rating) filter.rating = parseInt(rating);
        if (status) filter.status = status;

        const reviews = await StoreProductReview.find(filter)
            .populate('productId', 'productName')
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Reviews by Rating
export const getReviewsByRating = async (req, res) => {
    try {
        const { rating } = req.params;
        const reviews = await StoreProductReview.find({ rating: parseInt(rating) })
            .populate('productId', 'productName')
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Reviews by Status
export const getReviewsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const reviews = await StoreProductReview.find({ status })
            .populate('productId', 'productName')
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Reviews by Date Range
export const getReviewsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const reviews = await StoreProductReview.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('productId', 'productName').populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Flag Review
export const flagReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            {
                isFlagged: true,
                flagReason: reason || 'Inappropriate content'
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review flagged successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Unflag Review
export const unflagReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            {
                isFlagged: false,
                $unset: { flagReason: '' }
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review unflagged successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Flagged Reviews
export const getFlaggedReviews = async (req, res) => {
    try {
        const reviews = await StoreProductReview.find({ isFlagged: true })
            .populate('productId', 'productName')
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export alias for getProductReviews
export const getReviewsByProduct = getProductReviews;

// Get Approved Reviews
export const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await StoreProductReview.find({ status: 'approved' })
            .populate('productId', 'productName sku')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Rejected Reviews
export const getRejectedReviews = async (req, res) => {
    try {
        const reviews = await StoreProductReview.find({ status: 'rejected' })
            .populate('productId', 'productName sku')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Approve Reviews
export const bulkApproveReviews = async (req, res) => {
    try {
        const { reviewIds } = req.body;

        if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Review IDs are required'
            });
        }

        const result = await StoreProductReview.updateMany(
            { _id: { $in: reviewIds } },
            {
                status: 'approved',
                moderatedAt: new Date(),
                moderatedBy: req.user?.id || 'system'
            }
        );

        res.status(200).json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            },
            message: `${result.modifiedCount} reviews approved successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Reject Reviews
export const bulkRejectReviews = async (req, res) => {
    try {
        const { reviewIds, reason } = req.body;

        if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Review IDs are required'
            });
        }

        const result = await StoreProductReview.updateMany(
            { _id: { $in: reviewIds } },
            {
                status: 'rejected',
                rejectionReason: reason || 'Bulk rejection',
                moderatedAt: new Date(),
                moderatedBy: req.user?.id || 'system'
            }
        );

        res.status(200).json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            },
            message: `${result.modifiedCount} reviews rejected successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Review Response
export const addReviewResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'Response content is required'
            });
        }

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            {
                adminResponse: {
                    content: response,
                    respondedAt: new Date(),
                    respondedBy: req.user?.id || 'admin'
                }
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review response added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Review Response
export const updateReviewResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'Response content is required'
            });
        }

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            {
                'adminResponse.content': response,
                'adminResponse.updatedAt': new Date()
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review response updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Review Response
export const deleteReviewResponse = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            { $unset: { adminResponse: 1 } },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review response deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Review Responses
export const getReviewResponses = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await StoreProductReview.findById(id)
            .select('adminResponse')
            .populate('adminResponse.respondedBy', 'name email');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review.adminResponse || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Moderate Review
export const moderateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, reason } = req.body;

        if (!['approve', 'reject', 'flag'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid moderation action'
            });
        }

        const updateData = {
            moderatedAt: new Date(),
            moderatedBy: req.user?.id || 'system'
        };

        switch (action) {
            case 'approve':
                updateData.status = 'approved';
                break;
            case 'reject':
                updateData.status = 'rejected';
                if (reason) updateData.rejectionReason = reason;
                break;
            case 'flag':
                updateData.flagged = true;
                updateData.flagReason = reason || 'Flagged by moderator';
                break;
        }

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review,
            message: `Review ${action}ed successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Review Statistics
export const getReviewStatistics = async (req, res) => {
    try {
        const stats = await StoreProductReview.aggregate([
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    pendingReviews: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    approvedReviews: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    },
                    rejectedReviews: {
                        $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                    },
                    flaggedReviews: {
                        $sum: { $cond: [{ $eq: ['$flagged', true] }, 1, 0] }
                    }
                }
            }
        ]);

        const ratingDistribution = await StoreProductReview.aggregate([
            { $match: { status: 'approved' } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: stats[0] || {
                    totalReviews: 0,
                    averageRating: 0,
                    pendingReviews: 0,
                    approvedReviews: 0,
                    rejectedReviews: 0,
                    flaggedReviews: 0
                },
                ratingDistribution
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Sync Product Ratings
export const syncProductRatings = async (req, res) => {
    try {
        const products = await StoreProduct.find({});

        for (const product of products) {
            const reviews = await StoreProductReview.find({
                productId: product._id,
                status: 'approved'
            });

            const totalReviews = reviews.length;
            const averageRating = totalReviews > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                : 0;

            await StoreProduct.findByIdAndUpdate(product._id, {
                'rating.average': Math.round(averageRating * 10) / 10,
                'rating.count': totalReviews
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product ratings synchronized successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Report Review
export const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, reportedBy } = req.body;

        const review = await StoreProductReview.findByIdAndUpdate(
            id,
            {
                reported: true,
                reportReason: reason,
                reportedBy: reportedBy,
                reportedAt: new Date()
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review,
            message: 'Review reported successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Reported Reviews
export const getReportedReviews = async (req, res) => {
    try {
        const reviews = await StoreProductReview.find({ reported: true })
            .populate('productId', 'productName sku')
            .populate('userId', 'name email')
            .sort({ reportedAt: -1 });

        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
