import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import MainStoreView from '../../components/Store/MainStoreView';
import ShoppingCartView from '../../components/Store/ShoppingCartView';
import OffersAndDealsView from '../../components/Store/OffersAndDealsView';
import SubcategoryView from '../../components/Store/SubcategoryView';
import LeftNavigation from '../../components/Store/LeftNavigation';
import { recentlyViewedUtils } from '../../utils/recentlyViewed';

const Store = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('main');
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Handle navigation state from other pages
  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
      // Clear the state to prevent it from persisting on subsequent visits
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  // Fetch cart items from local storage on component mount
  useEffect(() => {
    console.log('Store - Component mounted, loading initial cart items');
    const savedCartItems = localStorage.getItem('cartItems');
    console.log('Store - Initial localStorage cartItems:', savedCartItems);

    if (savedCartItems) {
      try {
        const parsed = JSON.parse(savedCartItems);
        console.log('Store - Initial parsed cart items:', parsed);
        setCartItems(parsed);
      } catch (error) {
        console.error('Store - Error parsing initial cart items:', error);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Reload cart items from localStorage when cart view becomes active
  useEffect(() => {
    if (activeView === 'cart') {
      console.log('Store - Cart view activated, reloading cart items');
      const savedCartItems = localStorage.getItem('cartItems');
      console.log('Store - Raw localStorage data:', savedCartItems);

      if (savedCartItems) {
        try {
          const parsedCartItems = JSON.parse(savedCartItems);
          console.log('Store - Reloading cart items for cart view:', parsedCartItems);
          console.log('Store - Current cartItems state before update:', cartItems);
          console.log('Store - Items count - localStorage:', parsedCartItems.length, 'vs current state:', cartItems.length);

          // Always update to ensure we have the latest data
          setCartItems(parsedCartItems);
          console.log('Store - cartItems state updated to:', parsedCartItems);
        } catch (error) {
          console.error('Store - Error parsing localStorage cart items:', error);
        }
      } else {
        console.log('Store - No cart items in localStorage for cart view');
        setCartItems([]);
      }
    }
  }, [activeView]); // Remove cartItems from dependency to prevent loops

  // Also reload cart items whenever the component becomes visible/focused
  useEffect(() => {
    const handleFocus = () => {
      console.log('Store - Window focused, checking for cart updates');
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        try {
          const parsedCartItems = JSON.parse(savedCartItems);
          if (parsedCartItems.length !== cartItems.length) {
            console.log('Store - Cart items changed while away, updating state');
            setCartItems(parsedCartItems);
          }
        } catch (error) {
          console.error('Store - Error parsing localStorage on focus:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [cartItems.length]);

  // Save cart items to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle toggling favorites
  const handleToggleFavorite = (product) => {
    const isFavorite = favorites.some(item => item.id === product.id);

    if (isFavorite) {
      setFavorites(favorites.filter(item => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (product, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  // Handle updating cart item quantity
  const handleUpdateCartItem = (productId, newQuantity) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
  };

  // Handle removing item from cart
  const handleRemoveCartItem = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Handle checkout process
  const handleCheckout = (selectedItems, total) => {
    console.log('=== STORE HANDLE CHECKOUT ===');
    console.log('Store - handleCheckout called');
    console.log('Store - selectedItems received:', selectedItems);
    console.log('Store - selectedItems type:', typeof selectedItems);
    console.log('Store - current cartItems state:', cartItems);
    console.log('Store - cartItems length:', cartItems.length);
    console.log('Store - localStorage cartItems raw:', localStorage.getItem('cartItems'));

    // CRITICAL FIX: Always reload from localStorage right before checkout
    // This ensures we have the most current data regardless of state synchronization issues
    let currentCartItems = [];
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        currentCartItems = JSON.parse(savedCartItems);
        console.log('Store - Fresh localStorage data loaded for checkout:', currentCartItems);
        console.log('Store - Fresh localStorage items count:', currentCartItems.length);

        // Update our state to match localStorage immediately
        setCartItems(currentCartItems);
      } else {
        console.log('Store - No localStorage data found');
        currentCartItems = [];
      }
    } catch (e) {
      console.log('Store - Error parsing localStorage:', e);
      currentCartItems = cartItems; // fallback to current state
    }

    console.log('Store - Using cartItems for filtering:', currentCartItems);

    // Filter cart items to only include selected items
    const itemsToCheckout = currentCartItems.filter(item => {
      const isSelected = selectedItems.includes(item.id);
      console.log(`Item ${item.id} (${item.name}): selected = ${isSelected}`);
      return isSelected;
    });

    console.log('Store - itemsToCheckout after filtering:', itemsToCheckout);
    console.log('Store - itemsToCheckout length:', itemsToCheckout.length);
    console.log('Store - total received:', total);

    // If still no items, there's a fundamental problem - log everything
    if (itemsToCheckout.length === 0) {
      console.log('=== CHECKOUT FAILURE DEBUG ===');
      console.log('Store - No items to checkout after filtering');
      console.log('Store - selectedItems:', selectedItems);
      console.log('Store - currentCartItems:', currentCartItems);
      console.log('Store - currentCartItems IDs:', currentCartItems.map(item => item.id));
      console.log('Store - Checking if any IDs match...');

      selectedItems.forEach(selectedId => {
        const found = currentCartItems.find(item => item.id === selectedId);
        console.log(`Store - Selected ID ${selectedId} found in cart:`, found ? 'YES' : 'NO');
        if (found) {
          console.log(`Store - Found item details:`, found);
        }
      });

      // Last resort: send all cart items if we have selected items but filtering failed
      if (selectedItems.length > 0 && currentCartItems.length > 0) {
        console.log('Store - LAST RESORT: Sending all cart items instead of filtered');
        navigate('/checkout', {
          state: {
            items: currentCartItems,
            total: total
          }
        });
        console.log('=== END STORE HANDLE CHECKOUT (LAST RESORT) ===');
        return;
      }

      console.log('=== END CHECKOUT FAILURE DEBUG ===');
    }

    console.log('Store - Final navigation to checkout with items:', itemsToCheckout);
    console.log('=== END STORE HANDLE CHECKOUT ===');

    // Navigate to checkout page with items and total
    navigate('/checkout', {
      state: {
        items: itemsToCheckout,
        total: total
      }
    });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setActiveView('subcategory');
    setIsMobileNavOpen(false);
  };

  // Handle product click from recently viewed
  const handleProductClick = (product) => {
    try {
      console.log('Product clicked from recently viewed:', product);

      if (!product || !product.id) {
        console.error('Product is undefined or missing ID!');
        return;
      }

      // Add to recently viewed again to update the timestamp/order
      recentlyViewedUtils.addToRecentlyViewed(product);

      console.log('Navigating to:', `/product/${product.id}`);
      navigate(`/product/${product.id}`, { state: { product } });
    } catch (error) {
      console.error('Error in handleProductClick:', error);
      alert('Error navigating to product page. Please try again.');
    }
  };

  // Render the active view
  const renderView = () => {
    switch (activeView) {
      case 'cart':
        return (
          <ShoppingCartView
            cartItems={cartItems}
            updateCartItem={handleUpdateCartItem}
            removeCartItem={handleRemoveCartItem}
            onCheckout={handleCheckout}
          />
        );
      case 'deals':
        return (
          <OffersAndDealsView
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );
      case 'subcategory':
        return (
          <SubcategoryView
            category={activeCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );
      case 'main':
      default:
        return (
          <MainStoreView
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      <div className="container mx-auto pt-4 sm:pt-8 px-4 pb-24 md:pb-8">
        <div className="flex flex-col lg:flex-row">
          {/* Left Navigation - Categories */}
          <LeftNavigation
            activeView={activeView}
            setActiveView={setActiveView}
            onCategorySelect={handleCategorySelect}
            cartItemsCount={cartItems.length}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
            onProductClick={handleProductClick}
          />

          {/* Main Content Area with proper spacing for fixed sidebar */}
          <div className="w-full lg:pl-[290px]">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
