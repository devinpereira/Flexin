# Trainers Module

## Overview
The Trainers module enables users to discover fitness trainers, view trainer profiles, subscribe to training packages, schedule sessions, follow meal plans, and communicate with trainers.

## Components
- **Trainers.jsx**: Lists user's current trainers
- **TrainerProfile.jsx**: Detailed trainer profile with services, certifications, and reviews
- **Chat.jsx**: Direct messaging with trainers
- **Schedule.jsx**: Workout schedule provided by trainer
- **MealPlan.jsx**: Nutrition plans provided by trainer
- **Subscription.jsx**: Subscription package selection and management
- **Explore.jsx**: Discover and search for new trainers

## API Requirements

### 1. Trainer Listings

#### Get My Trainers
**Endpoint**: `/api/v1/trainers/my-trainers`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "trainers": [
    {
      "id": "trainer-id",
      "name": "John Smith",
      "image": "trainer-image-url.jpg",
      "specialty": "Strength & Conditioning",
      "rating": 4.8,
      "reviewCount": 28,
      "subscription": {
        "level": "silver", // "silver", "gold", or "ultimate"
        "startDate": "2025-01-01T00:00:00.000Z",
        "endDate": "2025-02-01T00:00:00.000Z"
      }
    }
  ]
}
```

#### Explore Trainers
**Endpoint**: `/api/v1/trainers/explore`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `search`: Search term for trainer name or specialty
- `specialty`: Filter by specialty
- `page`: Page number
- `limit`: Results per page
**Response**: Same format as Get My Trainers, but includes all available trainers

#### Get Trainer Profile
**Endpoint**: `/api/v1/trainers/{trainerId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "id": "trainer-id",
  "name": "John Smith",
  "title": "Certified Personal Trainer",
  "image": "trainer-image-url.jpg",
  "specialty": "Strength & Conditioning",
  "description": "Detailed description of trainer's background and approach",
  "rating": 4.8,
  "reviewCount": 28,
  "price": "$50/session",
  "socialMedia": {
    "facebook": "https://facebook.com/trainer",
    "instagram": "https://instagram.com/trainer",
    "tiktok": "https://tiktok.com/trainer",
    "twitter": "https://twitter.com/trainer"
  },
  "certifications": [
    {
      "name": "NASM Certified Personal Trainer",
      "image": "certification-image-url.jpg"
    }
  ],
  "services": [
    {
      "title": "Personalized Training",
      "description": "Custom workout plans designed for your goals"
    }
  ],
  "packages": [
    {
      "id": "package-id",
      "name": "Silver Package",
      "price": "$49.99/month",
      "isPopular": false,
      "benefits": [
        "Weekly workout plan",
        "Basic nutrition advice",
        "Email support within 48 hours",
        "1 video consultation per month"
      ]
    }
  ],
  "reviews": [
    {
      "userId": "user-id",
      "userName": "Alex Johnson",
      "userImage": "user-image-url.jpg",
      "rating": 4.5,
      "text": "Great trainer! Very knowledgeable and motivating.",
      "date": "2023-01-01T00:00:00.000Z"
    }
  ],
  "gallery": [
    "image-url-1.jpg",
    "image-url-2.jpg"
  ]
}
```

### 2. Subscriptions

#### Get Subscription Details
**Endpoint**: `/api/v1/trainers/{trainerId}/subscription`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "currentSubscription": "silver", // null if no active subscription
  "packages": [
    {
      "name": "Silver Package",
      "price": "$49.99/month",
      "benefits": [
        "Weekly workout plan",
        "Basic nutrition advice",
        "Email support within 48 hours",
        "1 video consultation per month"
      ]
    },
    {
      "name": "Gold Package",
      "price": "$89.99/month",
      "benefits": [
        "Customized weekly workout plan",
        "Detailed nutrition plan",
        "Priority email support within 24 hours",
        "2 video consultations per month",
        "Real-time workout adjustments"
      ]
    },
    {
      "name": "Ultimate Package",
      "price": "$149.99/month",
      "benefits": [
        "Fully personalized workout program",
        "Customized meal plans with recipes",
        "24/7 chat support",
        "Weekly video consultations",
        "Progress tracking and analysis",
        "Access to exclusive workshops",
        "Workout videos library"
      ]
    }
  ]
}
```

#### Subscribe to Package
**Endpoint**: `/api/v1/trainers/{trainerId}/subscribe`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "package": "silver" // "silver", "gold", or "ultimate"
}
```

#### Cancel Subscription
**Endpoint**: `/api/v1/trainers/{trainerId}/unsubscribe`
**Method**: POST
**Headers**: Authorization: Bearer {token}

#### Add Trainer Review
**Endpoint**: `/api/v1/trainers/{trainerId}/review`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "rating": 4.5,
  "text": "Review text here"
}
```

### 3. Schedule

#### Get Workout Schedule
**Endpoint**: `/api/v1/trainers/{trainerId}/schedule`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "schedule": {
    "Day 1": [
      {
        "id": 1,
        "name": "Incline Barbell Press",
        "sets": 4,
        "reps": 8,
        "image": "exercise-image.png"
      }
    ],
    "Day 2": [
      {
        "id": 4,
        "name": "Barbell Squat",
        "sets": 5,
        "reps": 5,
        "image": "exercise-image.png"
      }
    ]
  }
}
```

### 4. Meal Plan

#### Get Meal Plan
**Endpoint**: `/api/v1/trainers/{trainerId}/meal-plan`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "mealPlan": {
    "Monday": [
      {
        "id": 1,
        "type": "Breakfast",
        "time": "7:00 AM",
        "meal": "Oatmeal with Berries and Protein Shake",
        "calories": 450,
        "protein": "30g",
        "carbs": "45g",
        "fats": "12g",
        "recipe": "Step-by-step recipe instructions"
      }
    ],
    "Tuesday": [
      {
        "id": 5,
        "type": "Breakfast",
        "time": "7:00 AM",
        "meal": "Scrambled Eggs with Avocado Toast",
        "calories": 520,
        "protein": "28g",
        "carbs": "35g",
        "fats": "25g",
        "recipe": "Step-by-step recipe instructions"
      }
    ]
  }
}
```

#### Update Meal
**Endpoint**: `/api/v1/trainers/{trainerId}/meal-plan/{mealId}`
**Method**: PUT
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "meal": "Updated meal name",
  "time": "8:00 AM",
  "calories": 500,
  "protein": "32g",
  "carbs": "40g",
  "fats": "15g",
  "recipe": "Updated recipe instructions"
}
```

### 5. Chat

#### Get Chat History
**Endpoint**: `/api/v1/trainers/{trainerId}/chat`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**:
- `limit`: Number of messages (default 50)
- `before`: Timestamp for pagination
**Response**:
```json
{
  "messages": [
    {
      "id": "message-id",
      "sender": "trainer", // or "user"
      "text": "Message text content",
      "image": "optional-image-url.jpg",
      "file": {
        "name": "document.pdf",
        "type": "application/pdf",
        "size": 1024000,
        "url": "file-url.pdf"
      },
      "voiceMessage": true, // optional
      "duration": 30, // for voice messages, in seconds
      "time": "2023-01-01T12:30:00.000Z",
      "isRead": true
    }
  ],
  "trainer": {
    "id": "trainer-id",
    "name": "John Smith",
    "image": "trainer-image-url.jpg",
    "status": "Online" // or "Offline"
  }
}
```

#### Send Message
**Endpoint**: `/api/v1/trainers/{trainerId}/chat`
**Method**: POST
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: multipart/form-data (for attachments)
**Body**:
```
text: "Message text" (optional if sending file)
file: File (optional)
```

#### Schedule Call
**Endpoint**: `/api/v1/trainers/{trainerId}/schedule-call`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "date": "2023-02-15",
  "time": "15:00"
}
```

## Real-time Features
The chat functionality uses WebSockets for real-time messaging. The backend should implement Socket.io with the following events:

- `join-chat`: When a user opens a chat with a trainer
- `send-message`: When a user sends a message
- `trainer-typing`: When a trainer is typing
- `message-read`: When messages are marked as read

## Data Models

### Trainer Object
```json
{
  "id": "trainer-id",
  "name": "John Smith",
  "title": "Certified Personal Trainer",
  "image": "trainer-image-url.jpg",
  "specialty": "Strength & Conditioning",
  "rating": 4.8,
  "reviewCount": 28,
  "price": "$50/session",
  "description": "Trainer bio",
  "certifications": [],
  "services": [],
  "socialMedia": {}
}
```

### Subscription Package Object
```json
{
  "name": "Silver Package",
  "price": "$49.99/month",
  "benefits": [
    "Weekly workout plan",
    "Basic nutrition advice",
    "Email support within 48 hours",
    "1 video consultation per month"
  ]
}
```

### Exercise Object
```json
{
  "id": 1,
  "name": "Incline Barbell Press",
  "sets": 4,
  "reps": 8,
  "image": "exercise-image.png"
}
```

### Meal Object
```json
{
  "id": 1,
  "type": "Breakfast",
  "time": "7:00 AM",
  "meal": "Oatmeal with Berries and Protein Shake",
  "calories": 450,
  "protein": "30g",
  "carbs": "45g",
  "fats": "12g",
  "recipe": "Step-by-step recipe instructions"
}
```

### Message Object
```json
{
  "id": "message-id",
  "sender": "trainer", // or "user"
  "text": "Message text content",
  "image": "optional-image-url.jpg",
  "file": {
    "name": "document.pdf",
    "type": "application/pdf",
    "size": 1024000,
    "url": "file-url.pdf"
  },
  "voiceMessage": true, // optional
  "duration": 30, // for voice messages, in seconds
  "time": "2023-01-01T12:30:00.000Z",
  "isRead": true
}
```

## Error Handling
The frontend expects standard HTTP error codes:
- 401: Unauthorized (redirect to login)
- 403: Forbidden (subscription required)
- 404: Trainer not found
- 500: Server error

The application handles these errors with appropriate user messages.

## Payment Integration
Subscription functionality requires payment processing integration. The frontend redirects to payment confirmation after subscription selection, expecting the backend to handle payment processing with a service like Stripe.
