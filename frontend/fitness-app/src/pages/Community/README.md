# Community Module

## Overview
The Community module implements social networking features including user posts, comments, likes, and friend/follower relationships.

## Components
- **index.jsx**: Main community page with post feed and navigation
- **components/Sidebar.jsx**: Navigation sidebar for community features
- **components/PostFeed.jsx**: Feed of user posts
- **components/Post.jsx**: Individual post component with likes and comments
- **components/FriendsSidebar.jsx**: Shows friends and connection suggestions
- **components/SearchPanel.jsx**: User search functionality
- **components/UserProfile.jsx**: User profile view
- **components/NotificationsPanel.jsx**: Social notifications
- **components/Profile.jsx**: Current user's profile
- **components/FriendsManagement.jsx**: Managing friend connections

## API Requirements

### 1. Posts

#### Get Feed Posts
**Endpoint**: `/api/v1/posts/feed`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Query Parameters**: 
- `page`: Page number for pagination
- `limit`: Number of posts per page
**Response**:
```json
{
  "posts": [
    {
      "_id": "post-id",
      "content": "Post text content",
      "images": [
        { "url": "image-url.jpg", "preview": "preview-url.jpg" }
      ],
      "likes": ["user-id-1", "user-id-2"],
      "commentCount": 5,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "user": {
        "_id": "user-id",
        "username": "username",
        "name": "User's Full Name",
        "profileImage": "profile-image-url.jpg"
      }
    }
  ],
  "totalPosts": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

#### Get All Posts
**Endpoint**: `/api/v1/posts/`
**Method**: GET
**Headers**: Authorization: Bearer {token}

#### Get Single Post
**Endpoint**: `/api/v1/posts/{postId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}

#### Create Post
**Endpoint**: `/api/v1/posts`
**Method**: POST
**Headers**: 
- Authorization: Bearer {token}
- Content-Type: multipart/form-data (for image uploads)
**Body**:
```
content: "Post text content"
images: [File1, File2, ...] (optional)
```

#### Update Post
**Endpoint**: `/api/v1/posts/{postId}`
**Method**: PUT
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "content": "Updated post content"
}
```

#### Delete Post
**Endpoint**: `/api/v1/posts/{postId}`
**Method**: DELETE
**Headers**: Authorization: Bearer {token}

#### Like/Unlike Post
**Endpoint**: `/api/v1/posts/{postId}/like`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "success": true,
  "liked": true, // or false if unliked
  "likesCount": 42
}
```

#### Get User Posts
**Endpoint**: `/api/v1/posts/user/{userId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}

### 2. Comments

#### Get Comments
**Endpoint**: `/api/v1/comments/{postId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "comments": [
    {
      "_id": "comment-id",
      "comment": "Comment text",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "userId": {
        "_id": "user-id",
        "username": "username",
        "fullName": "User's Full Name",
        "profileImageUrl": "profile-image-url.jpg"
      }
    }
  ]
}
```

#### Add Comment
**Endpoint**: `/api/v1/comments/{postId}`
**Method**: POST
**Headers**: Authorization: Bearer {token}
**Body**:
```json
{
  "comment": "Comment text"
}
```

#### Delete Comment
**Endpoint**: `/api/v1/comments/{postId}/{commentId}`
**Method**: DELETE
**Headers**: Authorization: Bearer {token}

### 3. Friends & Following

#### Unfollow User
**Endpoint**: `/api/v1/friends/unfollow/{followingId}`
**Method**: POST
**Headers**: Authorization: Bearer {token}

#### Get Followers
**Endpoint**: `/api/v1/friends/followers/{userId}`
**Method**: GET
**Headers**: Authorization: Bearer {token}

#### Search Followers
**Endpoint**: `/api/v1/friends/search/{username}`
**Method**: GET
**Headers**: Authorization: Bearer {token}

#### Send Follow Request
**Endpoint**: `/api/v1/friends/follow/{followingId}`
**Method**: POST
**Headers**: Authorization: Bearer {token}

#### Approve Follow Request
**Endpoint**: `/api/v1/friends/approve/{followId}`
**Method**: POST
**Headers**: Authorization: Bearer {token}

#### Reject Follow Request
**Endpoint**: `/api/v1/friends/reject/{followId}`
**Method**: POST
**Headers**: Authorization: Bearer {token}

#### Get Friends
**Endpoint**: `/api/v1/friends/`
**Method**: GET
**Headers**: Authorization: Bearer {token}

#### Get Following
**Endpoint**: `/api/v1/friends/following`
**Method**: GET
**Headers**: Authorization: Bearer {token}

#### Get My Followers
**Endpoint**: `/api/v1/friends/followers`
**Method**: GET
**Headers**: Authorization: Bearer {token}

#### Get Friend Suggestions
**Endpoint**: `/api/v1/friends/suggestions`
**Method**: GET
**Headers**: Authorization: Bearer {token}

### 4. Profile

#### Get Profile Info
**Endpoint**: `/api/v1/profile`
**Method**: GET
**Headers**: Authorization: Bearer {token}

### 5. Notifications

#### Get Notifications
**Endpoint**: `/api/v1/notifications`
**Method**: GET
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "notifications": [
    {
      "_id": "notification-id",
      "type": "like", // Possible values: like, comment, follow, mention
      "sender": {
        "_id": "user-id",
        "username": "username",
        "fullName": "User Name",
        "profileImage": "image-url.jpg"
      },
      "postId": "post-id", // Only for post-related notifications
      "read": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Mark Notification as Read
**Endpoint**: `/api/v1/notifications/{notificationId}/read`
**Method**: POST
**Headers**: Authorization: Bearer {token}

## Data Models

### Post Object
```json
{
  "_id": "post-id",
  "content": "Post text content",
  "images": [
    { "url": "image-url.jpg", "preview": "preview-url.jpg" }
  ],
  "user": {
    "_id": "user-id",
    "username": "username",
    "name": "User's Full Name",
    "profileImage": "profile-image-url.jpg"
  },
  "likes": ["user-id-1", "user-id-2"],
  "commentCount": 5,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Comment Object
```json
{
  "_id": "comment-id",
  "postId": "post-id",
  "userId": {
    "_id": "user-id",
    "username": "username",
    "fullName": "User's Full Name",
    "profileImageUrl": "profile-image-url.jpg"
  },
  "comment": "Comment text",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Friend/Follower Object
```json
{
  "_id": "follow-id",
  "follower": "user-id-who-follows",
  "following": "user-id-being-followed",
  "status": "pending", // or "approved"
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## State Management
The Community module maintains state using React Context for:
- Current user data
- Active section (Home, Search, Notifications, etc.)
- Post feed data
- Selected user profile

## Error Handling
The frontend expects standard HTTP error codes:
- 401: Unauthorized (redirect to login)
- 403: Forbidden
- 404: Resource not found
- 500: Server error

## WebSocket Integration
For real-time features like notifications and chat, the application uses WebSocket connections. The backend should implement Socket.io with the following events:

- `new-notification`: When a user receives a new notification
- `new-message`: When a user receives a new message
- `post-liked`: When a user's post is liked
- `new-comment`: When a user's post receives a new comment
