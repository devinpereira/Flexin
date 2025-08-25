import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FiShoppingCart, FiFilter } from 'react-icons/fi';
import { productsApi, cartApi } from '../../api/storeApi';

const OffersAndDealsView = ({ favorites = [], onToggleFavorite, onAddToCart, addedToCartItems = new Set(), onProductClick }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Refs for dropdown menus to handle outside clicks
  const brandDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const priceRangeDropdownRef = useRef(null);
  const mobileFilterRef = useRef(null);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setShowBrandDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (priceRangeDropdownRef.current && !priceRangeDropdownRef.current.contains(event.target)) {
        setShowPriceRange(false);
      }
      if (mobileFilterRef.current && !mobileFilterRef.current.contains(event.target) &&
        !event.target.closest('.filter-toggle-button')) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sample data for filter options from backend products
  const brands = [...new Set(products.map(product => product.brand))];
  const categories = [...new Set(products.map(product => product.category))];

  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId || item._id === productId);
  };

  // Handle add to cart with API integration
  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await cartApi.addToCart(product.id, 1);
        console.log('Added to backend cart:', product.name);
      }

      // Call parent's onAddToCart function (handles visual feedback and local state)
      onAddToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Still call parent function even if API fails
      onAddToCart(product);
    }
  };

  // Add this function to handle product clicks
  const handleProductClick = (product, e) => {
    // Prevent navigation when clicking action buttons
    if (e.target.closest('button')) return;

    console.log('Product clicked in OffersAndDealsView:', product);

    if (!product.id && !product._id) {
      console.error('Product ID is missing!', product);
      alert('Error: Product ID is missing. Cannot navigate to product page.');
      return;
    }

    // Use parent callback if available (integrated layout), otherwise fallback to direct navigation (standalone)
    if (onProductClick) {
      console.log('Using parent onProductClick callback to stay within Store layout');
      onProductClick(product);
    } else {
      console.log('No parent callback, using direct navigation to standalone product page');
      const productId = product.id || product._id;
      console.log('Navigating to:', `/product/${productId}`);
      navigate(`/product/${productId}`, { state: { product } });
    }
  };

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newValue = parseInt(e.target.value, 10);
    const newRange = [...priceRange];

    if (index === 0) {
      // Ensure min doesn't exceed max
      newRange[0] = Math.min(newValue, priceRange[1]);
    } else {
      // Ensure max doesn't go below min
      newRange[1] = Math.max(newValue, priceRange[0]);
    }

    setPriceRange(newRange);
  };

  // Calculate the position and width of the price range track
  const minPos = (priceRange[0] / 1000) * 100;
  const maxPos = (priceRange[1] / 1000) * 100;

  // Toggle mobile filters panel
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Fetch discounted products from backend
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch products with discounts/offers
        const response = await productsApi.getProducts({
          page: 1,
          limit: 50,
          isActive: true,
          sortBy: 'discountPercentage',
          sortOrder: 'desc'
        });

        if (response.success) {
          // Filter products that have discounts or offers
          const dealsProducts = response.products
            .filter(product => product.discountPercentage > 0 || product.originalPrice > product.price)
            .map(product => ({
              // Keep original structure for ProductView compatibility
              _id: product._id,
              id: product._id || product.id,
              name: product.productName || product.name,
              productName: product.productName || product.name,
              category: product.categoryId?.name || 'General',
              categoryId: product.categoryId,
              subcategoryId: product.subcategoryId,
              brand: product.brand || 'Unknown Brand',
              price: product.price,
              originalPrice: product.originalPrice || product.price,
              discountPercentage: product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100),
              rating: product.averageRating || 0,
              averageRating: product.averageRating || 0,
              reviewCount: product.reviewCount || 0,
              image: product.images?.[0] || '/public/default.jpg', // Compatibility
              images: product.images || [product.images?.[0] || '/public/default.jpg'], // Full array for ProductView
              description: product.description,
              shortDescription: product.shortDescription,
              quantity: product.quantity || 0,
              specifications: product.specifications || [],
              tags: product.tags || [],
              inStock: product.quantity > 0,
              isFeatured: product.isFeatured,
              // Keep any other fields that might be needed
              ...product
            }));

          setProducts(dealsProducts);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setError('Failed to load deals. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div>
      {/* Page Heading */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">Offers & Deals</h2>
      <hr className="border-gray-600 mb-4" />

      {/* Desktop Filter Options */}
      <div className="hidden md:flex gap-4 lg:gap-8 mb-6 flex-wrap">
        {/* Brand Filter */}
        <div className="relative" ref={brandDropdownRef}>
          <button
            className="bg-gray-700/50 px-4 lg:px-6 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => {
              setShowBrandDropdown(!showBrandDropdown);
              setShowCategoryDropdown(false);
              setShowPriceRange(false);
            }}
          >
            Brand
          </button>
          {showBrandDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-3 z-20 backdrop-blur-sm animate-fadeIn">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2 py-2 hover:bg-[#1e1e35] px-3 rounded transition-all">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    className="accent-[#f67a45] w-4 h-4"
                  />
                  <label htmlFor={`brand-${brand}`} className="text-white cursor-pointer">{brand}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            className="bg-gray-700/50 px-4 lg:px-6 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowBrandDropdown(false);
              setShowPriceRange(false);
            }}
          >
            Category
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-3 z-20 backdrop-blur-sm animate-fadeIn">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2 py-2 hover:bg-[#1e1e35] px-3 rounded transition-all">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    className="accent-[#f67a45] w-4 h-4"
                  />
                  <label htmlFor={`category-${category}`} className="text-white cursor-pointer">{category}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="relative" ref={priceRangeDropdownRef}>
          <button
            className="bg-gray-700/50 px-4 lg:px-6 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors"
            onClick={() => {
              setShowPriceRange(!showPriceRange);
              setShowBrandDropdown(false);
              setShowCategoryDropdown(false);
            }}
          >
            Price
          </button>
          {showPriceRange && (
            <div className="absolute top-full left-0 mt-3 w-64 md:w-80 bg-[#121225] border border-[#f67a45]/30 rounded-md shadow-xl p-5 z-20 backdrop-blur-sm animate-fadeIn">
              <div className="flex justify-between text-white mb-6">
                <div className="bg-[#1e1e35] px-3 py-1 rounded">
                  <span>${priceRange[0]}</span>
                </div>
                <div className="bg-[#1e1e35] px-3 py-1 rounded">
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Price slider */}
              <div className="relative h-8 mb-6">
                <div className="absolute w-full h-2 bg-gray-700/70 rounded-full top-3"></div>
                <div
                  className="absolute h-2 bg-gradient-to-r from-[#f67a45] to-[#f67a45] rounded-full top-3"
                  style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
                ></div>
                <div
                  className="absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer"
                  style={{ left: `calc(${minPos}% - 10px)` }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                </div>
                <div
                  className="absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer"
                  style={{ left: `calc(${maxPos}% - 10px)` }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>

              <button
                className="w-full mt-3 bg-[#f67a45] text-white py-2 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
                onClick={() => setShowPriceRange(false)}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden mb-4 flex justify-between items-center">
        <button
          className="filter-toggle-button bg-gray-700/50 px-4 py-2 rounded-full text-white hover:bg-gray-600/60 transition-colors flex items-center gap-2"
          onClick={toggleMobileFilters}
        >
          <FiFilter size={16} />
          <span>Filters</span>
        </button>

        <span className="text-white text-sm">12 items</span>
      </div>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 md:hidden">
          <div
            ref={mobileFilterRef}
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-5 w-full max-w-sm max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-bold">Filters</h3>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setShowMobileFilters(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {/* Brand Filter - Mobile */}
              <div>
                <h4 className="text-white mb-2">Brands</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`mobile-brand-${brand}`}
                        className="accent-[#f67a45] w-5 h-5"
                      />
                      <label
                        htmlFor={`mobile-brand-${brand}`}
                        className="text-white cursor-pointer text-base"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter - Mobile */}
              <div>
                <h4 className="text-white mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`mobile-category-${category}`}
                        className="accent-[#f67a45] w-5 h-5"
                      />
                      <label
                        htmlFor={`mobile-category-${category}`}
                        className="text-white cursor-pointer text-base"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range - Mobile */}
              <div>
                <h4 className="text-white mb-2">Price Range</h4>
                <div className="flex justify-between text-white mb-6">
                  <div className="bg-[#1e1e35] px-3 py-1 rounded">
                    <span>${priceRange[0]}</span>
                  </div>
                  <div className="bg-[#1e1e35] px-3 py-1 rounded">
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Price slider - Mobile */}
                <div className="relative h-8 mb-6">
                  <div className="absolute w-full h-2 bg-gray-700/70 rounded-full top-3"></div>
                  <div
                    className="absolute h-2 bg-gradient-to-r from-[#f67a45] to-[#f67a45] rounded-full top-3"
                    style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
                  ></div>
                  <div
                    className="absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer"
                    style={{ left: `calc(${minPos}% - 12px)` }}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="absolute opacity-0 w-6 h-6 cursor-pointer"
                    />
                  </div>
                  <div
                    className="absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer"
                    style={{ left: `calc(${maxPos}% - 12px)` }}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="absolute opacity-0 w-6 h-6 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-3 border border-gray-600 rounded-lg text-white hover:bg-[#1e1e35]"
                onClick={() => setShowMobileFilters(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-[#f67a45] text-white py-3 rounded-lg hover:bg-[#e56d3d]"
                onClick={() => {
                  // Apply filters logic here
                  setShowMobileFilters(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <hr className="border-gray-600 mb-6" />

      {/* Special Offers Banner */}
      <div className="mb-8 bg-gradient-to-r from-[#121225] to-[#1e1e35] p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <h3 className="text-white text-lg md:text-xl font-bold">Special Weekend Sale!</h3>
            <p className="text-white/80 text-sm md:text-base">Get up to 40% off on selected items</p>
          </div>
          <button className="bg-[#f67a45] text-white w-full sm:w-auto px-6 py-2 rounded-full text-sm hover:bg-[#e56d3d] transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Offers & Deals Grid */}
      <div className="mb-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <p className="text-center text-white mb-6">{products.length} offers available</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {products.map((product) => {
                const productIsFavorite = isFavorite(product.id);

                return (
                  <div
                    key={product.id}
                    className="w-full aspect-[1/1.5] relative origin-top-left rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-2 sm:p-4 cursor-pointer"
                    onClick={(e) => handleProductClick(product, e)}
                  >
                    <div className="w-[29px] h-[29px] absolute top-0 right-0 bg-[#e50909] rounded-tr-sm rounded-bl-[7px] flex items-center justify-center text-white text-xs">
                      {product.discount}%
                    </div>

                    {/* Action buttons group */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                      {/* Favorite heart button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(product);
                        }}
                        className="bg-black/30 rounded-full p-2 transition-colors hover:bg-black/50"
                        aria-label={productIsFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {productIsFavorite ?
                          <AiFillHeart size={18} className="text-[#f67a45]" /> :
                          <AiOutlineHeart size={18} className="text-white hover:text-[#f67a45]" />
                        }
                      </button>

                      {/* Add to cart button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className={`rounded-full p-2 transition-colors ${addedToCartItems.has(product.id)
                          ? 'bg-[#f67a45]/80 hover:bg-[#f67a45]'
                          : 'bg-black/30 hover:bg-black/50'
                          }`}
                        title="Add to cart"
                        aria-label="Add to cart"
                      >
                        <FiShoppingCart size={18} className="text-white hover:text-[#f67a45]" />
                      </button>
                    </div>

                    <div className="w-full h-[60%] bg-gray-700/30 mb-2 sm:mb-4 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/public/default.jpg';
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-sm sm:font-medium mb-1 truncate">{product.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-400 line-through text-xs">${product.originalPrice}</span>
                        <span className="text-[#f67a45] text-sm sm:font-medium">${product.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 text-white mb-8">
        <button className="underline w-8 h-8 flex items-center justify-center">1</button>
        <button className="w-8 h-8 flex items-center justify-center hover:text-[#f67a45]">2</button>
        <button className="w-8 h-8 flex items-center justify-center hover:text-[#f67a45]">3</button>
        <button className="flex items-center gap-1 hover:text-[#f67a45]">
          Next <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default OffersAndDealsView;
