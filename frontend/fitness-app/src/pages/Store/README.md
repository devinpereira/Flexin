# Store Module

## Overview
The Store module provides e-commerce functionality, allowing users to browse fitness products, add items to cart, and complete purchases.

## Components
- **index.jsx**: Main store page with product listings and category navigation
- **Checkout.jsx**: Checkout process for completing purchases
- **ProductView.jsx**: Detailed product view with specifications and related items

## API Requirements

### 1. Products

#### Get Product Categories
**Endpoint**: `/api/v1/store/categories`
**Method**: GET
**Response**:
```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "Supplements",
      "subcategories": [
        {"id": "subcategory-id", "name": "Protein"}
      ]
    },
    {
      "id": "category-id-2",
      "name": "Equipment",
      "subcategories": [
        {"id": "subcategory-id-2", "name": "Weights"}
      ]
    }
  ]
}
```

#### Get Products by Category
**Endpoint**: `/api/v1/store/products`
**Method**: GET
**Query Parameters**:
- `category`: Category ID (optional)
- `subcategory`: Subcategory ID (optional)
- `search`: Search term (optional)
- `sort`: Sort by (price_asc, price_desc, newest, rating)
- `page`: Page number
- `limit`: Products per page
**Response**:
```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Whey Protein",
      "price": 49.99,
      "discount": 10, // percentage discount (0 if no discount)
      "image": "product-image-url.jpg",
      "category": "Supplements",
      "subcategory": "Protein",
      "rating": 4.5,
      "reviewCount": 120,
      "inStock": true
    }
  ],
  "totalProducts": 50,
  "currentPage": 1,
  "totalPages": 5
}
```

#### Get Product Details
**Endpoint**: `/api/v1/store/products/{productId}`
**Method**: GET
**Response**:
```json
{
  "id": "product-id",
  "name": "Whey Protein",
  "description": "Detailed product description",
  "price": 49.99,
  "originalPrice": 59.99, // If discounted
  "discount": 10, // percentage
  "images": [
    "product-image-1.jpg",
    "product-image-2.jpg"
  ],
  "category": "Supplements",
  "subcategory": "Protein",
  "brand": "OptimumNutrition",
  "rating": 4.5,
  "reviewCount": 120,
  "inStock": true,
  "stockQuantity": 50,
  "specifications": [
    {"name": "Weight", "value": "2kg"},
    {"name": "Flavor", "value": "Chocolate"}
  ],
  "reviews": [
    {
      "userId": "user-id",
      "userName": "John D.",
      "rating": 5,
      "comment": "Great product, fast delivery",
      "date": "2023-01-15T00:00:00.000Z"
    }
  ],
  "relatedProducts": [
    {
      "id": "related-product-id",
      "name": "Creatine Monohydrate",
      "price": 29.99,
      "image": "related-product-image.jpg"
    }
  ]
}
```

#### Get Featured Products
**Endpoint**: `/api/v1/store/featured`
**Method**: GET
**Response**: Array of product objects (similar to Get Products response)

#### Get Deals and Offers
**Endpoint**: `/api/v1/store/deals`
**Method**: GET
**Response**: Array of product objects with active discounts

### 2. Shopping Cart

#### Get Cart Items
**Endpoint**: `/api/v1/store/cart`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "items": [
    {
      "id": "cart-item-id",
      "productId": "product-id",
      "name": "Whey Protein",
      "price": 49.99,
      "discount": 10,
      "finalPrice": 44.99,
      "quantity": 2,
      "image": "product-image-url.jpg"
    }
  ],
  "subtotal": 89.98,
  "shipping": 5.99,
  "tax": 9.60,
  "total": 105.57
}
```

#### Add to Cart
**Endpoint**: `/api/v1/store/cart`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "productId": "product-id",
  "quantity": 1
}
```

#### Update Cart Item
**Endpoint**: `/api/v1/store/cart/{cartItemId}`
**Method**: PUT
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "quantity": 2
}
```

#### Remove from Cart
**Endpoint**: `/api/v1/store/cart/{cartItemId}`
**Method**: DELETE
**Headers**: Authorization: Bearer {token}

### 3. Checkout

#### Get Saved Addresses
**Endpoint**: `/api/v1/users/addresses`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "addresses": [
    {
      "id": "address-id",
      "name": "Home",
      "address": "123 Main St, Colombo",
      "city": "Colombo",
      "postalCode": "10100",
      "isDefault": true
    }
  ]
}
```

#### Add Address
**Endpoint**: `/api/v1/users/addresses`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "name": "Work",
  "address": "456 Business Ave",
  "city": "Kandy",
  "postalCode": "20000",
  "isDefault": false
}
```

#### Get Saved Payment Methods
**Endpoint**: `/api/v1/users/payment-methods`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "paymentMethods": [
    {
      "id": "payment-method-id",
      "type": "Card",
      "lastFour": "1234",
      "expiryDate": "12/25",
      "isDefault": true
    }
  ]
}
```

#### Add Payment Method
**Endpoint**: `/api/v1/users/payment-methods`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**: 
```json
{
  "type": "Card",
  "cardNumber": "4242424242424242",
  "expiryDate": "12/25",
  "cvc": "123",
  "cardholderName": "John Doe",
  "isDefault": true
}
```

#### Create Order
**Endpoint**: `/api/v1/store/orders`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "items": [
    {"productId": "product-id", "quantity": 2}
  ],
  "addressId": "address-id",
  "paymentMethodId": "payment-method-id",
  "shippingMethod": "standard" // or "express"
}
```
**Response**:
```json
{
  "orderId": "order-id",
  "total": 105.57,
  "status": "processing",
  "estimatedDelivery": "2023-02-01T00:00:00.000Z"
}
```

#### Get Order Details
**Endpoint**: `/api/v1/store/orders/{orderId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "id": "order-id",
  "status": "processing", // processing, shipped, delivered, cancelled
  "items": [
    {
      "productId": "product-id",
      "name": "Whey Protein",
      "price": 49.99,
      "quantity": 2,
      "image": "product-image-url.jpg",
      "subtotal": 99.98
    }
  ],
  "shipping": {
    "address": {
      "name": "Home",
      "address": "123 Main St, Colombo",
      "city": "Colombo",
      "postalCode": "10100"
    },
    "method": "standard",
    "cost": 5.99,
    "estimatedDelivery": "2023-02-01T00:00:00.000Z",
    "trackingNumber": "TRACK123456789" // if available
  },
  "payment": {
    "method": "Card ending in 1234",
    "status": "completed",
    "total": 105.57,
    "subtotal": 89.98,
    "tax": 9.60,
    "shippingCost": 5.99
  },
  "dates": {
    "ordered": "2023-01-15T00:00:00.000Z",
    "processed": "2023-01-16T00:00:00.000Z",
    "shipped": null,
    "delivered": null
  }
}
```

#### Get Order History
**Endpoint**: `/api/v1/store/orders`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "orders": [
    {
      "id": "order-id",
      "date": "2023-01-15T00:00:00.000Z",
      "total": 105.57,
      "status": "processing",
      "items": 2 // number of items in order
    }
  ]
}
```

### 4. Product Reviews

#### Add Product Review
**Endpoint**: `/api/v1/store/products/{productId}/reviews`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "rating": 4,
  "comment": "Great product, would recommend"
}
```

## Data Models

### Product Object
```json
{
  "id": "product-id",
  "name": "Whey Protein",
  "description": "Detailed product description",
  "price": 49.99,
  "originalPrice": 59.99,
  "discount": 10,
  "images": ["image1.jpg", "image2.jpg"],
  "category": "Supplements",
  "subcategory": "Protein",
  "brand": "OptimumNutrition",
  "rating": 4.5,
  "reviewCount": 120,
  "inStock": true,
  "stockQuantity": 50,
  "specifications": []
}
```

### Cart Item Object
```json
{
  "id": "cart-item-id",
  "productId": "product-id",
  "name": "Whey Protein",
  "price": 49.99,
  "discount": 10,
  "finalPrice": 44.99,
  "quantity": 2,
  "image": "product-image-url.jpg"
}
```

### Order Object
```json
{
  "id": "order-id",
  "userId": "user-id",
  "items": [
    {
      "productId": "product-id",
      "name": "Product Name",
      "price": 49.99,
      "quantity": 2,
      "subtotal": 99.98
    }
  ],
  "subtotal": 99.98,
  "tax": 10.00,
  "shipping": 5.99,
  "total": 115.97,
  "status": "processing",
  "shippingAddress": {},
  "paymentMethod": {},
  "createdAt": "2023-01-15T00:00:00.000Z"
}
```

## Payment Processing
The checkout flow requires integration with a payment processor. The frontend UI is designed to work with:

1. Credit/debit card processing
2. Online payment methods (PayPal, Apple Pay)

The backend should implement the appropriate payment gateway integration and handle payment processing securely.

## Error Handling
The store module expects appropriate error responses for:
- Product not found (404)
- Out of stock (400)
- Payment failure (400)
- Invalid shipping address (400)
- Unauthorized access (401)

## State Management
The Store module maintains cart state using React Context and/or localStorage to persist cart items between sessions.
