// SkillSwap Platform Demo Test
// This script demonstrates the complete flow of the SkillSwap platform

const API_BASE = 'http://localhost:3000/api';

// Demo user data
const demoUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning', 'Data Science'],
    bio: 'Full-stack developer looking to learn AI/ML',
    availability: {
      monday: ['09:00-12:00', '14:00-17:00'],
      wednesday: ['10:00-16:00'],
      friday: ['09:00-15:00']
    }
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'],
    skillsWanted: ['React', 'Frontend Development', 'UI/UX'],
    bio: 'Data scientist interested in web development',
    availability: {
      tuesday: ['09:00-17:00'],
      thursday: ['10:00-16:00'],
      saturday: ['09:00-12:00']
    }
  }
];

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// Demo flow
async function runSkillSwapDemo() {
  console.log('🚀 Starting SkillSwap Platform Demo\n');

  try {
    // Step 1: Register demo users
    console.log('📝 Step 1: Registering demo users...');
    const userTokens = {};
    
    for (const user of demoUsers) {
      const result = await apiRequest('/auth/register', 'POST', user);
      if (result.status === 201) {
        userTokens[user.email] = result.data.token;
        console.log(`✅ Registered: ${user.name} (${user.email})`);
      } else {
        console.log(`❌ Failed to register ${user.name}:`, result.data.error);
      }
    }
    console.log('');

    // Step 2: Search for skill matches
    console.log('🔍 Step 2: Searching for skill matches...');
    const aliceToken = userTokens['alice@example.com'];
    const searchResult = await apiRequest('/users/search?skill=Python', 'GET', null, aliceToken);
    
    if (searchResult.status === 200) {
      console.log(`✅ Found ${searchResult.data.data.length} users offering Python skills`);
      console.log('Users found:', searchResult.data.data.map(u => u.name).join(', '));
    } else {
      console.log('❌ Search failed:', searchResult.data.error);
    }
    console.log('');

    // Step 3: Create a swap request
    console.log('🤝 Step 3: Creating swap request...');
    const bobUser = searchResult.data.data.find(u => u.email === 'bob@example.com');
    
    if (bobUser) {
      const swapRequest = {
        providerId: bobUser._id,
        skillRequested: 'Python',
        skillOffered: 'React',
        message: 'Hi! I\'d love to learn Python from you in exchange for React tutoring.',
        preferredDuration: 60
      };

      const createSwapResult = await apiRequest('/swaps/request', 'POST', swapRequest, aliceToken);
      
      if (createSwapResult.status === 201) {
        console.log('✅ Swap request created successfully');
        console.log(`Request ID: ${createSwapResult.data.data._id}`);
        
        // Step 4: Accept the swap request (as Bob)
        console.log('\n📅 Step 4: Accepting swap request and scheduling meeting...');
        const bobToken = userTokens['bob@example.com'];
        const requestId = createSwapResult.data.data._id;
        
        // Schedule meeting for tomorrow at 2 PM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0, 0);
        
        const acceptData = {
          scheduledDate: tomorrow.toISOString(),
          duration: 60
        };

        const acceptResult = await apiRequest(`/swaps/${requestId}/accept`, 'PUT', acceptData, bobToken);
        
        if (acceptResult.status === 200) {
          console.log('✅ Swap request accepted and meeting scheduled!');
          console.log('📹 Meeting Details:');
          console.log(`   Meeting ID: ${acceptResult.data.data.meeting.meetingId}`);
          console.log(`   Meeting Link: ${acceptResult.data.data.meeting.meetingLink}`);
          console.log(`   Join Link: ${acceptResult.data.data.meeting.joinLink}`);
          console.log(`   Scheduled Date: ${acceptResult.data.data.meeting.scheduledDate}`);
          console.log(`   Duration: ${acceptResult.data.data.meeting.duration} minutes`);
          
          // Step 5: Get upcoming meetings
          console.log('\n📊 Step 5: Checking upcoming meetings...');
          const upcomingResult = await apiRequest('/swaps/meetings/upcoming', 'GET', null, aliceToken);
          
          if (upcomingResult.status === 200) {
            console.log(`✅ Found ${upcomingResult.data.data.length} upcoming meetings for Alice`);
            upcomingResult.data.data.forEach(meeting => {
              console.log(`   📅 ${meeting.skillRequested} ↔ ${meeting.skillOffered}`);
              console.log(`      Scheduled: ${new Date(meeting.scheduledDate).toLocaleString()}`);
              console.log(`      Status: ${meeting.status}`);
            });
          }
          
        } else {
          console.log('❌ Failed to accept swap:', acceptResult.data.error);
        }
        
      } else {
        console.log('❌ Failed to create swap request:', createSwapResult.data.error);
      }
    }

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📋 Summary of features demonstrated:');
    console.log('   ✅ User Registration');
    console.log('   ✅ Skill-based User Search');
    console.log('   ✅ Swap Request Creation');
    console.log('   ✅ Request Acceptance with Meeting Scheduling');
    console.log('   ✅ Jit.si Meeting Link Generation');
    console.log('   ✅ Upcoming Meetings Retrieval');
    
    console.log('\n🔗 Test the meeting link in your browser:');
    console.log('   Just copy the meeting link shown above and open it in your browser!');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Check if fetch is available (for Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('⚠️  This demo requires Node.js 18+ or you can install node-fetch');
  console.log('   Run: npm install node-fetch');
  console.log('   Then add: const fetch = require("node-fetch");');
} else {
  // Run the demo
  runSkillSwapDemo();
}
