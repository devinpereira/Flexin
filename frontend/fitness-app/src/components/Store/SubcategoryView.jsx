import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart, AiOutlineFilter } from 'react-icons/ai';
import { FiShoppingCart, FiDroplet, FiTag } from 'react-icons/fi';
import { MdFitnessCenter, MdLocalDining } from 'react-icons/md';
import { GiClothes, GiBackpack } from 'react-icons/gi';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { productsApi, cartApi } from '../../api/storeApi';

const SubcategoryView = ({
  category,
  onBack,
  onAddToCart,
  sidebarItems,
  onProductView,
  userProfile,
  searchQuery = '',
  filterBy = 'all',
  sortBy = 'name',
  addedToCartItems = new Set(),
  favorites = [],
  onToggleFavorite,
  onProductClick
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Fetch products for the category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build API parameters based on category
        const params = {
          page: 1,
          limit: 50,
          isActive: true
        };

        // Add category filter if available
        if (category?.id) {
          params.category = category.id;
        }

        // Add subcategory filter if selected
        if (category?.selectedSubcategory) {
          params.subcategory = category.selectedSubcategory;
        }

        const response = await productsApi.getProducts(params);

        if (response.success) {
          const formattedProducts = response.products.map(product => ({
            id: product._id || product.id,
            name: product.productName || product.name,
            category: product.categoryId?.name || category?.name,
            subcategory: product.subcategoryId?.name || category?.selectedSubcategory,
            brand: product.brand || 'Unknown Brand',
            price: product.price,
            originalPrice: product.originalPrice,
            discountPercentage: product.discountPercentage,
            rating: product.averageRating || 0,
            reviewCount: product.reviewCount || 0,
            popularity: product.reviewCount || 0, // Use review count as popularity metric
            inStock: product.quantity > 0,
            quantity: product.quantity,
            image: product.images?.[0] || '/public/default.jpg',
            description: product.description,
            shortDescription: product.shortDescription
          }));
          setProducts(formattedProducts);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Retry function for failed requests
  const retryFetch = () => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {
          page: 1,
          limit: 50,
          isActive: true
        };

        if (category?.id) {
          params.category = category.id;
        }

        if (category?.selectedSubcategory) {
          params.subcategory = category.selectedSubcategory;
        }

        const response = await productsApi.getProducts(params);

        if (response.success) {
          const formattedProducts = response.products.map(product => ({
            id: product._id || product.id,
            name: product.productName || product.name,
            category: product.categoryId?.name || category?.name,
            subcategory: product.subcategoryId?.name || category?.selectedSubcategory,
            brand: product.brand || 'Unknown Brand',
            price: product.price,
            originalPrice: product.originalPrice,
            discountPercentage: product.discountPercentage,
            rating: product.averageRating || 0,
            reviewCount: product.reviewCount || 0,
            popularity: product.reviewCount || 0,
            inStock: product.quantity > 0,
            quantity: product.quantity,
            image: product.images?.[0] || '/public/default.jpg',
            description: product.description,
            shortDescription: product.shortDescription
          }));
          setProducts(formattedProducts);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  };

  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId || item._id === productId);
  };

  // Handle product click to view details
  const handleProductClick = (product) => {
    try {
      console.log('Product clicked in SubcategoryView:', product);

      if (!product) {
        console.error('Product is undefined in SubcategoryView!');
        alert('Error: Product data is missing.');
        return;
      }

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
    } catch (error) {
      console.error('Error in SubcategoryView handleProductClick:', error);
      alert('Error navigating to product page. Please try again.');
    }
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

  // Filter products based on selected criteria
  const getFilteredProducts = () => {
    return products.filter(product => {
      // Filter by price range
      const price = parseFloat(product.price);
      if (price < priceRange[0] || price > priceRange[1]) return false;

      // Filter by selected brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

      return true;
    });
  };

  // Sort the filtered products
  const getSortedProducts = () => {
    const filtered = getFilteredProducts();

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortOption) {
        case 'price':
          comparison = parseFloat(a.price) - parseFloat(b.price);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = parseFloat(a.rating) - parseFloat(b.rating);
          break;
        case 'popularity':
        default:
          comparison = a.popularity - b.popularity;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Get unique brands from products for filter options
  const getBrands = () => {
    return [...new Set(products.map(product => product.brand))];
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Handle brand selection in filters
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
  };

  // Get final products after filtering and sorting
  const displayProducts = getSortedProducts();
  const availableBrands = getBrands();

  // Function to get category icon based on category name or id
  const getCategoryIcon = (categoryName, categoryId) => {
    const name = categoryName?.toLowerCase() || '';
    const id = categoryId?.toLowerCase() || '';

    if (name.includes('supplement') || id === 'supplements') {
      return <FiDroplet className="mr-2 text-[#f67a45]" />;
    } else if (name.includes('equipment') || id === 'equipment') {
      return <MdFitnessCenter className="mr-2 text-[#f67a45]" />;
    } else if (name.includes('apparel') || name.includes('clothing') || id === 'apparel') {
      return <GiClothes className="mr-2 text-[#f67a45]" />;
    } else if (name.includes('nutrition') || name.includes('food') || id === 'nutrition') {
      return <MdLocalDining className="mr-2 text-[#f67a45]" />;
    } else if (name.includes('accessories') || name.includes('accessory') || id === 'accessories') {
      return <GiBackpack className="mr-2 text-[#f67a45]" />;
    } else {
      return <FiTag className="mr-2 text-[#f67a45]" />;
    }
  };

  return (
    <div>
      {/* Page Heading */}
      <h2 className="text-white text-2xl font-bold mb-4 flex items-center">
        {getCategoryIcon(category.name, category.id)}
        {category.selectedSubcategory ? category.selectedSubcategory : category.name}
      </h2>
      <hr className="border-gray-600 mb-6" />

      {/* Filter and Sort Controls */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Mobile Filter Toggle */}
          <button
            className="sm:hidden flex items-center gap-2 bg-[#1A1A2F] px-4 py-2 rounded-lg text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AiOutlineFilter />
            <span>Filters</span>
          </button>

          {/* Filter Section - Hidden on mobile unless toggled */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-auto`}>
            <div className="flex flex-wrap gap-3">
              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-[#1A1A2F] border border-gray-700 rounded-lg pl-3 pr-8 py-2 text-white appearance-none cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={toggleSortDirection}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                >
                  {sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                </button>
              </div>

              {/* Price Range Filter - Simplified for mobile */}
              <div className="hidden sm:flex items-center gap-3 text-white text-sm">
                <span>Price:</span>
                <div className="bg-[#1A1A2F] px-3 py-1 rounded-lg">
                  ${priceRange[0]}
                </div>
                <span>-</span>
                <div className="bg-[#1A1A2F] px-3 py-1 rounded-lg">
                  ${priceRange[1]}
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price Range Slider */}
              <div className="bg-[#1A1A2F] p-3 rounded-lg">
                <h4 className="text-white mb-3 text-sm font-medium">Price Range</h4>

                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-between text-white text-sm mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="bg-[#1A1A2F] p-3 rounded-lg">
                <h4 className="text-white mb-3 text-sm font-medium">Brands</h4>
                <div className="max-h-40 overflow-y-auto">
                  {availableBrands.map(brand => (
                    <div key={brand} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 accent-[#f67a45] mr-2"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="text-white text-sm cursor-pointer"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions - Mobile Only */}
            <div className="sm:hidden mt-4 flex justify-end gap-2">
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm text-white hover:text-[#f67a45]"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-3 py-1 text-sm bg-[#f67a45] text-white rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Product Count & Reset - Desktop Only */}
          <div className="hidden sm:flex gap-4 items-center">
            <span className="text-white text-sm">{displayProducts.length} products</span>

            {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
              <button
                onClick={resetFilters}
                className="text-[#f67a45] text-sm hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
          >
            Retry
          </button>
        </div>
      ) : displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {displayProducts.map(product => (
            <div
              key={product.id}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-2 sm:p-3 cursor-pointer relative"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <div className="w-full aspect-square bg-gray-700/30 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product);
                  }}
                  className="absolute top-1 left-1 bg-black/30 rounded-full p-1 sm:p-2 transition-colors hover:bg-black/50"
                >
                  {isFavorite(product.id) ?
                    <AiFillHeart size={16} className="text-[#f67a45]" /> :
                    <AiOutlineHeart size={16} className="text-white" />
                  }
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className={`absolute top-1 right-1 rounded-full p-1 sm:p-2 transition-colors ${addedToCartItems.has(product.id)
                    ? 'bg-[#f67a45]/80 hover:bg-[#f67a45]'
                    : 'bg-black/30 hover:bg-black/50'
                    }`}
                >
                  <FiShoppingCart size={16} className="text-white" />
                </button>

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
                  </div>
                )}
              </div>
              <h4 className="text-white text-sm sm:font-medium truncate">{product.name}</h4>
              <p className="text-gray-400 text-xs truncate">{product.brand}</p>
              <div className="flex justify-between items-center mt-1">
                <div className="flex flex-col">
                  <span className="text-[#f67a45] text-sm sm:font-bold">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-white/50 text-xs line-through">${product.originalPrice}</span>
                  )}
                </div>
                <span className="text-white/70 text-xs">{product.rating.toFixed(1)} ★</span>
              </div>
              {!product.inStock && (
                <p className="text-red-400 text-xs mt-1">Out of Stock</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 text-center">
          <p className="text-white">No products found matching your filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-[#f67a45] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {displayProducts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#f67a45] text-white">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1A1A2F] text-white">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1A1A2F] text-white">
              3
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1A1A2F] text-white">
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubcategoryView;
