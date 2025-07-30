import fetch from 'node-fetch';

// Test configuration
const BASE_URL = 'http://localhost:3001';
const TEST_EMAIL = 'caseyedunham@gmail.com';
const TEST_PASSWORD = 'testpassword123';
const TEST_FIRST_NAME = 'Casey';
const TEST_LAST_NAME = 'Dunham';

// Global state for test
let testUserId = null;
let authToken = null;
let testQuizAttemptId = null;

// Utility functions
function log(message, data = null) {
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

function extractCookie(response) {
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    const match = setCookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
  }
  return null;
}

// Test functions
async function testUserSetup() {
  log('🧪 Setting up test user...');
  
  try {
    // Try to create user first
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        firstName: TEST_FIRST_NAME,
        lastName: TEST_LAST_NAME
      })
    });

    const signupData = await signupResponse.json();
    
    if (signupResponse.ok) {
      testUserId = signupData.user.id;
      log('✅ New user created', { userId: testUserId });
    } else if (signupData.error === 'User already exists') {
      log('ℹ️ User already exists, proceeding with login');
    } else {
      throw new Error(`User creation failed: ${signupData.error || signupResponse.statusText}`);
    }

    // Login user
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.error || loginResponse.statusText}`);
    }

    // If we didn't get userId from signup, get it from login
    if (!testUserId) {
      testUserId = loginData.user.id;
    }

    const sessionCookie = extractCookie(loginResponse);
    if (sessionCookie) {
      authToken = sessionCookie;
      log('✅ User setup successful', { userId: testUserId, hasToken: !!authToken });
      return true;
    } else {
      throw new Error('No auth token received');
    }
  } catch (error) {
    log('❌ User setup failed', { error: error.message });
    return false;
  }
}

async function testCreateQuizData() {
  log('🧪 Creating quiz data for testing...');
  
  try {
    const mockQuizData = {
      mainMotivation: 'financial_freedom',
      weeklyTimeCommitment: '10_20_hours',
      learningPreference: 'hands_on',
      techSkillsRating: 4,
      directCommunicationEnjoyment: 3,
      selfMotivationLevel: 4,
      creativeWorkEnjoyment: 3,
      organizationLevel: 4,
      discouragementResilience: 3,
      riskComfortLevel: 3,
      workCollaborationPreference: 'prefer_solo',
      decisionMakingStyle: 'data_driven',
      longTermConsistency: 4,
      familiarTools: ['social_media', 'email', 'spreadsheets']
    };

    const quizAttemptId = `test-email-actual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Cookie'] = `auth_token=${authToken}`;
    }

    // Create quiz attempt
    const createResponse = await fetch(`${BASE_URL}/api/quiz-attempts/record`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quizData: mockQuizData, quizAttemptId })
    });

    const createData = await createResponse.json();
    
    if (!createResponse.ok) {
      throw new Error(`Quiz creation failed: ${createData.error || createResponse.statusText}`);
    }

    testQuizAttemptId = quizAttemptId; // Use the string UUID, not the numeric ID

    log('✅ Quiz data created successfully', { 
      attemptId: createData.attemptId, 
      quizAttemptId: testQuizAttemptId
    });
    return true;
  } catch (error) {
    log('❌ Quiz data creation failed', { error: error.message });
    return false;
  }
}

async function testSendEmail() {
  log('🧪 Sending test email...');
  
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Cookie'] = `auth_token=${authToken}`;
    }

    // Send email with quiz results
    const response = await fetch(`${BASE_URL}/api/quiz-attempts/attempt/${testQuizAttemptId}/email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: TEST_EMAIL,
        firstName: TEST_FIRST_NAME,
        lastName: TEST_LAST_NAME
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Email sending failed: ${data.error || response.statusText}`);
    }

    log('✅ Test email sent successfully', { 
      email: TEST_EMAIL,
      attemptId: testQuizAttemptId,
      response: data
    });
    return true;
  } catch (error) {
    log('❌ Email sending failed', { error: error.message });
    return false;
  }
}

// Main test runner
async function runEmailTest() {
  log('🚀 Starting Actual Email Send Test');
  log('==================================');
  
  const results = {
    userSetup: false,
    quizData: false,
    emailSend: false
  };

  try {
    // Test 1: User Setup
    results.userSetup = await testUserSetup();
    if (!results.userSetup) {
      log('❌ Stopping tests due to user setup failure');
      return results;
    }

    // Test 2: Create Quiz Data
    results.quizData = await testCreateQuizData();
    if (!results.quizData) {
      log('❌ Stopping tests due to quiz data failure');
      return results;
    }

    // Test 3: Send Email
    results.emailSend = await testSendEmail();

  } catch (error) {
    log('❌ Test suite failed with unexpected error', { error: error.message });
  }

  // Summary
  log('📊 Test Results Summary');
  log('======================');
  Object.entries(results).forEach(([test, passed]) => {
    log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Test email has been sent to caseyedunham@gmail.com');
    log('📧 Check your email inbox for the quiz results email');
  } else {
    log('⚠️ Some tests failed. Email system needs attention.');
  }

  return results;
}

// Run the tests
runEmailTest()
  .then(() => {
    console.log('\n🏁 Email test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Email test crashed:', error);
    process.exit(1);
  });

export { runEmailTest }; 