# SkillSwap Platform API Documentation

## Overview
A comprehensive skill exchange platform backend with user management, swap requests, ratings, and admin features.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 🔐 Authentication Routes (`/auth`)

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 👤 User Routes (`/user`)

#### Get My Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "location": "New York",
  "bio": "Software developer passionate about learning",
  "skillsOffered": ["javascript", "react", "node.js"],
  "skillsWanted": ["python", "machine learning"],
  "availability": {
    "weekdays": true,
    "weekends": true,
    "evenings": true,
    "mornings": false,
    "afternoons": true
  }
}
```

#### Toggle Profile Visibility
```http
PUT /user/profile/visibility
Authorization: Bearer <token>
Content-Type: application/json

{
  "isPublic": true
}
```

#### Upload Profile Photo
```http
POST /user/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

profilePhoto: <file>
```

#### Search Users
```http
GET /user/search?skill=javascript&location=New York&page=1&limit=10
```

#### Get Users by Skill
```http
GET /user/skill/javascript?page=1&limit=10
```

#### Get User Profile by ID
```http
GET /user/{userId}
```

### 🔄 Swap Routes (`/swap`)

#### Create Swap Request
```http
POST /swap/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "providerId": "60d0fe4f5311236168a109ca",
  "skillRequested": "javascript",
  "skillOffered": "python",
  "message": "I'd love to learn JavaScript from you!",
  "scheduledDate": "2025-08-15T10:00:00.000Z"
}
```

#### Get My Swap Requests
```http
GET /swap/my-requests?type=all&status=pending&page=1&limit=10
Authorization: Bearer <token>

# type: all, sent, received
# status: pending, accepted, rejected, completed, cancelled
```

#### Get Swap Request Details
```http
GET /swap/{requestId}
Authorization: Bearer <token>
```

#### Accept Swap Request
```http
PUT /swap/{requestId}/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "scheduledDate": "2025-08-20T14:00:00.000Z"
}
```

#### Reject Swap Request
```http
PUT /swap/{requestId}/reject
Authorization: Bearer <token>
```

#### Cancel Swap Request
```http
DELETE /swap/{requestId}
Authorization: Bearer <token>
```

#### Complete Swap
```http
PUT /swap/{requestId}/complete
Authorization: Bearer <token>
```

### ⭐ Rating Routes (`/rating`)

#### Rate User
```http
POST /rating/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "swapRequestId": "60d0fe4f5311236168a109cb",
  "rating": 5,
  "feedback": "Great teacher! Very patient and knowledgeable."
}
```

#### Get User Ratings
```http
GET /rating/user/{userId}?page=1&limit=10
```

#### Get My Given Ratings
```http
GET /rating/my-given?page=1&limit=10
Authorization: Bearer <token>
```

#### Get My Received Ratings
```http
GET /rating/my-received?page=1&limit=10
Authorization: Bearer <token>
```

#### Update Rating
```http
PUT /rating/{ratingId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "feedback": "Updated feedback"
}
```

### 🛡️ Admin Routes (`/admin`)

#### Get All Users
```http
GET /admin/users?page=1&limit=10&status=all&role=all&search=john
Authorization: Bearer <admin-token>

# status: all, active, inactive, banned, unbanned
# role: all, user, admin
```

#### Ban/Unban User
```http
PUT /admin/users/{userId}/ban
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reason": "Inappropriate content"
}
```

#### Send Platform Message
```http
POST /admin/messages
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Platform Update",
  "content": "We've added new features to improve your experience!",
  "type": "announcement"
}
```

#### Get Platform Messages
```http
GET /admin/messages?page=1&limit=10&type=announcement&isActive=true
Authorization: Bearer <admin-token>
```

#### Get Swap Statistics
```http
GET /admin/statistics
Authorization: Bearer <admin-token>
```

#### Get All Swap Requests
```http
GET /admin/swaps?page=1&limit=10&status=all&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <admin-token>
```

#### Delete Swap Request
```http
DELETE /admin/swaps/{requestId}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reason": "Inappropriate content"
}
```

#### Generate Reports
```http
GET /admin/reports?type=users&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer <admin-token>

# type: users, swaps, ratings
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Environment Variables

Create a `.env` file with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BREVO_API_KEY=your-brevo-api-key
BREVO_EMAIL_USER=your-verified-sender@domain.com
```

## Installation and Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Features Implemented

✅ **User Management**
- User registration and authentication
- Profile management with skills and availability
- Profile photo upload
- Public/private profile settings

✅ **Skill Exchange**
- Create swap requests
- Accept/reject swap offers
- Track swap status
- Complete swaps

✅ **Rating System**
- Rate users after completed swaps
- View ratings and feedback
- Update ratings

✅ **Search & Discovery**
- Search users by skills and location
- Browse users offering specific skills
- Filter and sort results

✅ **Admin Features**
- User management and banning
- Platform messaging
- Swap monitoring
- Statistics and reports

## Database Models

### User Model
- Basic info (name, email, location, bio)
- Skills offered and wanted
- Availability schedule
- Privacy settings
- Rating statistics
- Admin controls

### SwapRequest Model
- Requester and provider references
- Skills being exchanged
- Status tracking
- Scheduling information

### Rating Model
- Swap reference
- Rating score (1-5)
- Feedback text
- User references

### AdminMessage Model
- Platform-wide messages
- Message types and status
- Admin controls

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Admin role-based access control

## Error Handling

The API includes comprehensive error handling with:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- File upload errors
- Custom error messages
