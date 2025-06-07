import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart, AiOutlineFilter } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const SubcategoryView = ({ category, favorites = [], onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  
  // Fetch products for the category
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      // Simulating API call with setTimeout
      setTimeout(() => {
        const mockProducts = generateMockProducts(24, category);
        setProducts(mockProducts);
        setIsLoading(false);
      }, 600);
      
      // In a real app, you'd fetch from your API:
      // const response = await fetch(`/api/products?category=${category.id}`);
      // const data = await response.json();
      // setProducts(data);
      // setIsLoading(false);
    };
    
    fetchProducts();
  }, [category]);

  // Generate mock product data for the category
  const generateMockProducts = (count, category) => {
    // Create a set of mock brands for this category
    const categoryBrands = ['BrandX', 'FitLife', 'ProForm', 'UltraFit', 'MaxGain'];
    
    return Array(count).fill().map((_, i) => ({
      id: `${category.id}-product-${i + 1}`,
      name: category.selectedSubcategory 
        ? `${category.selectedSubcategory} Item ${i + 1}` 
        : `${category.name} Product ${i + 1}`,
      category: category.name,
      subcategory: category.selectedSubcategory || '',
      brand: categoryBrands[i % categoryBrands.length],
      price: ((i + 1) * 9.99 + (i % 3) * 5).toFixed(2),
      rating: (3 + Math.random() * 2).toFixed(1),
      popularity: Math.floor(Math.random() * 100),
      inStock: Math.random() > 0.1, // 90% of products in stock
      image: `/src/assets/products/product${(i % 5) + 1}.png`
    }));
  };
  
  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };
  
  // Handle product click to view details
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
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

  return (
    <div>
      {/* Page Heading */}
      <h2 className="text-white text-2xl font-bold mb-4">
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
                    onAddToCart(product);
                  }}
                  className="absolute top-1 right-1 bg-black/30 rounded-full p-1 sm:p-2 transition-colors hover:bg-black/50"
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
                <span className="text-[#f67a45] text-sm sm:font-bold">${product.price}</span>
                <span className="text-white/70 text-xs">{product.rating} ★</span>
              </div>
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
