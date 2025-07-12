# SkillSwap Platform Manual Testing Guide

## Prerequisites
1. Make sure your backend server is running: `npm run dev`
2. Server should be running on `http://localhost:3000`

## Test Flow

### 1. Register Two Users

**User 1 (Priya) - Frontend Developer from Bangalore:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Sharma",
    "email": "priya.sharma@gmail.com",
    "password": "password123",
    "skillsOffered": ["JavaScript", "React", "CSS", "HTML"],
    "skillsWanted": ["Python", "Machine Learning", "Data Science"],
    "bio": "Frontend developer from Bangalore, passionate about learning AI/ML technologies"
  }'
```

**User 2 (Ankit) - Data Scientist from Mumbai:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ankit Kumar",
    "email": "ankit.kumar@gmail.com",
    "password": "password123",
    "skillsOffered": ["Python", "Machine Learning", "Data Science", "Pandas"],
    "skillsWanted": ["React", "Frontend Development", "JavaScript"],
    "bio": "Data scientist from Mumbai, interested in learning modern web development"
  }'
```

Save the tokens from both responses!

### 2. Search for Users (as Priya)

```bash
curl -X GET "http://localhost:3000/api/users/search?skill=Python" \
  -H "Authorization: Bearer YOUR_PRIYA_TOKEN"
```

### 3. Create Swap Request (Priya wants to learn Python from Ankit)

```bash
curl -X POST http://localhost:3000/api/swaps/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIYA_TOKEN" \
  -d '{
    "providerId": "ANKIT_USER_ID_FROM_SEARCH",
    "skillRequested": "Python",
    "skillOffered": "React",
    "message": "Hi Ankit! I would love to learn Python and Data Science from you. I can teach you React and modern frontend development in return.",
    "preferredDuration": 60
  }'
```

### 4. Accept Swap Request and Schedule Meeting (as Ankit)

```bash
curl -X PUT http://localhost:3000/api/swaps/SWAP_REQUEST_ID/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANKIT_TOKEN" \
  -d '{
    "scheduledDate": "2025-07-13T19:00:00.000Z",
    "duration": 60
  }'
```

### 5. Check Upcoming Meetings (as Priya)

```bash
curl -X GET http://localhost:3000/api/swaps/meetings/upcoming \
  -H "Authorization: Bearer YOUR_PRIYA_TOKEN"
```

### 6. Test the Meeting Link

The response from step 4 will include a **Jit.si meeting link** like:
```
https://meet.jit.si/skillswap-1720800000000-abc123#config.roomPassword=&config.subject=Skill%20Swap%3A%20React%20%E2%86%94%20Python
```

**Copy this link and open it in your browser** - it will create a real video meeting room!

## Expected Results

✅ **Step 1:** Both Priya and Ankit registered successfully with tokens  
✅ **Step 2:** Search returns Ankit as a Python skill provider  
✅ **Step 3:** Swap request created successfully  
✅ **Step 4:** Meeting scheduled with real Jit.si link generated  
✅ **Step 5:** Upcoming meetings shows the scheduled session  
✅ **Step 6:** Meeting link opens functional video conference  

## Testing Features

- **User Registration & Authentication**
- **Skill-based Search**
- **Swap Request Lifecycle**
- **Real Meeting Generation with Jit.si**
- **Meeting Scheduling & Management**

## Additional API Endpoints to Test

```bash
# Get user profile
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get my swap requests
curl -X GET http://localhost:3000/api/swaps/my-requests \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update meeting status to "in_progress"
curl -X PUT http://localhost:3000/api/swaps/meetings/MEETING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "in_progress"}'

# Complete the meeting
curl -X PUT http://localhost:3000/api/swaps/meetings/MEETING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "completed"}'
```

## 🎯 Key Features Demonstrated

1. **Real Video Meetings**: Uses Jit.si for instant, no-signup video conferences
2. **Complete Skill Exchange Flow**: From discovery to scheduled meetings
3. **Authentication & Authorization**: JWT-based security
4. **Meeting Lifecycle Management**: Schedule → Join → Complete
5. **User Matching**: Skill-based search and discovery

**The meeting links generated are real and functional - you can actually use them for video calls!** 🎥
