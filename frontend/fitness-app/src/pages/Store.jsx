import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import LeftNavigation from '../components/LeftNavigation';
import MainStoreView from '../components/MainStoreView';
import SubcategoryView from '../components/SubcategoryView';
import OffersAndDealsView from '../components/OffersAndDealsView';
import FavoritesView from '../components/FavoritesView';
import ShoppingCartView from '../components/ShoppingCartView';
import { FiShoppingCart } from 'react-icons/fi';
import { FiMenu } from 'react-icons/fi';

const Store = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Home');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  // Load favorites from localStorage on initial render
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Load cart from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Close mobile nav when changing sections
  useEffect(() => {
    setShowMobileNav(false);
  }, [activeSection, selectedSubcategory]);

  // Save to localStorage whenever favorites or cart changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to handle section changes
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Reset subcategory when changing main sections
    if (section !== 'Categories') {
      setSelectedSubcategory(null);
    }
  };

  // Function to toggle a product as favorite
  const toggleFavorite = (product) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(item => item.id === product.id);
      
      if (isAlreadyFavorite) {
        return prevFavorites.filter(item => item.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  // Function to remove a product from favorites
  const removeFavorite = (productId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== productId)
    );
  };

  // Function to add a product to cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Otherwise add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Function to update cart item quantity
  const updateCartItem = (itemId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Function to remove item from cart
  const removeCartItem = (itemId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== itemId)
    );
  };


  // Function to handle checkout
  const handleCheckout = (selectedItems, total) => {
    console.log("Checkout initiated", selectedItems, total);
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));
    
    // Make sure we have items to checkout
    if (itemsToCheckout.length === 0) {
      console.error("No items selected for checkout");
      return;
    }
    
    // Use navigate with state object
    navigate('/checkout', { 
      state: { 
        items: itemsToCheckout, 
        total: total
      } 
    });
  };

  // Render appropriate content based on active section and selected subcategory
  const renderContent = () => {
    if (activeSection === 'Categories' && selectedSubcategory) {
      return (
        <SubcategoryView 
          subcategory={selectedSubcategory}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
        />
      );
    } else if (activeSection === 'Offers & Deals') {
      return (
        <OffersAndDealsView 
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
        />
      );
    } else if (activeSection === 'Favorites') {
      return (
        <FavoritesView 
          favorites={favorites}
          onRemoveFavorite={removeFavorite}
          onAddToCart={addToCart}
        />
      );
    } else if (activeSection === 'Shopping Cart') {
      return (
        <ShoppingCartView 
          cartItems={cartItems}
          updateCartItem={updateCartItem}
          removeCartItem={removeCartItem}
          onCheckout={handleCheckout}
        />
      );
    }
    
    // For Home and any other sections, show MainStoreView
    return (
      <MainStoreView 
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
      />
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}
    >
      {/* Search Bar Section */}
      <Navigation />
      <div className="container mx-auto pt-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden mr-auto bg-[#1A1A2F] p-2 rounded-lg text-white"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            <FiMenu size={24} />
          </button>

          {/* Search Bar */}
          <div className="w-full md:w-[545px] relative flex items-center">
            <input
              type="text"
              className="w-full h-10 md:h-[26px] rounded-[22px] outline-1 outline-offset-[-1px] outline-white/50 bg-black/30 backdrop-blur-sm px-4 text-white"
              placeholder="Search products..."
            />
            <button className="h-8 md:h-[26px] px-4 absolute right-0 bg-[#f67a45] rounded-[25px] text-white text-sm">
              Search
            </button>
          </div>

          {/* Shopping Cart Icon */}
          <div className="flex items-center ml-auto md:ml-0">
            <div className="relative">
              <button 
                className="text-white text-2xl"
                onClick={() => setActiveSection('Shopping Cart')}
              >
                <FiShoppingCart size={22} />
              </button>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f67a45] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`fixed top-0 left-0 h-full w-full bg-black/50 z-40 transition-opacity duration-300 md:hidden ${showMobileNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-[#03020d] h-full w-3/4 max-w-xs p-6 shadow-lg transition-transform duration-300 transform ${showMobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-xl font-bold">Menu</h3>
            <button className="text-white" onClick={() => setShowMobileNav(false)}>✕</button>
          </div>
          <LeftNavigation
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            selectedSubcategory={selectedSubcategory}
            onSubcategorySelect={setSelectedSubcategory}
            cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            isMobile={true}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col md:flex-row container mx-auto mt-4 md:mt-9 px-4 md:pl-60">
        {/* Desktop LeftNavigation */}
        <div className="hidden md:block">
          <LeftNavigation
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            selectedSubcategory={selectedSubcategory}
            onSubcategorySelect={setSelectedSubcategory}
            cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Store;