import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testDebugUser() {
  console.log('🔍 DEBUGGING USER DATA\n');

  try {
    // Create a temporary user
    const email = `debug-test-${Date.now()}@example.com`;
    
    const quizData = {
      questions: { test: 'debug quiz' },
      results: { score: 80 }
    };

    console.log('1️⃣ Creating temporary user...');
    const saveResponse = await fetch(`${BASE_URL}/api/save-quiz-data`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `debug-client-${Date.now()}`
      },
      body: JSON.stringify({ quizData, email }),
      credentials: 'omit'
    });

    const saveData = await saveResponse.json();
    console.log('Save response:', saveData);

    // Now try to login and see what happens
    console.log('\n2️⃣ Attempting login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `debug-client-${Date.now()}`
      },
      body: JSON.stringify({
        email: email,
        password: 'testpassword123'
      }),
      credentials: 'omit'
    });

    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', loginData);

    // Check if we can get user info directly
    console.log('\n3️⃣ Checking user data in database...');
    
    // Try to get user by email using a direct database query
    const userCheckResponse = await fetch(`${BASE_URL}/api/test-db-state?email=${email}`);
    if (userCheckResponse.ok) {
      const userData = await userCheckResponse.json();
      console.log('User data from database:', userData);
    } else {
      console.log('Could not get user data from database');
    }

  } catch (error) {
    console.error('Test error:', error);
  }

  console.log('\n🎯 DEBUG TEST COMPLETE');
}

testDebugUser().catch(console.error); 