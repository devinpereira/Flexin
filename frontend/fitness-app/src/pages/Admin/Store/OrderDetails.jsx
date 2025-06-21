import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPrint, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import PrintableInvoice from '../../../components/Admin/Store/PrintableInvoice';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef();

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });

  // Mock order data
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setOrder({
        id: orderId,
        customerName: 'John Smith',
        email: 'john.smith@example.com',
        date: '2025-06-20',
        status: 'new',
        total: 149.97,
        items: [
          { id: 1, name: 'Whey Protein', quantity: 1, price: 49.99, total: 49.99 },
          { id: 2, name: 'BCAA Supplement', quantity: 2, price: 29.99, total: 59.98 },
          { id: 3, name: 'Shaker Bottle', quantity: 1, price: 9.99, total: 9.99 }
        ],
        subtotal: 119.96,
        tax: 10.80,
        shipping: 19.21,
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        shippingAddress: {
          street: '123 Main St',
          city: 'Fitness City',
          state: 'FC',
          zip: '12345',
          country: 'United States'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'Fitness City',
          state: 'FC',
          zip: '12345',
          country: 'United States'
        },
        notes: 'Priority shipping requested'
      });
      setIsLoading(false);
    }, 1000);
  }, [orderId]);

  const handleStatusChange = (newStatus) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update Order Status',
      message: `Are you sure you want to mark this order as ${newStatus}?`,
      onConfirm: () => {
        setOrder(prev => ({ ...prev, status: newStatus }));
        showSuccess(`Order status updated to ${newStatus}`);
      },
      type: 'warning'
    });
  };

  const handleGoBack = () => {
    navigate('/admin/store/orders');
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${orderId}`,
    onAfterPrint: () => showSuccess('Invoice printed successfully')
  });

  // Render status badge
  const renderStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500',
      processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500',
      completed: 'bg-green-500/20 text-green-400 border-green-500',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Render payment status badge
  const renderPaymentStatus = (status) => {
    const styles = {
      paid: 'bg-green-500/20 text-green-400 border-green-500',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      failed: 'bg-red-500/20 text-red-400 border-red-500'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Order Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f67a45]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout pageTitle="Order Details">
        <div className="text-center text-white py-8">
          Order not found
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle={`Order Details #${orderId}`}>
      {/* Hidden printable invoice */}
      <div style={{ display: 'none' }}>
        <PrintableInvoice ref={printRef} order={order} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleGoBack}
          className="bg-[#121225] text-white px-4 py-2 rounded-lg hover:bg-[#1d1d3a] transition-colors flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Orders
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-[#121225] text-white px-4 py-2 rounded-lg hover:bg-[#1d1d3a] transition-colors flex items-center gap-2"
          >
            <FaPrint /> Print Order
          </button>

          {order.status === 'new' && (
            <button
              onClick={() => handleStatusChange('processing')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
            >
              <FaCheckCircle /> Mark as Processing
            </button>
          )}

          {order.status === 'processing' && (
            <button
              onClick={() => handleStatusChange('shipped')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaTruck /> Mark as Shipped
            </button>
          )}

          {['new', 'processing'].includes(order.status) && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FaTimesCircle /> Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order Summary Card */}
        <div className="lg:col-span-2 bg-[#121225] rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-white text-xl font-bold mb-2">Order Summary</h2>
              <p className="text-white/70">Order ID: {order.id}</p>
              <p className="text-white/70">Date: {order.date}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">{renderStatusBadge(order.status)}</div>
              <div>{renderPaymentStatus(order.paymentStatus)}</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-white font-medium mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white/70">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {order.items.map((item) => (
                    <tr key={item.id} className="text-white">
                      <td className="py-3">{item.name}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/10 mt-4 pt-4">
              <div className="flex justify-between text-white/70 mb-2">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70 mb-2">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70 mb-4">
                <span>Shipping:</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Card */}
        <div className="space-y-6">
          <div className="bg-[#121225] rounded-lg p-6">
            <h3 className="text-white font-bold mb-4">Customer Information</h3>
            <div className="space-y-2 text-white">
              <p>{order.customerName}</p>
              <p className="text-white/70">{order.email}</p>
            </div>
          </div>

          <div className="bg-[#121225] rounded-lg p-6">
            <h3 className="text-white font-bold mb-4">Shipping Address</h3>
            <div className="space-y-1 text-white/70">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-[#121225] rounded-lg p-6">
            <h3 className="text-white font-bold mb-4">Payment Information</h3>
            <div className="space-y-2">
              <p className="text-white/70">Payment Method: {order.paymentMethod.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
              <p className="text-white/70">Payment Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-[#121225] rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">Order Notes</h3>
              <p className="text-white/70">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type={confirmDialog.type}
      />
    </AdminLayout>
  );
};

export default OrderDetails;