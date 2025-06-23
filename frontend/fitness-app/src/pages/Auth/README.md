# Authentication Module

## Overview
The Authentication module handles user registration, login, password recovery, and OAuth integration.

## Components
- **Login.jsx**: User login page with email/password and social login options
- **Signup.jsx**: New user registration
- **Logout.jsx**: Handles user logout and session termination
- **OAuthSuccess.jsx**: OAuth callback handling

## API Requirements

### 1. User Login
**Endpoint**: `/api/v1/auth/login`
**Method**: POST
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "username",
    "fullName": "Full Name",
    "email": "user@example.com",
    "profileImage": "image-url.jpg",
    "role": "user"
  }
}
```

### 2. User Registration
**Endpoint**: `/api/v1/auth/signup`
**Method**: POST
**Body**:
```json
{
  "username": "newuser",
  "fullName": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "username": "newuser",
    "fullName": "New User",
    "email": "newuser@example.com"
  }
}
```

### 3. Get User Info
**Endpoint**: `/api/v1/auth/getUserInfo`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "id": "user-id",
  "username": "username",
  "fullName": "Full Name",
  "email": "user@example.com",
  "profileImage": "image-url.jpg",
  "role": "user",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### 4. Google OAuth
**Endpoints**: 
- `/api/v1/auth/google` (Initiate)
- `/api/v1/auth/google/callback` (Callback)

### 5. OTP Verification
**Endpoints**:
- `/api/v1/auth/send-verify-otp` (Send OTP)
- `/api/v1/auth/verify-otp` (Verify OTP)

### 6. Password Reset
**Endpoints**:
- `/api/v1/auth/forgot-password` (Request reset)
- `/api/v1/auth/reset-password` (Confirm reset)

## Authentication Flow
1. User enters credentials
2. Frontend sends credentials to backend
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. Token is included in Authorization header for subsequent requests

## JWT Token Structure
The application expects JWT tokens with the following claims:
- `userId`: The unique identifier for the user
- `role`: User role (user, trainer, admin)
- `exp`: Expiration timestamp

## Error Handling
The authentication module expects the following error responses:
- 400: Bad Request (invalid credentials)
- 401: Unauthorized
- 404: User not found
- 409: User already exists (during signup)
- 500: Server error

## Security Considerations
- Passwords must be at least 8 characters
- Frontend performs basic validation before submission
- Backend should enforce password hashing and security best practices
- OAuth integration requires proper key configuration on the backend
