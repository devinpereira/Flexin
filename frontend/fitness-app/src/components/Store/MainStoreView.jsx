import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart, AiOutlineCheckCircle } from 'react-icons/ai';
import { FiShoppingCart, FiDroplet, FiTag } from 'react-icons/fi';
import { MdFitnessCenter, MdLocalDining } from 'react-icons/md';
import { GiClothes, GiBackpack } from 'react-icons/gi';
import { productsApi, categoriesApi, cartApi } from '../../api/storeApi';

const MainStoreView = ({ favorites = [], onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCartItems, setAddedToCartItems] = useState(new Set());

  // Fetch products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all products
        const productsResponse = await productsApi.getProducts({
          page: 1,
          limit: 20,
          isActive: true
        });

        // Fetch featured products
        const featuredResponse = await productsApi.getProducts({
          page: 1,
          limit: 5,
          isFeatured: true,
          isActive: true
        });

        // Fetch categories
        const categoriesResponse = await categoriesApi.getCategories();

        if (productsResponse.success) {
          setProducts(productsResponse.products || []);
        }

        if (featuredResponse.success) {
          setFeaturedProducts(featuredResponse.products || []);
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.categories || []);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId || item._id === productId);
  };

  // Format product data for consistency
  const formatProduct = (product) => {
    if (!product) {
      console.error('Product is undefined or null:', product);
      return { id: null };
    }

    return {
      id: product._id || product.id,
      name: product.productName || product.name,
      category: product.categoryId?.name || product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      rating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      image: product.images?.[0] || '/public/default.jpg',
      images: product.images || ['/public/default.jpg'], // Keep full images array for ProductView
      description: product.description,
      shortDescription: product.shortDescription,
      brand: product.brand,
      isFeatured: product.isFeatured,
      quantity: product.quantity,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      specifications: product.specifications || [],
      tags: product.tags || [],
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0
    };
  };

  // Handle product click to view details
  const handleProductClick = (product) => {
    try {
      console.log('Product clicked:', product);

      if (!product) {
        console.error('Product is undefined!');
        alert('Error: Product data is missing.');
        return;
      }

      const formattedProduct = formatProduct(product);
      console.log('Formatted product:', formattedProduct);

      if (!formattedProduct.id) {
        console.error('Product ID is missing!', formattedProduct);
        alert('Error: Product ID is missing. Cannot navigate to product page.');
        return;
      }

      console.log('Navigating to:', `/product/${formattedProduct.id}`);
      navigate(`/product/${formattedProduct.id}`, { state: { product: formattedProduct } });
    } catch (error) {
      console.error('Error in handleProductClick:', error);
      alert('Error navigating to product page. Please try again.');
    }
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    try {
      const formattedProduct = formatProduct(product);

      // Try to add to backend cart if user is authenticated
      const token = localStorage.getItem('token');
      if (token) {
        await cartApi.addToCart(formattedProduct.id, 1);
        console.log('Added to backend cart:', formattedProduct.name);
      }

      // Add visual feedback - highlight the button
      setAddedToCartItems(prev => new Set([...prev, formattedProduct.id]));

      // Remove highlight after 2 seconds
      setTimeout(() => {
        setAddedToCartItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(formattedProduct.id);
          return newSet;
        });
      }, 2000);

      // Call the parent's onAddToCart function (for local state management)
      onAddToCart(formattedProduct);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Still call parent function and show visual feedback even if API fails
      const formattedProduct = formatProduct(product);
      setAddedToCartItems(prev => new Set([...prev, formattedProduct.id]));
      setTimeout(() => {
        setAddedToCartItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(formattedProduct.id);
          return newSet;
        });
      }, 2000);
      onAddToCart(formattedProduct);
    }
  };

  // Handle category selection for filtering
  const handleCategorySelect = async (category) => {
    try {
      setIsLoading(true);
      const response = await productsApi.getProducts({
        category: category._id || category.id,
        page: 1,
        limit: 20,
        isActive: true
      });

      if (response.success) {
        setProducts(response.products || []);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error filtering by category:', error);
      setError('Failed to filter products by category.');
      setIsLoading(false);
    }
  };

  // Function to get category icon based on category name or id
  const getCategoryIcon = (categoryName, categoryId) => {
    const name = categoryName.toLowerCase();
    const id = categoryId?.toLowerCase();

    if (name.includes('supplement') || id === 'supplements') {
      return <FiDroplet className="w-6 h-6 text-[#f67a45]" />;
    } else if (name.includes('equipment') || id === 'equipment') {
      return <MdFitnessCenter className="w-6 h-6 text-[#f67a45]" />;
    } else if (name.includes('apparel') || name.includes('clothing') || id === 'apparel') {
      return <GiClothes className="w-6 h-6 text-[#f67a45]" />;
    } else if (name.includes('nutrition') || name.includes('food') || id === 'nutrition') {
      return <MdLocalDining className="w-6 h-6 text-[#f67a45]" />;
    } else if (name.includes('accessories') || name.includes('accessory') || id === 'accessories') {
      return <GiBackpack className="w-6 h-6 text-[#f67a45]" />;
    } else {
      return <FiTag className="w-6 h-6 text-[#f67a45]" />;
    }
  };

  // Render featured product carousel
  const renderFeaturedProducts = () => {
    if (isLoading) {
      return (
        <div className="featured-products mb-8">
          <h3 className="text-white text-xl font-bold mb-4">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-black/30 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                <div className="w-full h-40 bg-gray-700/50 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
                <div className="h-3 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!featuredProducts.length) {
      return (
        <div className="featured-products mb-8">
          <h3 className="text-white text-xl font-bold mb-4">Featured Products</h3>
          <p className="text-white/70">No featured products available at the moment.</p>
        </div>
      );
    }

    return (
      <div className="featured-products mb-8">
        <h3 className="text-white text-xl font-bold mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredProducts.map(product => {
            const formattedProduct = formatProduct(product);
            return (
              <div
                key={formattedProduct.id}
                className="bg-black/30 backdrop-blur-sm rounded-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#f67a45]/20 hover:bg-black/40 group"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative">
                  <div className="w-full h-40 bg-gray-700/30 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative group-hover:ring-2 group-hover:ring-[#f67a45]/50 transition-all duration-300">
                    <img
                      src={formattedProduct.image}
                      alt={formattedProduct.name}
                      className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/public/default.jpg';
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(formattedProduct);
                    }}
                    className="absolute top-2 left-2 bg-black/30 rounded-full p-2 transition-colors hover:bg-black/50"
                  >
                    {isFavorite(formattedProduct.id) ?
                      <AiFillHeart size={18} className="text-[#f67a45]" /> :
                      <AiOutlineHeart size={18} className="text-white" />
                    }
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(formattedProduct);
                    }}
                    className={`absolute top-2 right-2 rounded-full p-2 transition-all duration-300 ${addedToCartItems.has(formattedProduct.id)
                      ? 'bg-green-500 text-white shadow-lg transform scale-110'
                      : 'bg-black/30 text-white hover:bg-black/50'
                      }`}
                  >
                    {addedToCartItems.has(formattedProduct.id) ? (
                      <AiOutlineCheckCircle size={18} />
                    ) : (
                      <FiShoppingCart size={18} />
                    )}
                  </button>
                </div>
                <h4 className="text-white font-medium truncate">{formattedProduct.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <span className="text-[#f67a45] font-bold">${formattedProduct.price}</span>
                    {formattedProduct.originalPrice && formattedProduct.originalPrice > formattedProduct.price && (
                      <span className="text-white/50 text-sm line-through">${formattedProduct.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-white/70 text-sm">{formattedProduct.rating.toFixed(1)} ★</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render product grid
  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="product-grid">
          <h3 className="text-white text-xl font-bold mb-4">All Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-black/30 backdrop-blur-sm rounded-lg p-2 sm:p-3 animate-pulse">
                <div className="w-full aspect-square bg-gray-700/50 rounded-lg mb-2"></div>
                <div className="h-3 bg-gray-700/50 rounded mb-1"></div>
                <div className="h-2 bg-gray-700/50 rounded w-2/3 mb-1"></div>
                <div className="h-2 bg-gray-700/50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!products.length) {
      return (
        <div className="product-grid">
          <h3 className="text-white text-xl font-bold mb-4">All Products</h3>
          <p className="text-white/70">No products available at the moment.</p>
        </div>
      );
    }

    return (
      <div className="product-grid">
        <h3 className="text-white text-xl font-bold mb-4">All Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {products.map(product => {
            const formattedProduct = formatProduct(product);
            return (
              <div
                key={formattedProduct.id}
                className="bg-black/30 backdrop-blur-sm rounded-lg p-2 sm:p-3 cursor-pointer relative transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#f67a45]/20 hover:bg-black/40 group"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative">
                  <div className="w-full aspect-square bg-gray-700/30 rounded-lg mb-2 flex items-center justify-center overflow-hidden relative group-hover:ring-2 group-hover:ring-[#f67a45]/50 transition-all duration-300">
                    <img
                      src={formattedProduct.image}
                      alt={formattedProduct.name}
                      className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/public/default.jpg';
                      }}
                    />
                    {/* Discount Badge */}
                    {formattedProduct.discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10 animate-pulse">
                        -{formattedProduct.discountPercentage}%
                      </div>
                    )}
                    {/* Featured Badge */}
                    {formattedProduct.isFeatured && (
                      <div className="absolute bottom-2 left-2 bg-[#f67a45] text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                        Featured
                      </div>
                    )}
                    {/* Stock Status Badge */}
                    {formattedProduct.quantity <= 5 && formattedProduct.quantity > 0 && (
                      <div className="absolute bottom-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold z-10">
                        Low Stock
                      </div>
                    )}
                    {formattedProduct.quantity <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="text-white font-bold text-xs">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(formattedProduct);
                    }}
                    className="absolute top-1 left-1 bg-black/30 rounded-full p-1 sm:p-2 transition-all duration-300 hover:bg-black/50 hover:scale-110 hover:shadow-lg backdrop-blur-sm"
                  >
                    {isFavorite(formattedProduct.id) ?
                      <AiFillHeart size={16} className="text-[#f67a45]" /> :
                      <AiOutlineHeart size={16} className="text-white" />
                    }
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(formattedProduct);
                    }}
                    className={`absolute top-1 right-1 rounded-full p-1 sm:p-2 transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:shadow-lg ${addedToCartItems.has(formattedProduct.id)
                      ? 'bg-green-500 text-white shadow-lg transform scale-110'
                      : 'bg-black/30 text-white hover:bg-black/50'
                      }`}
                  >
                    {addedToCartItems.has(formattedProduct.id) ? (
                      <AiOutlineCheckCircle size={16} />
                    ) : (
                      <FiShoppingCart size={16} />
                    )}
                  </button>
                </div>
                <h4 className="text-white text-sm sm:font-medium truncate">{formattedProduct.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex flex-col">
                    <span className="text-[#f67a45] text-sm sm:font-bold">${formattedProduct.price}</span>
                    {formattedProduct.originalPrice && formattedProduct.originalPrice > formattedProduct.price && (
                      <span className="text-white/50 text-xs line-through">${formattedProduct.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-white/70 text-xs">{formattedProduct.rating.toFixed(1)} ★</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      {/* Page Heading */}
      <h2 className="text-white text-2xl font-bold mb-4">Store</h2>

      <hr className="border-gray-600 mb-6" />

      {/* Hero Section */}
      <div className="rounded-lg overflow-hidden mb-8 relative bg-gradient-to-r from-[#f67a45] to-[#ff8a65] h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 z-20">
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4">Summer Sale</h2>
          <p className="text-white/90 text-base md:text-xl mb-4 max-w-md">Get up to 40% off on selected fitness products</p>
          <button className="bg-white text-[#f67a45] py-2 px-6 rounded-full w-fit hover:bg-gray-100 transition-colors font-semibold">
            Shop Now
          </button>
        </div>
      </div>

      {/* Featured Products */}
      {renderFeaturedProducts()}

      {/* Product Categories */}
      <div className="mb-8">
        <h3 className="text-white text-xl font-bold mb-4">Categories</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <div
                key={category._id || category.id}
                className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors"
                onClick={() => handleCategorySelect(category)}
              >
                <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  {getCategoryIcon(category.name, category._id || category.id)}
                </div>
                <h4 className="text-white">{category.name}</h4>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
              <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                {getCategoryIcon('Supplements', 'supplements')}
              </div>
              <h4 className="text-white">Supplements</h4>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
              <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                {getCategoryIcon('Equipment', 'equipment')}
              </div>
              <h4 className="text-white">Equipment</h4>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
              <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                {getCategoryIcon('Apparel', 'apparel')}
              </div>
              <h4 className="text-white">Apparel</h4>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer hover:bg-[#121225] transition-colors">
              <div className="w-12 h-12 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                {getCategoryIcon('Accessories', 'accessories')}
              </div>
              <h4 className="text-white">Accessories</h4>
            </div>
          </div>
        )}
      </div>

      {/* All Products */}
      {renderProductGrid()}
    </div>
  );
};

export default MainStoreView;
