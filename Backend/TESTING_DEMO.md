# SkillSwap Backend Testing Demo Guide

## 🚀 Quick Start Testing

### 1. Setup Environment
```bash
# Navigate to backend directory
cd "c:\Users\ASUS Vivobook\Desktop\Odoo\SkillSwap\Backend"

# Install dependencies
npm install

# Create .env file with these variables:
```

### 2. Required .env Configuration
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@skillswap.com
BREVO_SENDER_NAME=SkillSwap Platform
NODE_ENV=development
```

### 3. Start the Server
```bash
npm run dev
```
**Expected Output:** `Server running on port 5000` and `MongoDB connected successfully`

---

## 📋 Complete API Testing Workflow

### Step 1: User Registration & Authentication

#### Register User 1 (Skill Provider)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "password123",
    "skills": ["JavaScript", "React", "Node.js"],
    "availability": {
      "monday": ["09:00", "17:00"],
      "wednesday": ["10:00", "16:00"],
      "friday": ["09:00", "15:00"]
    },
    "location": {
      "city": "New York",
      "country": "USA"
    }
  }'
```

#### Register User 2 (Skill Seeker)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com",
    "password": "password123",
    "skills": ["Python", "Django", "Machine Learning"],
    "availability": {
      "tuesday": ["09:00", "17:00"],
      "thursday": ["10:00", "16:00"],
      "saturday": ["09:00", "15:00"]
    },
    "location": {
      "city": "San Francisco",
      "country": "USA"
    }
  }'
```

#### Login User 2 (Bob)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "password123"
  }'
```
**Save the token from response for next steps!**

---

### Step 2: Skill Exchange Request

#### Create Swap Request (Bob requesting Alice's React skill)
```bash
curl -X POST http://localhost:5000/api/swaps/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_BOB_TOKEN_HERE" \
  -d '{
    "provider": "ALICE_USER_ID_FROM_REGISTRATION",
    "skillRequested": "React",
    "skillOffered": "Python",
    "message": "Hi Alice! I would love to learn React from you. In exchange, I can teach you Python and Machine Learning concepts.",
    "preferredTimeSlots": ["2025-07-15T10:00:00.000Z", "2025-07-16T14:00:00.000Z"]
  }'
```

#### Login as Alice to Accept Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

#### View Pending Requests (Alice)
```bash
curl -X GET http://localhost:5000/api/swaps/my-requests \
  -H "Authorization: Bearer YOUR_ALICE_TOKEN_HERE"
```

#### Accept Swap Request with Meeting Schedule (Alice)
```bash
curl -X PUT http://localhost:5000/api/swaps/SWAP_REQUEST_ID/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ALICE_TOKEN_HERE" \
  -d '{
    "scheduledDate": "2025-07-15T10:00:00.000Z",
    "duration": 90
  }'
```

---

### Step 3: Meeting Management

#### Get Upcoming Meetings (Both Users)
```bash
# For Alice
curl -X GET http://localhost:5000/api/swaps/meetings/upcoming \
  -H "Authorization: Bearer YOUR_ALICE_TOKEN_HERE"

# For Bob
curl -X GET http://localhost:5000/api/swaps/meetings/upcoming \
  -H "Authorization: Bearer YOUR_BOB_TOKEN_HERE"
```

#### Start Meeting (Update Status to In Progress)
```bash
curl -X PUT http://localhost:5000/api/swaps/meetings/MEETING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ALICE_TOKEN_HERE" \
  -d '{
    "status": "in_progress"
  }'
```

#### Complete Meeting
```bash
curl -X PUT http://localhost:5000/api/swaps/meetings/MEETING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ALICE_TOKEN_HERE" \
  -d '{
    "status": "completed"
  }'
```

---

### Step 4: Rating System

#### Rate the Exchange (Bob rating Alice)
```bash
curl -X POST http://localhost:5000/api/ratings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_BOB_TOKEN_HERE" \
  -d '{
    "ratedUser": "ALICE_USER_ID",
    "swapRequest": "SWAP_REQUEST_ID",
    "rating": 5,
    "review": "Alice is an excellent React teacher! Very patient and knowledgeable. Highly recommend!",
    "skillRated": "React"
  }'
```

#### Rate the Exchange (Alice rating Bob)
```bash
curl -X POST http://localhost:5000/api/ratings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ALICE_TOKEN_HERE" \
  -d '{
    "ratedUser": "BOB_USER_ID",
    "swapRequest": "SWAP_REQUEST_ID",
    "rating": 5,
    "review": "Bob taught me Python fundamentals really well. Great teaching style and very organized materials.",
    "skillRated": "Python"
  }'
```

---

### Step 5: Search & Discovery

#### Search for JavaScript Skills
```bash
curl -X GET "http://localhost:5000/api/users/search?skill=JavaScript&location=New York" \
  -H "Authorization: Bearer YOUR_BOB_TOKEN_HERE"
```

#### Get User Profile with Ratings
```bash
curl -X GET http://localhost:5000/api/users/ALICE_USER_ID \
  -H "Authorization: Bearer YOUR_BOB_TOKEN_HERE"
```

---

## 🧪 Testing Checklist

### ✅ Authentication Tests
- [ ] User registration works
- [ ] User login returns valid JWT token
- [ ] Protected routes require authentication
- [ ] Invalid tokens are rejected

### ✅ Skill Swap Tests
- [ ] Create swap request successfully
- [ ] View pending requests
- [ ] Accept request creates meeting
- [ ] Reject request works
- [ ] Only provider can accept/reject

### ✅ Meeting Tests
- [ ] Meeting created when swap accepted
- [ ] Meeting link generated
- [ ] Upcoming meetings endpoint works
- [ ] Meeting status updates work
- [ ] actualStartTime set on 'in_progress'
- [ ] actualEndTime set on 'completed'

### ✅ Rating Tests
- [ ] Both users can rate each other
- [ ] Ratings appear in user profiles
- [ ] Average rating calculated correctly

### ✅ Search Tests
- [ ] Skill-based search works
- [ ] Location-based filtering works
- [ ] Results exclude requesting user

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:** Make sure MongoDB is running locally or update MONGODB_URI in .env

### Issue: JWT Token Invalid
**Solution:** Copy the exact token from login response, ensure no extra spaces

### Issue: User ID Not Found
**Solution:** Use the `_id` field from user registration/login response

### Issue: Meeting Link Generation
**Solution:** The meeting service creates placeholder links. Integrate with actual video service (Zoom, Meet, etc.)

---

## 📱 Postman Collection Alternative

If you prefer using Postman, import this collection structure:

1. **Auth Folder:**
   - POST Register User 1
   - POST Register User 2
   - POST Login User 1
   - POST Login User 2

2. **Swaps Folder:**
   - POST Create Swap Request
   - GET My Requests
   - PUT Accept Request
   - PUT Reject Request

3. **Meetings Folder:**
   - GET Upcoming Meetings
   - GET Meeting Details
   - PUT Update Meeting Status

4. **Ratings Folder:**
   - POST Create Rating
   - GET User Ratings

5. **Search Folder:**
   - GET Search Users
   - GET User Profile

---

## 🎯 Expected Success Indicators

1. **Registration:** Returns user object with JWT token
2. **Swap Request:** Creates request with 'pending' status
3. **Accept Request:** Status changes to 'accepted', meeting created
4. **Meeting Generation:** Meeting object with valid link and IDs
5. **Status Updates:** Meeting times tracked correctly
6. **Ratings:** Both users can rate, profiles show ratings
7. **Search:** Returns relevant users excluding self

---

**Ready to test? Start with the Quick Start section and follow the workflow step by step!** 🚀
