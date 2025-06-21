import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import { useNotification } from '../../../hooks/useNotification';

const mockProducts = [
  {
    id: 1,
    name: 'Whey Protein',
    price: 49.99,
    discount: 10,
    image: '/src/assets/products/product1.png',
    category: 'Supplements',
    description:
      'High-quality whey protein for muscle recovery and growth. 2kg pack, chocolate flavor.',
    stock: 120,
    sku: 'WP-2000-CHOC',
    brand: 'MusclePro',
    tags: ['protein', 'supplement', 'muscle'],
    rating: 4.7,
    reviews: 124,
    originalPrice: 54.99
  },
  {
    id: 2,
    name: 'Yoga Mat',
    price: 19.99,
    discount: 0,
    image: '/src/assets/products/product2.png',
    category: 'Equipment',
    description:
      'Non-slip yoga mat, 6mm thick, perfect for all yoga and pilates routines.',
    stock: 60,
    sku: 'YM-6MM-GREEN',
    brand: 'FlexFit',
    tags: ['yoga', 'mat', 'equipment'],
    rating: 4.5,
    reviews: 87,
    originalPrice: 19.99
  },
  {
    id: 3,
    name: 'Dumbbells Set',
    price: 89.99,
    discount: 15,
    image: '/src/assets/products/product3.png',
    category: 'Equipment',
    description:
      'Adjustable dumbbells set (2x10kg) for strength training at home.',
    stock: 30,
    sku: 'DB-20KG-SET',
    brand: 'IronFlex',
    tags: ['dumbbells', 'weights', 'equipment'],
    rating: 4.8,
    reviews: 56,
    originalPrice: 105.99
  },
  {
    id: 4,
    name: 'BCAA Supplement',
    price: 29.99,
    discount: 5,
    image: '/src/assets/products/product4.png',
    category: 'Supplements',
    description: 'BCAA powder for muscle recovery, 400g, lemon flavor.',
    stock: 80,
    sku: 'BCAA-400G-LEMON',
    brand: 'NutriPlus',
    tags: ['bcaa', 'supplement', 'recovery'],
    rating: 4.3,
    reviews: 42,
    originalPrice: 31.49
  },
  {
    id: 5,
    name: 'Running Shoes',
    price: 59.99,
    discount: 20,
    image: '/src/assets/products/product5.png',
    category: 'Apparel',
    description:
      'Lightweight running shoes for men and women, size range 6-12.',
    stock: 45,
    sku: 'RS-UNISEX',
    brand: 'RunMax',
    tags: ['shoes', 'running', 'apparel'],
    rating: 4.6,
    reviews: 94,
    originalPrice: 74.99
  },
];

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const [product, setProduct] = useState(null);
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
    // Simulate fetching product by ID
    const found = mockProducts.find((p) => String(p.id) === String(productId));
    setProduct(found || null);
  }, [productId]);

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
      message: `Are you sure you want to delete ${product?.name}? This action cannot be undone.`,
      onConfirm: () => {
        // Mock deletion
        showSuccess('Product deleted successfully');
        navigate('/admin/store/products');
      },
      type: 'danger'
    });
  };

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
            {product.discount > 0 && (
              <div className="w-[48px] h-[48px] absolute top-3 right-3 bg-[#e50909] rounded-tr-lg rounded-bl-lg flex items-center justify-center text-white text-sm font-bold shadow-lg z-10">
                -{product.discount}%
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-2 bg-black/40 rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white text-3xl font-bold mb-2">
                  {product.name}
                </h2>
                <p className="text-white/60 mb-1">
                  {product.category}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <RatingStars rating={product.rating} />
                  <span className="text-white/60 text-sm">({product.reviews} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#f67a45] text-2xl font-bold mb-1">
                  ${product.price.toFixed(2)}
                </div>
                {product.discount > 0 && (
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
                    <span>Brand:</span> <span className="text-white font-medium">{product.brand}</span>
                  </p>
                  <p className="text-white/80 flex justify-between">
                    <span>Stock:</span>
                    <span className={`font-medium ${product.stock > 20 ? 'text-green-400' : product.stock > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {product.stock} {product.stock <= 5 && '(Low Stock)'}
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

            {/* Ratings and Reviews Section */}
            <div className="bg-[#121225]/50 rounded-lg p-4 mb-6">
              <h3 className="text-white text-lg font-semibold mb-2">Ratings & Reviews</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${idx < Math.floor(product.rating) ? 'text-[#f67a45]' : 'text-gray-400'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 15l-5.878 3.09L5.24 12.45 0 8.91l7.236-.635L10 0l2.764 8.275L20 8.91l-5.24 3.54L15.878 18z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white text-sm font-medium">
                  ({product.reviews} Reviews)
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-white/80 text-sm">Original Price:</span>
                  <span className="text-white font-medium line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80 text-sm">Discounted Price:</span>
                  <span className="text-[#f67a45] font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
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

      {/* Related Products Section */}
      <div className="mt-10">
        <h3 className="text-white text-xl font-bold mb-6">Related Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockProducts
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 5)
            .map(relatedProduct => (
              <div
                key={relatedProduct.id}
                className="bg-black/40 rounded-lg p-3 cursor-pointer hover:bg-black/60 transition-colors"
                onClick={() => navigate(`/admin/store/products/view/${relatedProduct.id}`)}
              >
                <div className="relative w-full aspect-square bg-gray-700/30 rounded-lg flex items-center justify-center overflow-hidden mb-3">
                  {relatedProduct.discount > 0 && (
                    <div className="w-[29px] h-[29px] absolute top-1 right-1 bg-[#e50909] rounded-tr-sm rounded-bl-[7px] flex items-center justify-center text-white text-xs">
                      -{relatedProduct.discount}%
                    </div>
                  )}
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <h4 className="text-white text-sm font-medium mb-1 line-clamp-1">{relatedProduct.name}</h4>
                <p className="text-[#f67a45] text-sm font-medium">${relatedProduct.price.toFixed(2)}</p>
              </div>
            ))}
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
