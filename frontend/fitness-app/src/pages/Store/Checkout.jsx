import React from 'react';
import CheckoutComponent from '../../components/Store/Checkout';
import Navigation from '../../components/Navigation';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      <CheckoutComponent />
    </div>
  );
};

export default CheckoutPage;
