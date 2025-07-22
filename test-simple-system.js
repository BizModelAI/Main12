import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5073';

async function testSimpleSystem() {
  console.log('🔍 TESTING SIMPLE SYSTEM UPDATES\n');

  try {
    // Test 1: Create temporary user with email
    console.log('1️⃣ Testing Temporary User Creation...');
    const email = `temp-test-${Date.now()}@example.com`;
    
    const quizData = {
      questions: { test: 'simple quiz' },
      results: { score: 80 }
    };

    const saveResponse = await fetch(`${BASE_URL}/api/save-quiz-data`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `test-client-1-${Date.now()}`
      },
      body: JSON.stringify({ quizData, email }),
      // Explicitly not sending cookies
      credentials: 'omit'
    });

    const saveData = await saveResponse.json();
    console.log('Save response:', saveData);
    
    if (saveData.userType === 'email-provided') {
      console.log('✅ Temporary user created successfully');
    } else {
      console.log('❌ Expected temporary user, got:', saveData.userType);
    }

    // Test 2: Try to login as temporary user
    console.log('\n2️⃣ Testing Temporary User Login Restriction...');
    
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `test-client-2-${Date.now()}`
      },
      body: JSON.stringify({
        email: email,
        password: 'testpassword123'
      }),
      // Explicitly not sending cookies
      credentials: 'omit'
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginResponse.status === 403) {
      console.log('✅ Temporary user correctly blocked from login');
    } else {
      console.log('❌ Expected 403, got:', loginResponse.status);
    }

    // Test 3: Take another quiz with same email
    console.log('\n3️⃣ Testing Second Quiz with Same Email...');
    
    const quizData2 = {
      questions: { test: 'second quiz' },
      results: { score: 85 }
    };

    const saveResponse2 = await fetch(`${BASE_URL}/api/save-quiz-data`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `test-client-3-${Date.now()}`
      },
      body: JSON.stringify({ quizData: quizData2, email }),
      // Explicitly not sending cookies
      credentials: 'omit'
    });

    const saveData2 = await saveResponse2.json();
    console.log('Second save response:', saveData2);
    
    if (saveData2.userType === 'email-provided') {
      console.log('✅ Second quiz stored under same temporary user');
    } else {
      console.log('❌ Expected same user, got:', saveData2.userType);
    }

    // Test 4: Check if quiz attempts are different
    if (saveData.attemptId !== saveData2.attemptId) {
      console.log('✅ Different quiz attempt IDs (no reuse)');
    } else {
      console.log('❌ Same quiz attempt ID (reuse detected)');
    }

  } catch (error) {
    console.error('Test error:', error);
  }

  console.log('\n🎯 SIMPLE TEST COMPLETE');
}

testSimpleSystem().catch(console.error); 