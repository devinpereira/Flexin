import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { addressesApi, ordersApi } from '../../api/storeApi';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = "0.00" } = location.state || {};

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
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        // Use fallback addresses
        setSavedAddresses([
          { id: 1, name: 'Home', address: '123 Main St, Colombo', isDefault: true },
          { id: 2, name: 'Work', address: '456 Business Ave, Kandy', isDefault: false }
        ]);
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
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

    if (!selectedAddress || !selectedPayment) {
      alert('Please select both shipping address and payment method');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id || item._id,
          quantity: item.quantity
        })),
        addressId: selectedAddress.id || selectedAddress._id,
        paymentMethod: selectedPayment.type,
        customerInfo
      };

      const response = await ordersApi.createOrder(orderData);

      if (response.success) {
        alert('Order placed successfully!');
        navigate('/store', {
          state: {
            message: 'Order placed successfully!',
            orderId: response.order._id
          }
        });
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>

      <div className="container mx-auto pt-8 px-4 overflow-x-hidden">
        <h1 className="text-white text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2 space-y-6 overflow-auto max-h-[90vh]">
            <form onSubmit={handleSubmit}>
              {/* Customer Information */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                <h2 className="text-white text-xl font-bold mb-4">Customer Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-bold">Shipping Address</h2>
                  <button
                    type="button"
                    className="bg-[#f67a45] text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => setShowAddressModal(true)}
                  >
                    {selectedAddress ? 'Change' : 'Add'} Address
                  </button>
                </div>

                {selectedAddress ? (
                  <div className="bg-[#1e1e35] p-4 rounded-lg">
                    <p className="text-white font-medium">{selectedAddress.fullName || selectedAddress.name}</p>
                    <p className="text-white/70">{selectedAddress.address || `${selectedAddress.addressLine1}, ${selectedAddress.city} ${selectedAddress.postalCode}`}</p>
                  </div>
                ) : (
                  <p className="text-white/70">No shipping address selected</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-bold">Payment Method</h2>
                  <button
                    type="button"
                    className="bg-[#f67a45] text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    {selectedPayment ? 'Change' : 'Add'} Payment
                  </button>
                </div>

                {selectedPayment ? (
                  <div className="bg-[#1e1e35] p-4 rounded-lg">
                    <p className="text-white font-medium">{selectedPayment.type}</p>
                    {selectedPayment.type === 'Card' && (
                      <p className="text-white/70">**** **** **** {selectedPayment.lastFour}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white/70">No payment method selected</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedAddress || !selectedPayment || isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="overflow-auto max-h-[90vh]">
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-6">
              <h2 className="text-white text-xl font-bold mb-4">Order Summary</h2>

              <div className="max-h-80 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id || item._id} className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-700/30 rounded-lg mr-3">
                      <img
                        src={item.image || item.images?.[0] || '/default.jpg'}
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Select Payment Method</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-white/70 hover:text-white"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <button
                className={`w-full text-left p-4 rounded-lg border ${paymentMethod === 'card' ? 'border-[#f67a45]' : 'border-white/30'
                  }`}
                onClick={() => handlePaymentMethodSelect('card')}
              >
                <p className="text-white font-medium">Credit/Debit Card</p>
                <p className="text-white/70 text-sm">Pay with Visa, Mastercard, etc.</p>
              </button>

              <button
                className={`w-full text-left p-4 rounded-lg border ${paymentMethod === 'online' ? 'border-[#f67a45]' : 'border-white/30'
                  }`}
                onClick={() => handlePaymentMethodSelect('online')}
              >
                <p className="text-white font-medium">Online Payment</p>
                <p className="text-white/70 text-sm">Pay with PayPal, Apple Pay, etc.</p>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <button
              className="w-full mt-6 bg-[#f67a45] text-white py-3 rounded-md hover:bg-[#e56d3d] transition-colors font-medium"
              onClick={() => {
                setSelectedPayment({
                  type: paymentMethod === 'card' ? 'Card' : 'Online Payment',
                  lastFour: '4242'
                });
                setShowPaymentModal(false);
              }}
            >
              Save Payment Method
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
  );
};

export default Checkout;
