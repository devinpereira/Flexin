import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { addressesApi, ordersApi } from '../../api/storeApi';
import LeftNavigation from './LeftNavigation';
import Navigation from '../Navigation';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = "0.00" } = location.state || {};

  // Debug: Log cart items
  useEffect(() => {
    console.log('Checkout component loaded');
    console.log('Cart items:', items);
    console.log('Total:', total);

    items.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        id: item.id,
        _id: item._id,
        name: item.name || item.productName,
        price: item.price,
        quantity: item.quantity
      });
    });
  }, [items, total]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Sri Lanka',
    phoneNumber: '',
    isDefault: false
  });

  // Fetch saved addresses from backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const token = localStorage.getItem('token');
        if (token) {
          const response = await addressesApi.getAddresses();
          if (response.success) {
            setSavedAddresses(response.addresses || []);
            // Set default address if available
            const defaultAddress = response.addresses?.find(addr => addr.isDefault);
            if (defaultAddress) {
              setSelectedAddress(defaultAddress);
            }
          }
        } else {
          // Use fallback addresses for demo
          setSavedAddresses([
            { id: 1, name: 'Home', address: '123 Main St, Colombo', isDefault: true },
            { id: 2, name: 'Work', address: '456 Business Ave, Kandy', isDefault: false }
          ]);
          setSelectedAddress({ id: 1, name: 'Home', address: '123 Main St, Colombo', isDefault: true });
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        // Use fallback addresses
        setSavedAddresses([
          { id: 1, name: 'Home', address: '123 Main St, Colombo', isDefault: true },
          { id: 2, name: 'Work', address: '456 Business Ave, Kandy', isDefault: false }
        ]);
        setSelectedAddress({ id: 1, name: 'Home', address: '123 Main St, Colombo', isDefault: true });
      } finally {
        setIsLoadingAddresses(false);
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle navigation for LeftNavigation component
  const handleNavigation = (view) => {
    switch (view) {
      case 'main':
        navigate('/store');
        break;
      case 'cart':
        navigate('/store', { state: { activeView: 'cart' } });
        break;
      case 'deals':
        navigate('/store', { state: { activeView: 'deals' } });
        break;
      case 'orders':
        navigate('/orders');
        break;
      default:
        navigate('/store');
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Comprehensive form validation
  const validateForm = () => {
    const errors = {};

    // Customer info validation
    if (!customerInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!customerInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!customerInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(customerInfo.phone.replace(/[\s-()]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Address validation
    if (!selectedAddress) {
      errors.address = 'Please select a shipping address';
    }

    // Payment validation
    if (!selectedPayment) {
      errors.payment = 'Please select a payment method';
    }

    return errors;
  };

  // Validate cart items before checkout
  const validateCartItems = async () => {
    try {
      const { productsApi } = await import('../../api/storeApi');

      for (const item of items) {
        const productId = item.id || item._id;
        if (!productId) {
          throw new Error(`Product ${item.name} is missing ID`);
        }

        try {
          const response = await productsApi.getProduct(productId);
          if (!response.success || !response.product) {
            throw new Error(`Product ${item.name} is no longer available`);
          }

          const product = response.product;
          if (!product.isActive) {
            throw new Error(`Product ${item.name} is no longer available`);
          }

          if (product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name}. Only ${product.quantity} available`);
          }
        } catch (productError) {
          if (productError.message.includes('404')) {
            throw new Error(`Product ${item.name} was not found`);
          }
          throw productError;
        }
      }

      return true;
    } catch (error) {
      console.error('Cart validation error:', error);
      throw error;
    }
  };

  // Handle address input changes
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  // Create new address
  const handleCreateAddress = async () => {
    try {
      // Validate required fields (matching backend requirements)
      if (!newAddressData.fullName || !newAddressData.addressLine1 || !newAddressData.city ||
        !newAddressData.state || !newAddressData.postalCode || !newAddressData.country ||
        !newAddressData.phoneNumber) {
        alert('Please fill in all required fields');
        return;
      }

      const addressPayload = {
        fullName: newAddressData.fullName,
        addressLine1: newAddressData.addressLine1,
        addressLine2: newAddressData.addressLine2,
        city: newAddressData.city,
        state: newAddressData.state,
        postalCode: newAddressData.postalCode,
        country: newAddressData.country,
        phoneNumber: newAddressData.phoneNumber,
        isDefault: newAddressData.isDefault
      };

      const response = await addressesApi.createAddress(addressPayload);
      if (response.success) {
        const newAddress = response.address;
        setSavedAddresses(prev => [...prev, newAddress]);
        setSelectedAddress(newAddress);
        setNewAddressData({
          fullName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Sri Lanka',
          phoneNumber: '',
          isDefault: false
        });
        setShowAddressModal(false);
        alert('Address added successfully!');
      }
    } catch (error) {
      console.error('Error creating address:', error);
      alert(error.response?.data?.message || 'Failed to create address. Please try again.');
    }
  };

  // Handle form submission - Create order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate all items have valid product IDs
    const invalidItems = items.filter(item => !item.id && !item._id);
    if (invalidItems.length > 0) {
      console.error('Items with missing IDs:', invalidItems);
      alert('Some items in your cart are missing product information. Please refresh your cart and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // First validate cart items exist and are available
      await validateCartItems();

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id || item._id,
          quantity: item.quantity
        })),
        addressId: selectedAddress.id || selectedAddress._id,
        paymentMethod: selectedPayment.type, // This should be 'card', 'paypal', or 'cash_on_delivery'
        customerInfo
      };

      console.log('Order data being sent:', orderData);
      console.log('Selected payment details:', selectedPayment);
      console.log('Items details:', items);

      const response = await ordersApi.createOrder(orderData);

      if (response.success) {
        // Navigate to order confirmation page
        navigate('/order-confirmation', {
          state: {
            orderId: response.order._id,
            orderDetails: response.order,
            customerInfo,
            selectedAddress,
            items,
            total
          }
        });
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));

      // More specific error messages
      if (error.message && error.message.includes('not found')) {
        alert('One or more products in your cart are no longer available. Please refresh your cart and try again.');
        // Optionally redirect back to cart
        setTimeout(() => {
          navigate('/store/cart');
        }, 2000);
      } else if (error.message && error.message.includes('Insufficient stock')) {
        alert('Some items in your cart don\'t have enough stock. Please update quantities and try again.');
        setTimeout(() => {
          navigate('/store/cart');
        }, 2000);
      } else if (error.message && error.message.includes('no longer available')) {
        alert('Some products in your cart are no longer available. Please remove them and try again.');
        setTimeout(() => {
          navigate('/store/cart');
        }, 2000);
      } else {
        alert(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while fetching initial data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
        <Navigation />
        <div className="container mx-auto pt-8 px-4">
          <div className="flex flex-col lg:flex-row">
            <LeftNavigation
              activeView="cart"
              setActiveView={handleNavigation}
              onCategorySelect={() => navigate('/store')}
              cartItemsCount={0}
              isMobileNavOpen={isMobileNavOpen}
              setIsMobileNavOpen={setIsMobileNavOpen}
              onProductClick={() => { }}
            />
            <div className="w-full lg:pl-80">
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white text-lg">Loading checkout...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      <div className="container mx-auto pt-8 px-4">
        <div className="flex flex-col lg:flex-row">
          <LeftNavigation
            activeView="cart"
            setActiveView={handleNavigation}
            onCategorySelect={() => navigate('/store')}
            cartItemsCount={items.length}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
            onProductClick={() => { }}
          />

          <div className="w-full lg:pl-80">
            <h1 className="text-white text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main checkout form */}
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSubmit}>
                  {/* Customer Information */}
                  <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                    <h2 className="text-white text-xl font-bold mb-4">Customer Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-colors ${formErrors.firstName
                            ? 'border-red-500 focus:ring-red-500 error-field'
                            : 'border-white/30 focus:ring-[#F16436]'
                            }`}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-colors ${formErrors.lastName
                            ? 'border-red-500 focus:ring-red-500 error-field'
                            : 'border-white/30 focus:ring-[#F16436]'
                            }`}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-colors ${formErrors.email
                            ? 'border-red-500 focus:ring-red-500 error-field'
                            : 'border-white/30 focus:ring-[#F16436]'
                            }`}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-colors ${formErrors.phone
                            ? 'border-red-500 focus:ring-red-500 error-field'
                            : 'border-white/30 focus:ring-[#F16436]'
                            }`}
                          placeholder="Enter your phone number"
                        />
                        {formErrors.phone && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-white text-xl font-bold">Shipping Address *</h2>
                      <button
                        type="button"
                        className="bg-[#f67a45] text-white px-4 py-2 rounded-md text-sm hover:bg-[#e56d3d] transition-colors"
                        onClick={() => setShowAddressModal(true)}
                      >
                        {selectedAddress ? 'Change' : 'Add'} Address
                      </button>
                    </div>

                    {selectedAddress ? (
                      <div className="bg-[#1e1e35] p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-white font-medium">{selectedAddress.fullName || selectedAddress.name}</p>
                        <p className="text-white/70">{selectedAddress.address || `${selectedAddress.addressLine1}, ${selectedAddress.city} ${selectedAddress.postalCode}`}</p>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg border-2 border-dashed ${formErrors.address ? 'border-red-500 bg-red-500/10' : 'border-white/30'}`}>
                        <p className="text-white/70 text-center">No shipping address selected</p>
                      </div>
                    )}
                    {formErrors.address && (
                      <p className="text-red-400 text-sm mt-2">{formErrors.address}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-white text-xl font-bold">Payment Method *</h2>
                      <button
                        type="button"
                        className="bg-[#f67a45] text-white px-4 py-2 rounded-md text-sm hover:bg-[#e56d3d] transition-colors"
                        onClick={() => setShowPaymentModal(true)}
                      >
                        {selectedPayment ? 'Change' : 'Add'} Payment
                      </button>
                    </div>

                    {selectedPayment ? (
                      <div className="bg-[#1e1e35] p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-white font-medium">{selectedPayment.displayName || selectedPayment.type}</p>
                        {selectedPayment.type === 'card' && (
                          <p className="text-white/70">**** **** **** {selectedPayment.lastFour}</p>
                        )}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg border-2 border-dashed ${formErrors.payment ? 'border-red-500 bg-red-500/10' : 'border-white/30'}`}>
                        <p className="text-white/70 text-center">No payment method selected</p>
                      </div>
                    )}
                    {formErrors.payment && (
                      <p className="text-red-400 text-sm mt-2">{formErrors.payment}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-6">
                  <h2 className="text-white text-xl font-bold mb-4">Order Summary</h2>

                  <div className="max-h-80 overflow-y-auto mb-4">
                    {items.map(item => (
                      <div key={item.id || item._id} className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gray-700/30 rounded-lg mr-3">
                          <img
                            src={item.image || item.images?.[0]?.url || item.images?.[0] || '/default.jpg'}
                            alt={item.name || item.productName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/default.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{item.name || item.productName}</p>
                          <div className="flex justify-between">
                            <span className="text-white/70">x{item.quantity}</span>
                            <span className="text-[#f67a45]">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70">Subtotal:</span>
                      <span className="text-white">${parseFloat(total) - 10.99}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70">Shipping:</span>
                      <span className="text-white">$10.99</span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className="text-white font-medium">Total:</span>
                      <span className="text-[#f67a45] font-bold text-lg">${total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-bold">Select Payment Method</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <button
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${paymentMethod === 'card'
                      ? 'border-[#f67a45] bg-[#f67a45]/10'
                      : 'border-white/30 hover:border-white/50'
                      }`}
                    onClick={() => handlePaymentMethodSelect('card')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        💳
                      </div>
                      <div>
                        <p className="text-white font-medium">Credit/Debit Card</p>
                        <p className="text-white/70 text-sm">Pay with Visa, Mastercard, etc.</p>
                      </div>
                    </div>
                  </button>

                  <button
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${paymentMethod === 'paypal'
                      ? 'border-[#f67a45] bg-[#f67a45]/10'
                      : 'border-white/30 hover:border-white/50'
                      }`}
                    onClick={() => handlePaymentMethodSelect('paypal')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        🅿️
                      </div>
                      <div>
                        <p className="text-white font-medium">PayPal</p>
                        <p className="text-white/70 text-sm">Pay with your PayPal account</p>
                      </div>
                    </div>
                  </button>

                  <button
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${paymentMethod === 'cash'
                      ? 'border-[#f67a45] bg-[#f67a45]/10'
                      : 'border-white/30 hover:border-white/50'
                      }`}
                    onClick={() => handlePaymentMethodSelect('cash')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        💵
                      </div>
                      <div>
                        <p className="text-white font-medium">Cash on Delivery</p>
                        <p className="text-white/70 text-sm">Pay when you receive your order</p>
                      </div>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6 p-4 bg-[#1a1a2f] rounded-lg">
                    <h4 className="text-white font-medium mb-3">Card Details</h4>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f67a45] transition-colors"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f67a45] transition-colors"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          CVC *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f67a45] transition-colors"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f67a45] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="mb-6 p-4 bg-[#1a1a2f] rounded-lg">
                    <p className="text-white/70 text-sm">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="mb-6 p-4 bg-[#1a1a2f] rounded-lg">
                    <p className="text-white/70 text-sm">
                      You can pay with cash when your order is delivered. Please have the exact amount ready.
                    </p>
                  </div>
                )}

                <button
                  className="w-full bg-[#f67a45] text-white py-3 rounded-lg hover:bg-[#e56d3d] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!paymentMethod}
                  onClick={() => {
                    if (paymentMethod) {
                      setSelectedPayment({
                        type: paymentMethod === 'card' ? 'card' :
                          paymentMethod === 'paypal' ? 'paypal' : 'cash_on_delivery',
                        displayName: paymentMethod === 'card' ? 'Credit Card' :
                          paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery',
                        lastFour: paymentMethod === 'card' ? '4242' : undefined
                      });
                      setShowPaymentModal(false);
                    }
                  }}
                >
                  {paymentMethod ? 'Save Payment Method' : 'Select a Payment Method'}
                </button>
              </div>
            </div>
          )}

          {/* Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-white text-lg sm:text-xl font-bold">Shipping Address</h3>
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="text-white/70 hover:text-white p-1"
                  >
                    <AiOutlineClose size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-4 sm:mb-6 bg-[#1a1a2f] rounded-lg p-1">
                  <button
                    className={`flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-md transition-colors ${!useNewAddress ? 'bg-[#f67a45] text-white' : 'bg-transparent text-white/70 hover:text-white'}`}
                    onClick={() => setUseNewAddress(false)}
                  >
                    Use Saved Address
                  </button>
                  <button
                    className={`flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-md transition-colors ${useNewAddress ? 'bg-[#f67a45] text-white' : 'bg-transparent text-white/70 hover:text-white'}`}
                    onClick={() => setUseNewAddress(true)}
                  >
                    Add New Address
                  </button>
                </div>

                {!useNewAddress ? (
                  <div className="space-y-2 sm:space-y-3">
                    {isLoading ? (
                      <p className="text-white/70 text-sm sm:text-base">Loading addresses...</p>
                    ) : savedAddresses.length > 0 ? (
                      savedAddresses.map(address => (
                        <div
                          key={address.id || address._id}
                          className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${address.isDefault ? 'bg-[#1e1e35] border border-[#f67a45]/30' : 'bg-[#1a1a2f] hover:bg-[#1e1e35]'
                            }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="text-white font-medium text-sm sm:text-base">{address.fullName || address.name}</p>
                            {address.isDefault && (
                              <span className="text-xs bg-[#f67a45]/20 text-[#f67a45] px-2 py-1 rounded-full flex-shrink-0">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-sm sm:text-base mt-1">{address.address || `${address.addressLine1}, ${address.city} ${address.postalCode}`}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/70 text-sm sm:text-base">No saved addresses found</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={newAddressData.fullName}
                        onChange={handleAddressInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={newAddressData.addressLine1}
                        onChange={handleAddressInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={newAddressData.addressLine2}
                        onChange={handleAddressInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={newAddressData.city}
                          onChange={handleAddressInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                          placeholder="Colombo"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={newAddressData.state}
                          onChange={handleAddressInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                          placeholder="Western Province"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={newAddressData.postalCode}
                          onChange={handleAddressInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                          placeholder="00100"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={newAddressData.country}
                          onChange={handleAddressInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#121225] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                          required
                        >
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={newAddressData.phoneNumber}
                        onChange={handleAddressInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436] text-sm sm:text-base"
                        placeholder="+94 77 123 4567"
                        required
                      />
                    </div>

                    <div className="flex items-center pt-2">
                      <input
                        type="checkbox"
                        id="makeDefault"
                        name="isDefault"
                        checked={newAddressData.isDefault}
                        onChange={handleAddressInputChange}
                        className="w-4 h-4 accent-[#f67a45] flex-shrink-0"
                      />
                      <label htmlFor="makeDefault" className="ml-2 sm:ml-3 text-white text-sm sm:text-base">
                        Make this my default address
                      </label>
                    </div>
                  </div>
                )}

                <button
                  className="w-full mt-4 sm:mt-6 bg-[#f67a45] text-white py-2.5 sm:py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base"
                  onClick={() => {
                    if (!useNewAddress) {
                      // Use selected saved address
                      const selected = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
                      if (selected) {
                        setSelectedAddress(selected);
                      }
                      setShowAddressModal(false);
                    } else {
                      // Create new address
                      if (newAddressData.fullName && newAddressData.addressLine1 && newAddressData.city &&
                        newAddressData.state && newAddressData.postalCode && newAddressData.country &&
                        newAddressData.phoneNumber) {
                        handleCreateAddress();
                      } else {
                        alert('Please fill in all required fields (marked with *)');
                      }
                    }
                  }}
                >
                  {useNewAddress ? 'Add Address' : 'Use Selected Address'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
