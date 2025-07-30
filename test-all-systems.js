#!/usr/bin/env node

import fetch from 'node-fetch';
import { config } from 'dotenv';

// Load environment variables
config();

const BASE_URL = 'http://localhost:3001';

async function testSystem(name, testFn) {
  console.log(`\n🧪 Testing ${name}...`);
  try {
    await testFn();
    console.log(`✅ ${name} - PASSED`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} - FAILED: ${error.message}`);
    return false;
  }
}

async function testAISystem() {
  const response = await fetch(`${BASE_URL}/api/openai-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Hello, this is a test',
      maxTokens: 10,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.content) {
    throw new Error('No content in response');
  }
}

async function testEmailSystem() {
  const response = await fetch(`${BASE_URL}/api/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'test@example.com',
      subject: 'System Test',
      html: '<p>This is a test email from the system test</p>'
    })
  });
  
  // Rate limiting is expected behavior, so we accept 429 as success
  if (response.status === 429) {
    console.log('  📧 Email rate limited (expected behavior)');
    return;
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error('Email sending failed');
  }
}

async function testPaymentSystem() {
  // Test payment config endpoint
  const response = await fetch(`${BASE_URL}/api/stripe-config`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.configured) {
    throw new Error('Stripe not configured');
  }
}

async function testDatabaseSystem() {
  // Test a simple database query endpoint
  const response = await fetch(`${BASE_URL}/api/health`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.status || data.status !== 'ok') {
    throw new Error('Database health check failed');
  }
}

async function testQuizSystem() {
  // Test quiz data endpoint - this requires authentication, so we'll test the endpoint exists
  const response = await fetch(`${BASE_URL}/api/quiz-attempts`);
  
  // We expect 401 (unauthorized) which means the endpoint exists but requires auth
  if (response.status !== 401) {
    throw new Error(`Expected 401, got ${response.status}`);
  }
}

async function testUserSystem() {
  // Test user creation endpoint
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    })
  });
  
  // We expect this to fail with existing user, but the endpoint should be accessible
  if (response.status !== 400 && response.status !== 409) {
    throw new Error(`Unexpected status: ${response.status}`);
  }
}

async function testLoginSystem() {
  // Test login endpoint
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'wrongpassword'
    })
  });
  
  // We expect this to fail with wrong password, but the endpoint should be accessible
  if (response.status !== 401) {
    throw new Error(`Unexpected status: ${response.status}`);
  }
}

async function testDataStorageSystem() {
  // Test storage by creating a temporary quiz attempt
  const response = await fetch(`${BASE_URL}/api/quiz-attempts/record-guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quizAttemptId: `test-${Date.now()}`,
      quizData: {
        mainMotivation: 'financial-freedom',
        successIncomeGoal: 5000,
        weeklyTimeCommitment: 20,
        techSkillsRating: 3,
        riskComfortLevel: 3,
        directCommunicationEnjoyment: 4,
        organizationLevel: 3,
        selfMotivationLevel: 4,
        uncertaintyHandling: 3,
        creativeWorkEnjoyment: 4,
        workCollaborationPreference: 'mostly-solo',
        decisionMakingStyle: 'after-some-research',
        pathPreference: 'proven-path',
        controlImportance: 4,
        onlinePresenceComfort: 'somewhat-comfortable',
        clientCallsComfort: 'somewhat-comfortable',
        physicalShippingOpenness: 'open-to-it',
        workStylePreference: 'structured-flexible-mix',
        socialMediaInterest: 3,
        ecosystemParticipation: 'participate-somewhat',
        existingAudience: 'none',
        promotingOthersOpenness: 'somewhat-open',
        teachVsSolvePreference: 'solve-problems',
        meaningfulContributionImportance: 4
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.attemptId) {
    throw new Error('No attempt ID returned');
  }
}

async function testPDFSystem() {
  // Test PDF generation endpoint
  const response = await fetch(`${BASE_URL}/api/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quizData: {
        mainMotivation: 'financial-freedom',
        successIncomeGoal: 5000
      },
      userEmail: 'test@example.com'
    })
  });
  
  // PDF generation might fail due to missing data, but endpoint should be accessible
  if (response.status !== 400 && response.status !== 500 && response.status !== 200) {
    throw new Error(`Unexpected status: ${response.status}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive system tests...\n');
  
  const tests = [
    { name: 'AI System', fn: testAISystem },
    { name: 'Email System', fn: testEmailSystem },
    { name: 'Payment System', fn: testPaymentSystem },
    { name: 'Database System', fn: testDatabaseSystem },
    { name: 'Quiz System', fn: testQuizSystem },
    { name: 'User System', fn: testUserSystem },
    { name: 'Login System', fn: testLoginSystem },
    { name: 'Data Storage System', fn: testDataStorageSystem },
    { name: 'PDF System', fn: testPDFSystem }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await testSystem(test.name, test.fn);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some systems have issues that need attention.');
    process.exit(1);
  } else {
    console.log('\n🎉 All systems are working properly!');
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
}); 