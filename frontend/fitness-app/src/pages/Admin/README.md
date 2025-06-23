# Admin Module

## Overview
The Admin module provides comprehensive management tools for administrators to oversee the entire platform, including user management, trainer approvals, content moderation, store operations, and analytics.

## Components
- **Dashboard.jsx**: Main dashboard with analytics and key metrics
- **Trainers.jsx**: Trainer management dashboard
- **Trainers/ApproveTrainers.jsx**: Approve new trainer applications
- **Trainers/EditTrainer.jsx**: Edit trainer profiles
- **Trainers/Payments.jsx**: Manage trainer payments
- **Trainers/Reports.jsx**: View trainer performance reports
- **Store.jsx**: Store management dashboard
- **Store/Products.jsx**: Product management
- **Store/AddProduct.jsx**: Add new products
- **Store/EditProduct.jsx**: Edit existing products
- **Store/ProductView.jsx**: View product details
- **Store/Orders.jsx**: Order management
- **Store/OrderDetails.jsx**: View order details
- **Store/Inventory.jsx**: Inventory management
- **Community.jsx**: Manage community content and moderation
- **Fitness.jsx**: Manage fitness content (exercises, meal plans)
- **Fitness/AddExercise.jsx**: Add new exercises
- **Fitness/EditExercise.jsx**: Edit existing exercises
- **Settings.jsx**: Admin settings and configuration

## API Requirements

### 1. Dashboard Analytics

#### Get Dashboard Statistics
**Endpoint**: `/api/v1/admin/dashboard/stats`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "users": {
    "total": 5000,
    "new": 120,
    "activeToday": 850
  },
  "trainers": {
    "total": 150,
    "pending": 12,
    "active": 138
  },
  "store": {
    "revenue": {
      "daily": 1250.50,
      "monthly": 38500.75,
      "yearly": 450000.00
    },
    "orders": {
      "total": 1200,
      "pending": 35,
      "completed": 1165
    },
    "products": {
      "total": 250,
      "outOfStock": 15
    }
  },
  "community": {
    "posts": {
      "total": 3500,
      "today": 120
    },
    "comments": {
      "total": 12500,
      "today": 350
    },
    "reports": {
      "total": 25,
      "pending": 8
    }
  }
}
```

#### Get User Registration Trends
**Endpoint**: `/api/v1/admin/dashboard/user-trends`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `period`: daily, weekly, monthly, yearly
- `start`: Start date (YYYY-MM-DD)
- `end`: End date (YYYY-MM-DD)
**Response**:
```json
{
  "labels": ["2023-01-01", "2023-01-02", "2023-01-03"],
  "data": {
    "registrations": [12, 15, 8],
    "activeUsers": [120, 135, 110]
  }
}
```

#### Get User Demographics
**Endpoint**: `/api/v1/admin/dashboard/demographics`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "gender": {
    "male": 2800,
    "female": 2100,
    "other": 100,
    "total": 5000
  },
  "age": {
    "under18": 500,
    "18to24": 1200,
    "25to34": 1800,
    "35to44": 800,
    "45plus": 700
  },
  "regions": [
    {"country": "United States", "users": 2000, "rate": "40%"},
    {"country": "India", "users": 800, "rate": "16%"},
    {"country": "UK", "users": 600, "rate": "12%"}
  ]
}
```

### 2. Trainer Management

#### Get All Trainers
**Endpoint**: `/api/v1/admin/trainers`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `status`: all, active, inactive, pending
- `search`: Search by name or email
- `page`: Page number
- `limit`: Items per page
**Response**:
```json
{
  "trainers": [
    {
      "id": "trainer-id",
      "name": "John Smith",
      "specialty": "Strength & Conditioning",
      "experience": "8 years",
      "clients": 24,
      "rating": 4.8,
      "status": "active", // active, inactive, pending
      "email": "john.smith@example.com",
      "phone": "+1 555-123-4567",
      "verified": true
    }
  ],
  "totalTrainers": 150,
  "currentPage": 1,
  "totalPages": 15
}
```

#### Get Pending Trainer Applications
**Endpoint**: `/api/v1/admin/trainers/pending`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "applications": [
    {
      "id": "application-id",
      "name": "Jane Doe",
      "specialty": "Yoga & Flexibility",
      "experience": "5 years",
      "email": "jane.doe@example.com",
      "phone": "+1 555-234-5678",
      "submittedDate": "2023-01-15",
      "verification": {
        "identity": true,
        "certification": true,
        "background": false,
        "insurance": false
      },
      "documents": [
        "ID_verification.pdf",
        "Certification.pdf"
      ]
    }
  ]
}
```

#### Approve Trainer Application
**Endpoint**: `/api/v1/admin/trainers/{trainerId}/approve`
**Method**: POST
**Headers**: Authorization: Bearer {token}

#### Reject Trainer Application
**Endpoint**: `/api/v1/admin/trainers/{trainerId}/reject`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "reason": "Missing required certifications"
}
```

#### Update Trainer Status
**Endpoint**: `/api/v1/admin/trainers/{trainerId}/status`
**Method**: PUT
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "status": "inactive",
  "reason": "Temporary suspension due to policy violation"
}
```

#### Get Trainer Details
**Endpoint**: `/api/v1/admin/trainers/{trainerId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**: Detailed trainer object with all information

#### Update Trainer Details
**Endpoint**: `/api/v1/admin/trainers/{trainerId}`
**Method**: PUT
**Headers**: Authorization: Bearer {token}
**Body**: Trainer data to update

### 3. Store Management

#### Get All Products (Admin)
**Endpoint**: `/api/v1/admin/store/products`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `category`: Filter by category
- `status`: all, inStock, outOfStock
- `search`: Search by name
- `page`: Page number
- `limit`: Items per page
**Response**:
```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Whey Protein",
      "price": 49.99,
      "discount": 10,
      "image": "product-image-url.jpg",
      "category": "Supplements",
      "status": "inStock",
      "stockQuantity": 25,
      "totalSold": 150
    }
  ],
  "totalProducts": 250,
  "currentPage": 1,
  "totalPages": 25
}
```

#### Add Product
**Endpoint**: `/api/v1/admin/store/products`
**Method**: POST
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: multipart/form-data
**Body**:
```
name: "Product Name"
description: "Product description"
price: 49.99
category: "category-id"
subcategory: "subcategory-id"
stockQuantity: 100
images: [File1, File2, ...]
specifications: JSON string of specifications array
```

#### Update Product
**Endpoint**: `/api/v1/admin/store/products/{productId}`
**Method**: PUT
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: multipart/form-data
**Body**: Same as Add Product

#### Delete Product
**Endpoint**: `/api/v1/admin/store/products/{productId}`
**Method**: DELETE
**Headers**: Authorization: Bearer {token}

#### Get All Orders (Admin)
**Endpoint**: `/api/v1/admin/store/orders`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `status`: all, new, processing, shipped, completed, cancelled
- `search`: Search by order ID or customer name
- `dateFrom`: Filter by date (YYYY-MM-DD)
- `dateTo`: Filter by date (YYYY-MM-DD)
- `page`: Page number
- `limit`: Items per page
**Response**:
```json
{
  "orders": [
    {
      "id": "order-id",
      "customerName": "John Doe",
      "email": "john@example.com",
      "date": "2023-01-15",
      "items": 3,
      "total": 149.97,
      "paymentStatus": "completed",
      "status": "processing"
    }
  ],
  "totalOrders": 1200,
  "currentPage": 1,
  "totalPages": 120
}
```

#### Get Order Details (Admin)
**Endpoint**: `/api/v1/admin/store/orders/{orderId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**: Detailed order object with all information

#### Update Order Status
**Endpoint**: `/api/v1/admin/store/orders/{orderId}/status`
**Method**: PUT
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456789"
}
```

#### Get Inventory Status
**Endpoint**: `/api/v1/admin/store/inventory`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `status`: all, inStock, lowStock, outOfStock
- `category`: Filter by category
- `search`: Search by product name
- `page`: Page number
- `limit`: Items per page
**Response**:
```json
{
  "inventory": [
    {
      "productId": "product-id",
      "name": "Whey Protein",
      "sku": "WP-123",
      "stockQuantity": 25,
      "lowStockThreshold": 10,
      "status": "inStock", // inStock, lowStock, outOfStock
      "lastRestocked": "2023-01-01T00:00:00.000Z"
    }
  ],
  "totalItems": 250,
  "currentPage": 1,
  "totalPages": 25
}
```

#### Update Inventory
**Endpoint**: `/api/v1/admin/store/inventory/{productId}`
**Method**: PUT
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "stockQuantity": 100,
  "lowStockThreshold": 20
}
```

### 4. Community Management

#### Get Reported Content
**Endpoint**: `/api/v1/admin/community/reports`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `type`: all, posts, comments, users
- `status`: pending, resolved
- `page`: Page number
- `limit`: Items per page
**Response**:
```json
{
  "reports": [
    {
      "id": "report-id",
      "type": "post", // post, comment, user
      "contentId": "content-id",
      "contentPreview": "Post or comment text preview...",
      "reporter": {
        "id": "user-id",
        "username": "reporter_username"
      },
      "reportedUser": {
        "id": "user-id",
        "username": "reported_username"
      },
      "reason": "inappropriate_content",
      "details": "This post contains offensive language",
      "status": "pending", // pending, resolved
      "createdAt": "2023-01-15T00:00:00.000Z"
    }
  ],
  "totalReports": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

#### Resolve Report
**Endpoint**: `/api/v1/admin/community/reports/{reportId}/resolve`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "action": "remove_content", // remove_content, warn_user, ban_user, no_action
  "note": "Content violated community guidelines"
}
```

#### Get Community Statistics
**Endpoint**: `/api/v1/admin/community/stats`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "posts": {
    "total": 3500,
    "today": 120,
    "thisWeek": 850,
    "thisMonth": 3200
  },
  "comments": {
    "total": 12500,
    "today": 350,
    "thisWeek": 2400,
    "thisMonth": 10500
  },
  "users": {
    "totalActive": 4200,
    "newToday": 45,
    "mostActive": [
      {"userId": "user-id", "username": "username", "activityCount": 120}
    ]
  },
  "reports": {
    "pending": 8,
    "resolved": 17,
    "thisWeek": 12
  }
}
```

### 5. Fitness Content Management

#### Get All Exercises
**Endpoint**: `/api/v1/admin/fitness/exercises`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `category`: Filter by category (arms, legs, chest, etc.)
- `difficulty`: Filter by difficulty (beginner, intermediate, advanced)
- `search`: Search by name
- `page`: Page number
- `limit`: Items per page
**Response**:
```json
{
  "exercises": [
    {
      "id": "exercise-id",
      "name": "Incline Barbell Press",
      "category": "chest",
      "equipment": "barbell",
      "difficulty": "Intermediate",
      "instructions": "Step-by-step instructions...",
      "muscles": ["chest", "triceps", "shoulders"],
      "image": "exercise-image-url.jpg"
    }
  ],
  "totalExercises": 300,
  "currentPage": 1,
  "totalPages": 30
}
```

#### Add Exercise
**Endpoint**: `/api/v1/admin/fitness/exercises`
**Method**: POST
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: multipart/form-data
**Body**:
```
name: "Exercise Name"
category: "chest"
equipment: "barbell"
difficulty: "Intermediate"
instructions: "Step-by-step instructions..."
muscles: ["chest", "triceps"]
image: File
```

#### Update Exercise
**Endpoint**: `/api/v1/admin/fitness/exercises/{exerciseId}`
**Method**: PUT
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: multipart/form-data
**Body**: Same as Add Exercise

#### Delete Exercise
**Endpoint**: `/api/v1/admin/fitness/exercises/{exerciseId}`
**Method**: DELETE
**Headers**: Authorization: Bearer {token}

#### Get All Workout Plans
**Endpoint**: `/api/v1/admin/fitness/workouts`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**: Similar to exercises
**Response**:
```json
{
  "workouts": [
    {
      "id": "workout-id",
      "name": "Beginner Upper Body",
      "category": "Upper Body",
      "level": "Beginner",
      "exercises": 8,
      "duration": "45 minutes",
      "description": "Workout description"
    }
  ],
  "totalWorkouts": 50,
  "currentPage": 1,
  "totalPages": 5
}
```

#### Get All Meal Plans
**Endpoint**: `/api/v1/admin/fitness/meal-plans`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**: Similar to exercises
**Response**:
```json
{
  "mealPlans": [
    {
      "id": "meal-plan-id",
      "name": "Weight Loss Meal Plan",
      "category": "Weight Loss",
      "duration": "7 days",
      "meals": 21,
      "calories": "1800 kcal/day",
      "description": "Meal plan description"
    }
  ],
  "totalMealPlans": 20,
  "currentPage": 1,
  "totalPages": 2
}
```

## Admin Dashboard Structure

The Admin dashboard is structured as follows:

1. **Main Dashboard**: Overview of key metrics and statistics
2. **Trainer Management**: 
   - View all trainers
   - Approve/reject trainer applications
   - Edit trainer profiles
   - Manage payments and reports
3. **Store Management**:
   - Product management
   - Order processing
   - Inventory management
4. **Community Management**:
   - Content moderation
   - User management
   - Reported content review
5. **Fitness Content Management**:
   - Exercise database maintenance
   - Workout plan creation/editing
   - Meal plan creation/editing
6. **Settings**:
   - System configuration
   - Administrator account management

## Access Control
The admin panel uses role-based access control with the following roles:
- **Superadmin**: Full access to all features
- **Admin**: Access to most features except system settings
- **Moderator**: Limited access to community moderation features

## Data Export
Several admin pages include functionality to export data as CSV or PDF. The backend should implement appropriate endpoints for this functionality.

## Authentication Requirements
All admin endpoints require JWT authentication with admin privileges. The backend should enforce strict permission checks and maintain audit logs of admin actions.
