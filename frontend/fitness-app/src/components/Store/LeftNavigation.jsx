import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTag, FiX, FiDroplet, FiHeart, FiHome, FiClock, FiPackage } from 'react-icons/fi';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { MdKeyboardArrowRight, MdFitnessCenter, MdLocalDining } from 'react-icons/md';
import { GiClothes, GiBackpack } from 'react-icons/gi';
import { categoriesApi } from '../../api/storeApi';
import { recentlyViewedUtils } from '../../utils/recentlyViewed';

const LeftNavigation = ({ activeView, setActiveView, onCategorySelect, cartItemsCount, isMobileNavOpen, setIsMobileNavOpen, onProductClick }) => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getCategories();
        if (response.success) {
          const formattedCategories = response.categories.map(category => ({
            id: category._id || category.id,
            name: category.name,
            subcategories: category.subcategories || []
          }));
          setCategories(formattedCategories);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use fallback static categories
        setCategories(getFallbackCategories());
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Load recently viewed products and listen for updates
  useEffect(() => {
    // Load initial recently viewed products
    const loadRecentlyViewed = () => {
      const recent = recentlyViewedUtils.getRecentlyViewed();
      setRecentlyViewed(recent);
    };

    loadRecentlyViewed();

    // Listen for updates to recently viewed products
    const handleRecentlyViewedUpdate = (event) => {
      setRecentlyViewed(event.detail.recentlyViewed);
    };

    window.addEventListener('recentlyViewedUpdated', handleRecentlyViewedUpdate);

    return () => {
      window.removeEventListener('recentlyViewedUpdated', handleRecentlyViewedUpdate);
    };
  }, []);

  // Fallback categories if API fails
  const getFallbackCategories = () => [
    {
      id: 'supplements',
      name: 'Supplements',
      subcategories: [
        'Protein Powders',
        'Pre-Workout',
        'Vitamins & Minerals',
        'Weight Gainers',
        'Amino Acids',
        'Creatine',
        'Fat Burners'
      ]
    },
    {
      id: 'equipment',
      name: 'Equipment',
      subcategories: [
        'Dumbbells',
        'Resistance Bands',
        'Benches',
        'Bars',
        'Weight Sets',
        'Yoga Mats',
        'Kettlebells'
      ]
    },
    {
      id: 'apparel',
      name: 'Apparel',
      subcategories: [
        'Men\'s Clothing',
        'Women\'s Clothing',
        'Footwear',
        'Accessories',
        'Compression Wear',
        'Workout Gloves'
      ]
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      subcategories: [
        'Healthy Snacks',
        'Meal Replacements',
        'Superfoods',
        'Energy Bars',
        'Protein Bars',
        'Sports Drinks'
      ]
    },
    {
      id: 'accessories',
      name: 'Accessories',
      subcategories: [
        'Gym Bags',
        'Water Bottles',
        'Fitness Trackers',
        'Lifting Belts',
        'Workout Towels'
      ]
    }
  ];

  // Toggle category dropdown
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setIsMobileNavOpen(false);
  };

  // Handle subcategory click
  const handleSubcategoryClick = (category, subcategory) => {
    onCategorySelect({ ...category, selectedSubcategory: subcategory });
    setIsMobileNavOpen(false);
  };

  // Handle view change
  const handleViewChange = (view) => {
    if (view === 'orders') {
      // Navigate to orders page using React Router
      navigate('/orders');
      setIsMobileNavOpen(false);
      return;
    }
    
    // For other views, use the existing setActiveView function
    setActiveView(view);
    setIsMobileNavOpen(false);
  };

  // Handle recently viewed product click
  const handleRecentlyViewedClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    }
    setIsMobileNavOpen(false);
  };

  // Clear recently viewed products
  const clearRecentlyViewed = () => {
    recentlyViewedUtils.clearRecentlyViewed();
  };

  // Function to get category icon based on category name or id
  const getCategoryIcon = (categoryName, categoryId) => {
    const name = categoryName.toLowerCase();
    const id = categoryId?.toLowerCase();

    if (name.includes('supplement') || id === 'supplements') {
      return <FiDroplet className="mr-2" />;
    } else if (name.includes('equipment') || id === 'equipment') {
      return <MdFitnessCenter className="mr-2" />;
    } else if (name.includes('apparel') || name.includes('clothing') || id === 'apparel') {
      return <GiClothes className="mr-2" />;
    } else if (name.includes('nutrition') || name.includes('food') || id === 'nutrition') {
      return <MdLocalDining className="mr-2" />;
    } else if (name.includes('accessories') || name.includes('accessory') || id === 'accessories') {
      return <GiBackpack className="mr-2" />;
    } else {
      return <FiTag className="mr-2" />;
    }
  };

  return (
    <>
      {/* Mobile Navigation Overlay - Only appears when mobile menu is open */}
      {isMobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}

      {/* Mobile Navigation Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          {isMobileNavOpen ? <FiX size={24} /> : <MdKeyboardArrowRight size={24} />}
        </button>
      </div>

      {/* Navigation Sidebar - Hidden on mobile unless toggled open */}
      <div className={`fixed lg:relative z-40 lg:z-0 inset-y-0 left-0 w-72 bg-[#121225] border-r border-gray-700 lg:border-none transform ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out lg:transition-none overflow-y-auto h-screen lg:h-auto`}>

        <div className="p-6 pb-20 lg:pb-6 overflow-y-auto max-h-screen">
          {/* Main Navigation Items */}
          <div className="space-y-3 mb-8">
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeView === 'main' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1e1e35]'
                }`}
              onClick={() => handleViewChange('main')}
            >
              <div className="flex items-center">
                <FiHome className="mr-2" />
                <span>Main Store</span>
              </div>
            </button>

            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeView === 'cart' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1e1e35]'
                }`}
              onClick={() => handleViewChange('cart')}
            >
              <div className="flex items-center">
                <FiShoppingCart className="mr-2" />
                <span>Shopping Cart</span>
              </div>
              {cartItemsCount > 0 && (
                <span className="bg-[#f67a45] text-white text-xs px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeView === 'deals' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1e1e35]'
                }`}
              onClick={() => handleViewChange('deals')}
            >
              <div className="flex items-center">
                <FiTag className="mr-2" />
                <span>Offers & Deals</span>
              </div>
            </button>

            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeView === 'orders' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1e1e35]'
                }`}
              onClick={() => handleViewChange('orders')}
            >
              <div className="flex items-center">
                <FiPackage className="mr-2" />
                <span>My Orders</span>
              </div>
            </button>
          </div>

          {/* Categories Section - Improved with expandable/collapsible sections */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-white mb-4">
              <h3 className="font-bold text-lg">Categories</h3>
            </div>

            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="rounded-lg overflow-hidden bg-[#1a1a2f]/50">
                  <button
                    className="w-full text-left flex items-center justify-between px-4 py-3 text-white hover:bg-[#1e1e35]"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="flex items-center">
                      {getCategoryIcon(category.name, category.id)}
                      {category.name}
                    </span>
                    {expandedCategories[category.id] ? <AiFillCaretUp /> : <AiFillCaretDown />}
                  </button>

                  {/* Subcategories - Animated collapse/expand */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategories[category.id] ? 'max-h-96' : 'max-h-0'
                      }`}
                  >
                    <div className="ml-4 py-2 border-l border-gray-700 space-y-1">
                      {/* All Category Items option */}
                      <button
                        className="w-full text-left px-4 py-1.5 text-sm rounded-lg text-white hover:text-[#f67a45] hover:bg-[#1e1e35] flex items-center"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <span className="mr-2">•</span>
                        All {category.name}
                      </button>

                      {/* Individual subcategories */}
                      {category.subcategories.map(sub => (
                        <button
                          key={sub}
                          className="w-full text-left px-4 py-1.5 text-sm rounded-lg text-gray-400 hover:text-white hover:bg-[#1e1e35] flex items-center"
                          onClick={() => handleSubcategoryClick(category, sub)}
                        >
                          <span className="mr-2">•</span>
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed (Only for desktop) */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-white flex items-center">
                <FiClock className="mr-2" />
                Recently Viewed
              </h3>
              {recentlyViewed.length > 0 && (
                <button
                  onClick={clearRecentlyViewed}
                  className="text-xs text-gray-400 hover:text-[#f67a45] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-3">
              {recentlyViewed.length === 0 ? (
                <div className="text-center py-6">
                  <FiClock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No recently viewed products</p>
                </div>
              ) : (
                recentlyViewed.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex items-center p-2 bg-[#1a1a2f] rounded-lg cursor-pointer hover:bg-[#1e1e35] transition-all duration-300 group"
                    onClick={() => handleRecentlyViewedClick(product)}
                  >
                    <div className="w-12 h-12 bg-gray-700/30 rounded-lg mr-3 overflow-hidden relative">
                      <img
                        src={product.image || product.images?.[0] || '/public/default.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/public/default.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate group-hover:text-[#f67a45] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[#f67a45] text-xs font-medium">
                        ${product.price}
                      </p>
                      {product.rating && (
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-white/70 text-xs ml-1">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <MdKeyboardArrowRight className="text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Button - Mobile Only */}
          <div className="mt-6 lg:hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-[#f67a45] text-white rounded-lg"
              onClick={() => handleViewChange('cart')}
            >
              <div className="flex items-center">
                <FiShoppingCart className="mr-2" />
                <span>View Cart</span>
              </div>
              {cartItemsCount > 0 && (
                <span className="bg-white text-[#f67a45] text-xs px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftNavigation;
