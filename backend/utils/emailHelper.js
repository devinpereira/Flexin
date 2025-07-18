import transporter from '../config/nodemailer.js';
import { ORDER_CONFIRMATION_TEMPLATE, ORDER_SHIPPED_TEMPLATE } from './emailTemplates.js';

/**
 * Send order confirmation email to customer
 * @param {Object} orderData - Order data object
 * @param {string} orderData.customerEmail - Customer's email address
 * @param {string} orderData.customerName - Customer's name
 * @param {string} orderData.orderNumber - Order number
 * @param {Date} orderData.orderDate - Order date
 * @param {Array} orderData.items - Array of order items
 * @param {Object} orderData.pricing - Pricing breakdown
 * @param {Object} orderData.shippingAddress - Shipping address
 * @param {string} orderData.paymentMethod - Payment method
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendOrderConfirmationEmail = async (orderData) => {
    try {
        const {
            customerEmail,
            customerName,
            orderNumber,
            orderDate,
            items,
            pricing,
            shippingAddress,
            paymentMethod
        } = orderData;

        // Format order date
        const formattedDate = new Date(orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Generate order items HTML
        const orderItemsHTML = items.map(item => `
      <tr>
        <td class="product-name">${item.productName || item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
        <td style="text-align: right;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

        // Format shipping address
        const formattedShippingAddress = `
      ${shippingAddress.fullName}<br>
      ${shippingAddress.addressLine1}<br>
      ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + '<br>' : ''}
      ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
      ${shippingAddress.country}<br>
      Phone: ${shippingAddress.phoneNumber}
    `;

        // Format payment method
        const formattedPaymentMethod = paymentMethod
            .replace('_', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Replace template variables
        let emailHTML = ORDER_CONFIRMATION_TEMPLATE
            .replace(/__CUSTOMER_NAME__/g, customerName)
            .replace(/__ORDER_NUMBER__/g, orderNumber)
            .replace(/__ORDER_DATE__/g, formattedDate)
            .replace(/__ORDER_ITEMS__/g, orderItemsHTML)
            .replace(/__SUBTOTAL__/g, parseFloat(pricing.subtotal).toFixed(2))
            .replace(/__SHIPPING__/g, parseFloat(pricing.shippingCost).toFixed(2))
            .replace(/__TAX__/g, parseFloat(pricing.taxAmount).toFixed(2))
            .replace(/__TOTAL__/g, parseFloat(pricing.totalPrice).toFixed(2))
            .replace(/__SHIPPING_ADDRESS__/g, formattedShippingAddress)
            .replace(/__PAYMENT_METHOD__/g, formattedPaymentMethod);

        // Handle discount if present
        if (pricing.discountAmount && pricing.discountAmount > 0) {
            emailHTML = emailHTML.replace(/__DISCOUNT_START__/g, '').replace(/__DISCOUNT_END__/g, '');
            emailHTML = emailHTML.replace(/__DISCOUNT__/g, parseFloat(pricing.discountAmount).toFixed(2));
        } else {
            // Remove discount section if no discount
            emailHTML = emailHTML.replace(/__DISCOUNT_START__[\s\S]*?__DISCOUNT_END__/g, '');
        }

        // Email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: customerEmail,
            subject: `Order Confirmed - ${orderNumber} | PulsePlus`,
            html: emailHTML
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('Order confirmation email sent:', {
            orderNumber,
            customerEmail,
            messageId: info.messageId
        });

        return {
            success: true,
            messageId: info.messageId,
            message: 'Order confirmation email sent successfully'
        };

    } catch (error) {
        console.error('Error sending order confirmation email:', error);

        return {
            success: false,
            error: error.message,
            message: 'Failed to send order confirmation email'
        };
    }
};

/**
 * Prepare order data for email from StoreOrder model
 * @param {Object} order - StoreOrder document
 * @returns {Object} - Formatted order data for email
 */
export const prepareOrderDataForEmail = (order) => {
    return {
        customerEmail: order.customerInfo.email,
        customerName: order.customerInfo.name,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        items: order.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            name: item.productName // fallback
        })),
        pricing: {
            subtotal: order.pricing.subtotal,
            shippingCost: order.pricing.shippingCost,
            taxAmount: order.pricing.taxAmount,
            discountAmount: order.pricing.discountAmount,
            totalPrice: order.pricing.totalPrice
        },
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod
    };
};

/**
 * Test function to validate email template rendering
 * @param {Object} orderData - Sample order data
 * @returns {string} - Rendered HTML
 */
export const testEmailTemplate = (orderData) => {
    try {
        // Generate test order items HTML
        const orderItemsHTML = orderData.items.map(item => `
      <tr>
        <td class="product-name">${item.productName || item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
        <td style="text-align: right;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

        // Format shipping address
        const formattedShippingAddress = `
      ${orderData.shippingAddress.fullName}<br>
      ${orderData.shippingAddress.addressLine1}<br>
      ${orderData.shippingAddress.addressLine2 ? orderData.shippingAddress.addressLine2 + '<br>' : ''}
      ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}<br>
      ${orderData.shippingAddress.country}<br>
      Phone: ${orderData.shippingAddress.phoneNumber}
    `;

        // Format payment method
        const formattedPaymentMethod = orderData.paymentMethod
            .replace('_', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Format order date
        const formattedDate = new Date(orderData.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Replace template variables
        let emailHTML = ORDER_CONFIRMATION_TEMPLATE
            .replace(/__CUSTOMER_NAME__/g, orderData.customerName)
            .replace(/__ORDER_NUMBER__/g, orderData.orderNumber)
            .replace(/__ORDER_DATE__/g, formattedDate)
            .replace(/__ORDER_ITEMS__/g, orderItemsHTML)
            .replace(/__SUBTOTAL__/g, parseFloat(orderData.pricing.subtotal).toFixed(2))
            .replace(/__SHIPPING__/g, parseFloat(orderData.pricing.shippingCost).toFixed(2))
            .replace(/__TAX__/g, parseFloat(orderData.pricing.taxAmount).toFixed(2))
            .replace(/__TOTAL__/g, parseFloat(orderData.pricing.totalPrice).toFixed(2))
            .replace(/__SHIPPING_ADDRESS__/g, formattedShippingAddress)
            .replace(/__PAYMENT_METHOD__/g, formattedPaymentMethod);

        // Handle discount if present
        if (orderData.pricing.discountAmount && orderData.pricing.discountAmount > 0) {
            emailHTML = emailHTML.replace(/__DISCOUNT_START__/g, '').replace(/__DISCOUNT_END__/g, '');
            emailHTML = emailHTML.replace(/__DISCOUNT__/g, parseFloat(orderData.pricing.discountAmount).toFixed(2));
        } else {
            // Remove discount section if no discount
            emailHTML = emailHTML.replace(/__DISCOUNT_START__[\s\S]*?__DISCOUNT_END__/g, '');
        }

        return emailHTML;
    } catch (error) {
        console.error('Error rendering email template:', error);
        throw error;
    }
};

/**
 * Send order shipped email to customer
 * @param {Object} orderData - Order data object
 * @param {string} orderData.customerEmail - Customer's email address
 * @param {string} orderData.customerName - Customer's name
 * @param {string} orderData.orderNumber - Order number
 * @param {Date} orderData.orderDate - Order date
 * @param {Date} orderData.shippedDate - Shipped date
 * @param {Array} orderData.items - Array of order items
 * @param {Object} orderData.pricing - Pricing breakdown
 * @param {Object} orderData.shippingAddress - Shipping address
 * @param {string} orderData.trackingNumber - Tracking number (optional)
 * @param {string} orderData.shippingProvider - Shipping provider (optional)
 * @param {string} orderData.deliveryEstimate - Estimated delivery time
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendOrderShippedEmail = async (orderData) => {
    try {
        const {
            customerEmail,
            customerName,
            orderNumber,
            orderDate,
            shippedDate,
            items,
            pricing,
            shippingAddress,
            trackingNumber,
            shippingProvider,
            deliveryEstimate = '2-4 business days'
        } = orderData;

        // Format order date
        const formattedOrderDate = new Date(orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Format shipped date
        const formattedShippedDate = new Date(shippedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Generate order items HTML
        const orderItemsHTML = items.map(item => `
            <tr>
                <td class="product-name">${item.productName || item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
                <td style="text-align: right;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        // Format shipping address
        const formattedShippingAddress = `
            ${shippingAddress.fullName}<br>
            ${shippingAddress.addressLine1}<br>
            ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + '<br>' : ''}
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
            ${shippingAddress.country}<br>
            Phone: ${shippingAddress.phoneNumber}
        `;

        // Format tracking information
        let trackingInfo = '';
        if (trackingNumber) {
            trackingInfo = `
                <div style="margin-bottom: 10px;">
                    <strong>Tracking Number:</strong> <span class="tracking-number">${trackingNumber}</span>
                </div>
            `;
            if (shippingProvider) {
                trackingInfo += `
                    <div style="margin-bottom: 10px;">
                        <strong>Shipping Provider:</strong> ${shippingProvider}
                    </div>
                `;
            }
        } else {
            trackingInfo = `
                <div style="color: #ffffff; opacity: 0.8;">
                    Tracking number will be updated soon. You will receive another email with tracking details.
                </div>
            `;
        }

        // Replace template variables
        let emailHTML = ORDER_SHIPPED_TEMPLATE
            .replace(/__CUSTOMER_NAME__/g, customerName)
            .replace(/__ORDER_NUMBER__/g, orderNumber)
            .replace(/__ORDER_DATE__/g, formattedOrderDate)
            .replace(/__SHIPPED_DATE__/g, formattedShippedDate)
            .replace(/__DELIVERY_ESTIMATE__/g, deliveryEstimate)
            .replace(/__ORDER_ITEMS__/g, orderItemsHTML)
            .replace(/__SUBTOTAL__/g, parseFloat(pricing.subtotal).toFixed(2))
            .replace(/__SHIPPING__/g, parseFloat(pricing.shippingCost).toFixed(2))
            .replace(/__TAX__/g, parseFloat(pricing.taxAmount).toFixed(2))
            .replace(/__TOTAL__/g, parseFloat(pricing.totalPrice).toFixed(2))
            .replace(/__SHIPPING_ADDRESS__/g, formattedShippingAddress)
            .replace(/__TRACKING_INFO__/g, trackingInfo);

        // Handle discount if present
        if (pricing.discountAmount && pricing.discountAmount > 0) {
            emailHTML = emailHTML.replace(/__DISCOUNT_START__/g, '').replace(/__DISCOUNT_END__/g, '');
            emailHTML = emailHTML.replace(/__DISCOUNT__/g, parseFloat(pricing.discountAmount).toFixed(2));
        } else {
            // Remove discount section if no discount
            emailHTML = emailHTML.replace(/__DISCOUNT_START__[\s\S]*?__DISCOUNT_END__/g, '');
        }

        // Email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: customerEmail,
            subject: `Your Order Has Been Shipped! - ${orderNumber} | PulsePlus`,
            html: emailHTML
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('Order shipped email sent:', {
            orderNumber,
            customerEmail,
            messageId: info.messageId
        });

        return {
            success: true,
            messageId: info.messageId,
            message: 'Order shipped email sent successfully'
        };

    } catch (error) {
        console.error('Error sending order shipped email:', error);

        return {
            success: false,
            error: error.message,
            message: 'Failed to send order shipped email'
        };
    }
};

/**
 * Prepare order data for shipped email
 * @param {Object} order - Order object from database
 * @returns {Object} - Formatted order data for email
 */
export const prepareOrderDataForShippedEmail = (order) => {
    return {
        customerEmail: order.customerInfo.email,
        customerName: order.customerInfo.name,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        shippedDate: order.shipping.shippedAt || new Date(),
        items: order.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            name: item.productName // fallback
        })),
        pricing: {
            subtotal: order.pricing.subtotal,
            shippingCost: order.pricing.shippingCost,
            taxAmount: order.pricing.taxAmount,
            discountAmount: order.pricing.discountAmount,
            totalPrice: order.pricing.totalPrice
        },
        shippingAddress: order.shippingAddress,
        trackingNumber: order.shipping.trackingNumber,
        shippingProvider: order.shipping.provider,
        deliveryEstimate: '2-4 business days' // Default estimate
    };
};
