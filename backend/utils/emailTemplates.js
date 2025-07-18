export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Email Verify</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Verify your email
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          You are just one step away to verify your account for this email: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use below OTP to verify your account.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          This OTP is valid for 24 hours.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`

export const PASSWORD_RESET_TEMPLATE = `

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Forgot your password?
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          We received a password reset request for your account: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the OTP below to reset the password.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          The password reset otp is only valid for the next 15 minutes.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const ORDER_CONFIRMATION_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Order Confirmed - PulsePlus</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #0A0A1F;
      color: #ffffff;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 650px;
      margin: 40px auto;
      background: linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .header {
      background: #f67a45;
      padding: 30px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }

    .header p {
      margin: 8px 0 0;
      color: #ffffff;
      font-size: 16px;
      opacity: 0.9;
    }

    .main-content {
      padding: 40px 30px;
      color: #ffffff;
    }

    .order-info {
      background: #121225;
      border: 1px solid #f67a45;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .order-info h2 {
      margin: 0 0 15px;
      color: #f67a45;
      font-size: 18px;
      font-weight: 600;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
    }

    .info-label {
      color: #ffffff;
      opacity: 0.8;
    }

    .info-value {
      color: #ffffff;
      font-weight: 600;
    }

    .items-table {
      width: 100%;
      background: #121225;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 30px;
    }

    .items-table th {
      background: #f67a45;
      color: #ffffff;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }

    .items-table td {
      padding: 15px 12px;
      border-bottom: 1px solid #2a2a3f;
      color: #ffffff;
    }

    .items-table tr:last-child td {
      border-bottom: none;
    }

    .product-name {
      font-weight: 600;
      color: #ffffff;
    }

    .total-section {
      background: #121225;
      border: 1px solid #f67a45;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 0;
    }

    .total-row.final {
      border-top: 2px solid #f67a45;
      margin-top: 15px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: 700;
      color: #f67a45;
    }

    .shipping-info {
      background: #121225;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .shipping-info h3 {
      margin: 0 0 15px;
      color: #f67a45;
      font-size: 16px;
      font-weight: 600;
    }

    .address {
      color: #ffffff;
      opacity: 0.9;
      line-height: 1.6;
    }

    .footer {
      background: #121225;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #2a2a3f;
    }

    .footer p {
      margin: 0 0 10px;
      color: #ffffff;
      opacity: 0.8;
    }

    .brand-name {
      color: #f5f2f0ff;
      font-weight: 700;
    }

    .status-badge {
      background: #22D172;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px 10px;
        max-width: none;
      }

      .main-content {
        padding: 30px 20px;
      }

      .header {
        padding: 25px 20px;
      }

      .header h1 {
        font-size: 24px;
      }

      .items-table th,
      .items-table td {
        padding: 12px 8px;
        font-size: 13px;
      }

      .info-row,
      .total-row {
        flex-direction: column;
        gap: 4px;
      }

      .total-row.final {
        flex-direction: row;
        justify-content: space-between;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#0A0A1F">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>Order Confirmed!</h1>
              <p>Thank you for your order with <span class="brand-name">PulsePlus</span></p>
            </div>

            <!-- Main Content -->
            <div class="main-content">
              <!-- Order Information -->
              <div class="order-info">
                <h2>Order Details</h2>
                <div class="info-row">
                  <span class="info-label">Order Number:</span>
                  <span class="info-value">__ORDER_NUMBER__</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Date:</span>
                  <span class="info-value">__ORDER_DATE__</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Customer:</span>
                  <span class="info-value">__CUSTOMER_NAME__</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="status-badge">Confirmed</span>
                </div>
              </div>

              <!-- Order Items -->
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  __ORDER_ITEMS__
                </tbody>
              </table>

              <!-- Order Total -->
              <div class="total-section">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>$__SUBTOTAL__</span>
                </div>
                <div class="total-row">
                  <span>Shipping:</span>
                  <span>$__SHIPPING__</span>
                </div>
                <div class="total-row">
                  <span>Tax:</span>
                  <span>$__TAX__</span>
                </div>
                __DISCOUNT_START__
                <div class="total-row">
                  <span>Discount:</span>
                  <span>-$__DISCOUNT__</span>
                </div>
                __DISCOUNT_END__
                <div class="total-row final">
                  <span>Total Amount:</span>
                  <span>$__TOTAL__</span>
                </div>
              </div>

              <!-- Shipping Information -->
              <div class="shipping-info">
                <h3>Shipping Address</h3>
                <div class="address">
                  __SHIPPING_ADDRESS__
                </div>
              </div>

              <!-- Payment Information -->
              <div class="shipping-info">
                <h3>Payment Method</h3>
                <div class="address">
                  __PAYMENT_METHOD__
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Your order is now being processed and will be shipped soon.</p>
              <p>You will receive another email with tracking information once your order ships.</p>
              <p>Thank you for choosing <span class="brand-name">PulsePlus</span>!</p>
              <p style="margin-top: 20px; font-size: 12px; opacity: 0.6;">
                If you have any questions about your order, please contact our support team.
              </p>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const ORDER_SHIPPED_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Order Shipped - PulsePlus</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #0A0A1F;
      color: #ffffff;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 650px;
      margin: 40px auto;
      background: linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .header {
      background: #8B5CF6;
      padding: 30px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }

    .header p {
      margin: 8px 0 0;
      color: #ffffff;
      font-size: 16px;
      opacity: 0.9;
    }

    .main-content {
      padding: 40px 30px;
      color: #ffffff;
    }

    .shipping-notification {
      background: #121225;
      border: 1px solid #8B5CF6;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 30px;
      text-align: center;
    }

    .shipping-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .shipping-title {
      color: #8B5CF6;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .shipping-message {
      color: #ffffff;
      opacity: 0.9;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .order-info {
      background: #121225;
      border: 1px solid #8B5CF6;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .order-info h2 {
      margin: 0 0 15px;
      color: #8B5CF6;
      font-size: 18px;
      font-weight: 600;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
    }

    .info-label {
      color: #ffffff;
      opacity: 0.8;
    }

    .info-value {
      color: #ffffff;
      font-weight: 600;
    }

    .tracking-section {
      background: #121225;
      border: 1px solid #8B5CF6;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .tracking-section h3 {
      margin: 0 0 15px;
      color: #8B5CF6;
      font-size: 16px;
      font-weight: 600;
    }

    .tracking-info {
      color: #ffffff;
      opacity: 0.9;
      line-height: 1.6;
    }

    .tracking-number {
      color: #8B5CF6;
      font-weight: 600;
      font-size: 16px;
    }

    .delivery-estimate {
      background: #1D4ED8;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
      text-align: center;
    }

    .delivery-estimate .estimate-label {
      color: #ffffff;
      opacity: 0.8;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .delivery-estimate .estimate-time {
      color: #ffffff;
      font-weight: 700;
      font-size: 18px;
    }

    .items-table {
      width: 100%;
      background: #121225;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 30px;
    }

    .items-table th {
      background: #8B5CF6;
      color: #ffffff;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }

    .items-table td {
      padding: 15px 12px;
      border-bottom: 1px solid #2a2a3f;
      color: #ffffff;
    }

    .items-table tr:last-child td {
      border-bottom: none;
    }

    .product-name {
      font-weight: 600;
      color: #ffffff;
    }

    .total-section {
      background: #121225;
      border: 1px solid #8B5CF6;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 0;
    }

    .total-row.final {
      border-top: 2px solid #8B5CF6;
      margin-top: 15px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: 700;
      color: #8B5CF6;
    }

    .shipping-info {
      background: #121225;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .shipping-info h3 {
      margin: 0 0 15px;
      color: #8B5CF6;
      font-size: 16px;
      font-weight: 600;
    }

    .address {
      color: #ffffff;
      opacity: 0.9;
      line-height: 1.6;
    }

    .footer {
      background: #121225;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #2a2a3f;
    }

    .footer p {
      margin: 0 0 10px;
      color: #ffffff;
      opacity: 0.8;
    }

    .brand-name {
      color: #8B5CF6;
      font-weight: 700;
    }

    .status-badge {
      background: #8B5CF6;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px 10px;
        max-width: none;
      }

      .main-content {
        padding: 30px 20px;
      }

      .header {
        padding: 25px 20px;
      }

      .header h1 {
        font-size: 24px;
      }

      .items-table th,
      .items-table td {
        padding: 12px 8px;
        font-size: 13px;
      }

      .info-row,
      .total-row {
        flex-direction: column;
        gap: 4px;
      }

      .total-row.final {
        flex-direction: row;
        justify-content: space-between;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#0A0A1F">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>🛍️ Order Shipped!</h1>
              <p>Your order is on its way from <span class="brand-name">PulsePlus</span></p>
            </div>

            <!-- Main Content -->
            <div class="main-content">
              <!-- Shipping Notification -->
              <div class="shipping-notification">
                <div class="shipping-icon">📦</div>
                <div class="shipping-title">Your Order Has Been Shipped Out for Delivery!</div>
                <div class="shipping-message">
                  Great news! Your order has been processed and shipped out from our warehouse. 
                  It's now on its way to your delivery address.
                </div>
                <div class="delivery-estimate">
                  <div class="estimate-label">Estimated Delivery Time</div>
                  <div class="estimate-time">__DELIVERY_ESTIMATE__</div>
                </div>
              </div>

              <!-- Order Information -->
              <div class="order-info">
                <h2>Order Details</h2>
                <div class="info-row">
                  <span class="info-label">Order Number:</span>
                  <span class="info-value">__ORDER_NUMBER__</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Date:</span>
                  <span class="info-value">__ORDER_DATE__</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Shipped Date:</span>
                  <span class="info-value">__SHIPPED_DATE__</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Customer:</span>
                  <span class="info-value">__CUSTOMER_NAME__</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="status-badge">Shipped</span>
                </div>
              </div>

              <!-- Tracking Information -->
              <div class="tracking-section">
                <h3>📍 Tracking Information</h3>
                <div class="tracking-info">
                  __TRACKING_INFO__
                </div>
              </div>

              <!-- Order Items -->
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  __ORDER_ITEMS__
                </tbody>
              </table>

              <!-- Order Total -->
              <div class="total-section">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>$__SUBTOTAL__</span>
                </div>
                <div class="total-row">
                  <span>Shipping:</span>
                  <span>$__SHIPPING__</span>
                </div>
                <div class="total-row">
                  <span>Tax:</span>
                  <span>$__TAX__</span>
                </div>
                __DISCOUNT_START__
                <div class="total-row">
                  <span>Discount:</span>
                  <span>-$__DISCOUNT__</span>
                </div>
                __DISCOUNT_END__
                <div class="total-row final">
                  <span>Total Amount:</span>
                  <span>$__TOTAL__</span>
                </div>
              </div>

              <!-- Shipping Address -->
              <div class="shipping-info">
                <h3>Delivery Address</h3>
                <div class="address">
                  __SHIPPING_ADDRESS__
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Your package is carefully packed and on its way to you!</p>
              <p>You can track your order using the tracking information provided above.</p>
              <p>Thank you for shopping with <span class="brand-name">PulsePlus</span>!</p>
              <p style="margin-top: 20px; font-size: 12px; opacity: 0.6;">
                If you have any questions about your shipment, please contact our support team.
              </p>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

