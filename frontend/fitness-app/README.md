# PulsePlus Frontend Application

## Overview
PulsePlus is a comprehensive fitness platform that connects users with trainers, provides workout tracking, community features, and an e-commerce store for fitness products.

## Architecture
- Built with React + Vite
- Uses React Router for navigation
- Context API for state management
- Tailwind CSS for styling

## Key Features
- User authentication (login/signup/OAuth)
- Trainer profiles and subscriptions
- Workout and meal planning
- Community posts and social features
- E-commerce store for fitness products
- Admin dashboard

## Backend Integration Points
This frontend application requires a RESTful API backend. The main integration points are:

1. **Authentication API**: User login, registration, profile management
2. **Trainers API**: Trainer profiles, schedules, and subscription management
3. **Community API**: Social posts, comments, likes, and follows
4. **Store API**: Products, orders, and checkout
5. **Admin API**: Dashboard metrics, user management, and content moderation

## Directory Structure
```
/src
  /components - Reusable UI components
  /context - React Context providers
  /guards - Route protection components
  /hooks - Custom React hooks
  /pages - Main application pages
    /Admin - Admin dashboard pages
    /Auth - Authentication related pages
    /Community - Social features
    /Store - E-commerce functionality
    /Trainers - Trainer profiles and management
  /utils - Utility functions
```

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## API Configuration
The application expects a backend server running at the URL specified in environment variables. API paths are defined in `/src/utils/apiPaths.js`.

## Environment Variables
Create a `.env` file with the following variables:
```
VITE_API_BASE_URL=http://localhost:8000
```

## Backend Requirements
See individual README files in each feature directory for detailed API requirements.
