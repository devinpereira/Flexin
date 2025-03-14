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

const Store = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Home');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  
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
  console.log("Checkout initiated", selectedItems, total); // Add debugging
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
      <div className="container mx-auto pt-8 px-100 flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-[545px] h-[26px] relative rounded-[22px] outline-1 outline-offset-[-1px] outline-white/50 bg-black/30 backdrop-blur-sm px-4 text-white"
            placeholder="Search products..."
          />
          <button className="w-[93px] h-[26px] relative bg-[#f67a45] rounded-[25px] text-white text-sm ml-2">
            Search
          </button>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
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

      {/* Main Content Container */}
      <div className="flex container mx-auto gap-9 mt-9 pl-60">
        <LeftNavigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          selectedSubcategory={selectedSubcategory}
          onSubcategorySelect={setSelectedSubcategory}
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Store;