import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { cartApi } from '../../api/storeApi';

const ShoppingCartView = ({ cartItems = [], updateCartItem, removeCartItem, onCheckout }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [backendCartItems, setBackendCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart from backend on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await cartApi.getCart();
          if (response.success && response.cart.items) {
            const formattedItems = response.cart.items.map(item => ({
              id: item.productId._id || item.productId.id,
              name: item.productId.productName || item.productId.name,
              price: item.productId.price,
              quantity: item.quantity,
              image: item.productId.images?.[0]?.url || item.productId.images?.[0] || '/default.jpg'
            }));
            setBackendCartItems(formattedItems);
            setSelectedItems(formattedItems.map(item => item.id));
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart');
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Use backend cart items if available, otherwise use props
  const displayCartItems = backendCartItems.length > 0 ? backendCartItems : cartItems;

  // Update selected items when cart items change
  useEffect(() => {
    setSelectedItems(displayCartItems.map(item => item.id));
  }, [displayCartItems]);

  // Demo data for shipping cost
  const shippingCost = 10.99;

  // Calculate subtotal of selected items
  const calculateSubtotal = () => {
    return displayCartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
      .toFixed(2);
  };

  // Calculate total including shipping
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal + (subtotal > 0 ? shippingCost : 0)).toFixed(2);
  };

  // Toggle item selection
  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === displayCartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayCartItems.map(item => item.id));
    }
  };

  // Handle quantity change with backend API
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity <= 0) return;

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await cartApi.updateCartItem(itemId, newQuantity);
        // Update local state
        setBackendCartItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }

      // Also call parent's updateCartItem if provided
      updateCartItem && updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating cart:', error);
      // Still update local state even if API fails
      updateCartItem && updateCartItem(itemId, newQuantity);
    }
  };

  // Handle remove item with backend API
  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await cartApi.removeFromCart(itemId);
        // Update local state
        setBackendCartItems(prev => prev.filter(item => item.id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
      }

      // Also call parent's removeCartItem if provided
      removeCartItem && removeCartItem(itemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Still update local state even if API fails
      removeCartItem && removeCartItem(itemId);
    }
  };

  // Handle checkout button
  const handleCheckout = () => {
    onCheckout(selectedItems, calculateTotal());
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Page Heading */}
      <h2 className="text-white text-2xl font-bold mb-4">Shopping Cart</h2>
      <hr className="border-gray-600 mb-6" />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-400">{error}</p>
        </div>
      ) : displayCartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white text-lg mb-4">Your shopping cart is empty.</p>
          <p className="text-white/70">Browse products and add items to your cart.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            {/* Select all checkbox */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.length === displayCartItems.length && displayCartItems.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 accent-[#f67a45] mr-3"
              />
              <span className="text-white">Select All Items</span>
            </div>

            {displayCartItems.map(item => (
              <div
                key={item.id}
                className={`mb-4 p-4 rounded-lg backdrop-blur-sm ${selectedItems.includes(item.id)
                  ? 'bg-[#121225] border border-[#f67a45]/30'
                  : 'bg-black/30'
                  }`}
              >
                <div className="flex items-center">
                  {/* Checkbox for selection */}
                  <div className="mr-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 accent-[#f67a45]"
                    />
                  </div>

                  {/* Product image */}
                  <div className="w-24 h-24 bg-gray-700/30 rounded-lg mr-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default.jpg';
                      }}
                    />
                  </div>

                  {/* Product details */}
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-[#f67a45]">${item.price}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center mr-6">
                    <button
                      className="bg-gray-700/50 p-1 rounded-full text-white"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <AiOutlineMinus size={16} />
                    </button>
                    <span className="mx-3 text-white">{item.quantity}</span>
                    <button
                      className="bg-gray-700/50 p-1 rounded-full text-white"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <AiOutlinePlus size={16} />
                    </button>
                  </div>

                  {/* Item total */}
                  <div className="text-white font-medium mr-4">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove button */}
                  <button
                    className="text-gray-400 hover:text-[#f67a45]"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 h-fit sticky top-6">
            <h3 className="text-white text-lg font-bold mb-4">Order Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Selected Items:</span>
                <span className="text-white">{selectedItems.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">Subtotal:</span>
                <span className="text-white">${calculateSubtotal()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">Shipping:</span>
                <span className="text-white">${selectedItems.length > 0 ? shippingCost.toFixed(2) : '0.00'}</span>
              </div>

              <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                <span className="text-white font-medium">Total:</span>
                <span className="text-[#f67a45] font-bold text-lg">${calculateTotal()}</span>
              </div>

              <button
                className="w-full bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartView;
