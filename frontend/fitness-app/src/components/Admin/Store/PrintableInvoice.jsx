import React, { forwardRef } from 'react';
import { format } from 'date-fns';

const PrintableInvoice = forwardRef(({ order }, ref) => {
  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Helper function to safely format dates
  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return 'N/A';

      // If it's already a formatted string, return it
      if (typeof dateValue === 'string' && dateValue.includes('/')) {
        return dateValue;
      }

      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }

      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  return (
    <div ref={ref} className="p-8 bg-white text-black">
      {/* Company Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">PulsePlus Fitness</h1>
          <p className="text-gray-600">123 Fitness Street</p>
          <p className="text-gray-600">Colombo, Sri Lanka</p>
          <p className="text-gray-600">Tel: +94 11 234 5678</p>
          <p className="text-gray-600">Email: sales@pulseplus.com</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800 mb-2">INVOICE</h2>
          <p className="text-gray-600">Invoice #: {order.id || 'N/A'}</p>
          <p className="text-gray-600">Date: {formatDate(order.date || order.createdAt)}</p>
          <p className="text-gray-600">Payment Status: {order.paymentStatus || 'N/A'}</p>
          <p className="text-gray-600">Order Status: {order.status || order.orderStatus || 'N/A'}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-8">
        <h3 className="text-gray-800 font-bold mb-2">Bill To:</h3>
        <p className="text-gray-600">{order.customerName || 'N/A'}</p>
        <p className="text-gray-600">{order.email || 'N/A'}</p>
        <p className="text-gray-600">{order.shippingAddress?.street || 'N/A'}</p>
        <p className="text-gray-600">
          {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} {order.shippingAddress?.zip || 'N/A'}
        </p>
        <p className="text-gray-600">{order.shippingAddress?.country || 'N/A'}</p>
      </div>

      {/* Order Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="py-2 text-left text-gray-800">Item</th>
            <th className="py-2 text-center text-gray-800">Quantity</th>
            <th className="py-2 text-right text-gray-800">Price</th>
            <th className="py-2 text-right text-gray-800">Total</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {(order.items || []).map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2 text-left">{item.name || 'N/A'}</td>
              <td className="py-2 text-center">{item.quantity || 0}</td>
              <td className="py-2 text-right">${(item.price || 0).toFixed(2)}</td>
              <td className="py-2 text-right">${(item.total || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-800">${(order.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tax:</span>
            <span className="text-gray-800">${(order.tax || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping:</span>
            <span className="text-gray-800">${(order.shipping || 0).toFixed(2)}</span>
          </div>
          {(order.discount && order.discount > 0) && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Discount:</span>
              <span className="text-gray-800">-${(order.discount || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
            <span className="text-gray-800">Total:</span>
            <span className="text-gray-800">${(order.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="border-t border-gray-300 pt-4">
        <p className="text-gray-600 text-sm mb-2">{order.notes || ''}</p>
        <p className="text-gray-600 text-sm mb-2">
          Payment Method: {order.paymentMethod ?
            order.paymentMethod.replace('_', ' ').split(' ').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ') : 'N/A'
          }
        </p>
        <p className="text-gray-600 text-sm">Thank you for your business!</p>
      </div>
    </div>
  );
});

PrintableInvoice.displayName = 'PrintableInvoice';

export default PrintableInvoice;