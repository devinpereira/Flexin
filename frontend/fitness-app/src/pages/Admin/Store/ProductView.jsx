import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaStarHalfAlt, FaRegStar, FaBox, FaTags } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import { useNotification } from '../../../hooks/useNotification';
import { adminProductsApi } from '../../../api/adminStoreApi';

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsStats, setReviewsStats] = useState({
    totalReviews: 0,
    averageRating: 0
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'danger',
  });

  // Rating Stars Component
  const RatingStars = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#f67a45]" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#f67a45]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#f67a45]/40" />);
      }
    }

    return <div className="flex items-center">{stars}</div>;
  };

  useEffect(() => {
    loadProductData();
    loadProductReviews();
  }, [productId]);

  const loadProductReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await adminProductsApi.getProductReviews(productId, { limit: 5 });
      if (response.success) {
        setReviews(response.data.reviews);
        setReviewsStats({
          totalReviews: response.data.totalReviews,
          averageRating: response.data.averageRating
        });
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadProductData = async () => {
    try {
      setLoading(true);
      const response = await adminProductsApi.getProduct(productId);
      if (response.success) {
        setProduct(response.data);
      } else {
        setProduct(null);
        showError('Product not found');
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setProduct(null);
      showError(error.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/store/products');
  };

  const handleEdit = () => {
    navigate(`/admin/store/products/edit/${productId}`);
  };

  const handleDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product?.productName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await adminProductsApi.deleteProduct(productId);
          if (response.success) {
            showSuccess('Product deleted successfully');
            navigate('/admin/store/products');
          }
        } catch (error) {
          showError(error.message || 'Failed to delete product');
        }
      },
      type: 'danger'
    });
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Product Details">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-black/40 rounded-lg p-8 text-center max-w-md">
            <svg className="animate-spin h-8 w-8 text-[#f67a45] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white/70">Loading product details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout pageTitle="Product Details">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-black/40 rounded-lg p-8 text-center max-w-md">
            <h3 className="text-white text-xl font-bold mb-4">Product Not Found</h3>
            <p className="text-white/70 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/admin/store/products')}
              className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Helper function to get product image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images.find(img => img.isPrimary)?.url || product.images[0]?.url;
    }
    return null;
  };

  // Helper function to parse attributes
  const getAttributeValue = (attributeName) => {
    if (!product.attributes || !Array.isArray(product.attributes)) return null;
    const attr = product.attributes.find(a => a.name === attributeName);
    if (!attr) return null;

    try {
      // Try to parse as JSON for arrays
      return JSON.parse(attr.value);
    } catch {
      // Return as string for simple values
      return attr.value;
    }
  };

  // Review Card Component
  const ReviewCard = ({ review }) => (
    <div className="bg-[#0A0A1F]/50 rounded-lg p-4 border border-white/10">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-[#f67a45] rounded-full flex items-center justify-center text-white font-medium">
          {review.userId?.firstName?.[0] || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-white font-medium">
                {review.userId?.firstName} {review.userId?.lastName}
              </h4>
              <div className="flex items-center gap-2">
                <RatingStars rating={review.rating} />
                <span className="text-white/60 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-white/80 text-sm">{review.comment}</p>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout pageTitle="Product Details">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleGoBack}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Products
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Image Section */}
        <div className="bg-black/40 rounded-2xl shadow-lg p-6 flex flex-col items-center group">
          <div className="relative w-full aspect-square bg-gray-700/30 rounded-xl flex items-center justify-center overflow-hidden">
            {product.discountPercentage > 0 && (
              <div className="w-[48px] h-[48px] absolute top-3 right-3 bg-[#e50909] rounded-tr-lg rounded-bl-lg flex items-center justify-center text-white text-sm font-bold shadow-lg z-10">
                -{product.discountPercentage}%
              </div>
            )}
            {getProductImage() ? (
              <img
                src={getProductImage()}
                alt={product.productName}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-white/50 flex flex-col items-center">
                <FaBox size={48} />
                <span className="mt-2 text-sm">No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-2 bg-black/40 rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white text-3xl font-bold mb-2">
                  {product.productName}
                </h2>
                <p className="text-white/60 mb-1">
                  {product.categoryId?.name || 'Uncategorized'}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <RatingStars rating={reviewsStats.averageRating || product.averageRating || 0} />
                  <span className="text-white/60 text-sm">
                    ({reviewsStats.totalReviews || product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#f67a45] text-2xl font-bold mb-1">
                  ${product.price.toFixed(2)}
                </div>
                {product.discountPercentage > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 line-through text-sm">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-[#e50909]/20 text-[#e50909] text-xs px-2 py-0.5 rounded">
                      SAVE ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#121225]/50 rounded-lg p-4 mb-4">
              <h3 className="text-white text-lg font-semibold mb-2">Product Description</h3>
              <p className="text-white/80">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121225]/50 rounded-lg p-4">
                <h3 className="text-white text-lg font-semibold mb-2">Product Details</h3>
                <div className="space-y-2">
                  <p className="text-white/80 flex justify-between">
                    <span>SKU:</span> <span className="text-white font-medium">{product.sku}</span>
                  </p>
                  <p className="text-white/80 flex justify-between">
                    <span>Brand:</span> <span className="text-white font-medium">{product.brand || 'N/A'}</span>
                  </p>
                  <p className="text-white/80 flex justify-between">
                    <span>Stock:</span>
                    <span className={`font-medium ${product.quantity > 20 ? 'text-green-400' : product.quantity > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {product.quantity} {product.quantity <= 5 && '(Low Stock)'}
                    </span>
                  </p>
                  <p className="text-white/80 flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium capitalize ${product.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {product.status}
                    </span>
                  </p>
                </div>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="bg-[#121225]/50 rounded-lg p-4">
                  <h3 className="text-white text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-sm bg-[#f67a45]/20 text-[#f67a45] px-3 py-1.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Updated Ratings and Reviews Section */}
            <div className="bg-[#121225]/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Customer Reviews</h3>
                <span className="text-white/60 text-sm">
                  {reviewsStats.totalReviews} review{reviewsStats.totalReviews !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <RatingStars rating={reviewsStats.averageRating} />
                  <span className="text-white text-lg font-medium">
                    {reviewsStats.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-white/60 text-sm">
                  ({reviewsStats.totalReviews} reviews)
                </span>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-4">
                  <div className="text-white/60">Loading reviews...</div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                  {reviewsStats.totalReviews > reviews.length && (
                    <div className="text-center pt-2">
                      <span className="text-white/60 text-sm">
                        Showing {reviews.length} of {reviewsStats.totalReviews} reviews
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/60">No reviews yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleEdit}
                className="bg-[#f67a45] text-white px-6 py-3 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center gap-2 flex-1"
              >
                <FaEdit size={18} /> Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FaTrash size={18} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() =>
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
        type={confirmDialog.type}
      />
    </AdminLayout>
  );
};

export default ProductView;
