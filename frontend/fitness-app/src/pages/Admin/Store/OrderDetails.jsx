import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPrint, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import PrintableInvoice from '../../../components/Admin/Store/PrintableInvoice';
import { adminOrdersApi } from '../../../api/adminStoreApi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
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

  // Load order data from backend
  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      const response = await adminOrdersApi.getOrder(orderId);
      if (response.success) {
        // Map backend data to frontend format
        const orderData = response.data;
        const mappedOrder = {
          id: orderData.orderNumber,
          orderId: orderData._id,
          customerName: orderData.customerInfo?.name || orderData.userId?.fullName || 'Unknown Customer',
          email: orderData.customerInfo?.email || orderData.userId?.email || '',
          phone: orderData.customerInfo?.phone || orderData.userId?.phone || '',
          date: new Date(orderData.createdAt).toLocaleDateString(),
          status: orderData.orderStatus,
          paymentStatus: orderData.paymentStatus,
          paymentMethod: orderData.paymentMethod || 'card',
          items: orderData.items.map(item => ({
            id: item.productId?._id || item.productId,
            name: item.productName,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.totalPrice,
            image: item.productImage
          })),
          subtotal: orderData.pricing.subtotal,
          tax: orderData.pricing.taxAmount || 0,
          shipping: orderData.pricing.shippingCost || 0,
          discount: orderData.pricing.discountAmount || 0,
          total: orderData.pricing.totalPrice,
          shippingAddress: {
            fullName: orderData.shippingAddress?.fullName || '',
            street: orderData.shippingAddress?.addressLine1 || '',
            city: orderData.shippingAddress?.city || '',
            state: orderData.shippingAddress?.state || '',
            zip: orderData.shippingAddress?.postalCode || '',
            country: orderData.shippingAddress?.country || ''
          },
          notes: orderData.notes?.customerNotes || orderData.notes?.adminNotes || '',
          trackingNumber: orderData.shipping?.trackingNumber || '',
          statusHistory: orderData.statusHistory || []
        };
        setOrder(mappedOrder);
      } else {
        setOrder(null);
        showError('Order not found');
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      setOrder(null);
      showError(error.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update Order Status',
      message: `Are you sure you want to mark this order as ${newStatus}?`,
      onConfirm: async () => {
        try {
          const response = await adminOrdersApi.updateOrderStatus(order.orderId, newStatus);
          if (response.success) {
            showSuccess(`Order status updated to ${newStatus}`);
            loadOrderData(); // Reload order data to reflect changes
          }
        } catch (error) {
          showError(error.message || 'Failed to update order status');
        }
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
      pending: 'bg-blue-500/20 text-blue-400 border-blue-500',
      confirmed: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
      processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      picked: 'bg-orange-500/20 text-orange-400 border-orange-500',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500',
      delivered: 'bg-green-500/20 text-green-400 border-green-500',
      canceled: 'bg-red-500/20 text-red-400 border-red-500',
      refunded: 'bg-gray-500/20 text-gray-400 border-gray-500',
      returned: 'bg-indigo-500/20 text-indigo-400 border-indigo-500'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Render payment status badge
  const renderPaymentStatus = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      paid: 'bg-green-500/20 text-green-400 border-green-500',
      failed: 'bg-red-500/20 text-red-400 border-red-500',
      refunded: 'bg-gray-500/20 text-gray-400 border-gray-500',
      partially_refunded: 'bg-orange-500/20 text-orange-400 border-orange-500'
    };

    const displayText = status === 'partially_refunded' ? 'Partially Refunded' :
      status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || styles.pending}`}>
        {displayText}
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

          {order.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('confirmed')}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              <FaCheckCircle /> Confirm Order
            </button>
          )}

          {order.status === 'confirmed' && (
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

          {order.status === 'shipped' && (
            <button
              onClick={() => handleStatusChange('delivered')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaCheckCircle /> Mark as Delivered
            </button>
          )}

          {['pending', 'confirmed', 'processing'].includes(order.status) && (
            <button
              onClick={() => handleStatusChange('canceled')}
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