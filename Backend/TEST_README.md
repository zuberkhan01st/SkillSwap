# 🧪 SkillSwap Backend Testing

## Quick Test Setup

### 1. Start Your Backend
```bash
cd "c:\Users\ASUS Vivobook\Desktop\Odoo\SkillSwap\Backend"
npm install
npm run dev
```

### 2. Run the Automated Test
```powershell
# Open PowerShell in the Backend directory
.\test-skillswap.ps1
```

## What the Test Does

The automated test script will:

1. ✅ **Check Server** - Verify your backend is running
2. ✅ **Register 2 Users** - Alice (React expert) & Bob (Python expert)  
3. ✅ **Create Swap Request** - Bob requests to learn React from Alice
4. ✅ **Accept Request** - Alice accepts and schedules a meeting
5. ✅ **Generate Meeting** - Automatic meeting link creation
6. ✅ **Check Meetings** - Verify upcoming meetings for both users
7. ✅ **Add Ratings** - Both users rate each other 5 stars
8. ✅ **Test Search** - Search for users by skills

## Expected Output

You'll see colorful output like this:
```
🚀 Starting SkillSwap Backend Testing...
=================================
🔍 Checking if server is running...
✅ Server is running!

📝 Step 1: Registering Users...
✅ Alice registered successfully! ID: 507f1f77bcf86cd799439011
✅ Bob registered successfully! ID: 507f1f77bcf86cd799439012

🔐 Step 2: Login Alice...
✅ Alice logged in successfully!

🔄 Step 3: Creating Swap Request...
✅ Swap request created! ID: 507f1f77bcf86cd799439013
   Bob requested: React
   Bob offered: Python

📋 Step 4: Alice checking her requests...
✅ Alice has 1 pending request(s)

✅ Step 5: Alice accepting swap request with meeting...
✅ Swap request accepted!
   Meeting scheduled for: July 15, 2025 at 10:00 AM
   Meeting ID: mtg_12345
   Duration: 90 minutes

📅 Step 6: Checking upcoming meetings...
✅ Bob has 1 upcoming meeting(s)
✅ Alice has 1 upcoming meeting(s)
   Meeting Link: https://skillswap-meeting.com/mtg_12345
   Skills: React ↔ Python

⭐ Step 7: Adding ratings...
✅ Bob rated Alice: 5 stars
✅ Alice rated Bob: 5 stars

🔍 Step 8: Testing search functionality...
✅ Search found 1 user(s) with JavaScript skills

🎉 TESTING COMPLETE!
=================================
✅ All Tests PASSED!
```

## Manual Testing Alternative

If you prefer manual testing, use the detailed guide in `TESTING_DEMO.md` with curl commands or Postman.

## Troubleshooting

- **Server not running**: Make sure MongoDB is running and `npm run dev` is active
- **PowerShell execution policy**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Port issues**: Make sure port 5000 is available

## Test Data

The script creates test users:
- **Alice**: alice@skillswap.com (React/JS expert)
- **Bob**: bob@skillswap.com (Python expert)

You can log in with password: `password123`

---

**Ready? Just run `.\test-skillswap.ps1` and watch your SkillSwap backend in action! 🚀**
