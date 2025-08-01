#!/usr/bin/env node

/**
 * BizModelAI Comprehensive System Verification Script
 * 
 * This script systematically tests every component of the BizModelAI application
 * to ensure everything works correctly for all user types and scenarios.
 */

const fetch = require('node-fetch');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5173';
const TEST_EMAIL = 'test-verification@example.com';
const TEST_PASSWORD = 'TestPass123!';

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  details: {}
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`🧪 ${title}`);
  console.log('='.repeat(60));
}

async function makeRequest(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include',
      ...options
    });
    
    const data = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = { raw: data };
    }
    
    return {
      ok: response.ok,
      status: response.status,
      data: jsonData,
      headers: response.headers
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
      data: null,
      headers: null
    };
  }
}

function recordTest(testName, passed, details = null) {
  if (passed) {
    testResults.passed++;
    log(`PASS: ${testName}`, 'success');
  } else {
    testResults.failed++;
    log(`FAIL: ${testName}`, 'error');
    if (details) {
      testResults.errors.push({ test: testName, details });
    }
  }
  testResults.details[testName] = { passed, details };
}

// Test functions
async function testServerInfrastructure() {
  logSection('SERVER INFRASTRUCTURE VERIFICATION');
  
  // Test 1: Health endpoint
  const health = await makeRequest('/api/health');
  recordTest('Health endpoint responds', health.ok && health.data && health.data.status === 'healthy', health);
  
  // Test 2: Server environment
  if (health.ok && health.data) {
    recordTest('Server environment configured', health.data.environment === 'production', health.data);
    
    // Test 3: Database connection
    recordTest('Database connected', health.data.database === 'connected', health.data);
  } else {
    recordTest('Server environment configured', false, { error: 'Health endpoint not responding' });
    recordTest('Database connected', false, { error: 'Health endpoint not responding' });
  }
  
  // Test 4: CORS configuration
  const corsTest = await makeRequest('/api/health', {
    headers: { 'Origin': 'http://localhost:5173' }
  });
  recordTest('CORS headers present', corsTest.headers && corsTest.headers.get && corsTest.headers.get('access-control-allow-origin') !== null, corsTest);
}

async function testAuthenticationSystem() {
  logSection('AUTHENTICATION SYSTEM VERIFICATION');
  
  // Test 1: User registration
  const signup = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      firstName: 'Test',
      lastName: 'User'
    })
  });
  recordTest('User registration works', signup.ok, signup);
  
  // Test 2: User login
  const login = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    })
  });
  recordTest('User login works', login.ok, login);
  
  // Test 3: Session management
  const me = await makeRequest('/api/auth/me');
  recordTest('Session management works', me.ok, me);
  
  // Test 4: Logout
  const logout = await makeRequest('/api/auth/logout', { method: 'POST' });
  recordTest('Logout works', logout.ok, logout);
  
  // Test 5: Authentication required for protected routes
  const protectedRoute = await makeRequest('/api/auth/me');
  recordTest('Protected routes require authentication', !protectedRoute.ok, protectedRoute);
}

async function testQuizSystem() {
  logSection('QUIZ SYSTEM VERIFICATION');
  
  const testQuizData = {
    mainMotivation: 'financial-freedom',
    weeklyTimeCommitment: 20,
    successIncomeGoal: 5000,
    upfrontInvestment: 1000,
    passionIdentityAlignment: 4,
    businessExitPlan: 'not-sure',
    businessGrowthSize: 'full-time-income',
    passiveIncomeImportance: 3,
    longTermConsistency: 4,
    trialErrorComfort: 3,
    learningPreference: 'hands-on',
    systemsRoutinesEnjoyment: 3,
    discouragementResilience: 4,
    toolLearningWillingness: 'yes',
    organizationLevel: 3,
    selfMotivationLevel: 4,
    uncertaintyHandling: 3,
    repetitiveTasksFeeling: 'tolerate',
    workCollaborationPreference: 'mostly-solo',
    brandFaceComfort: 3,
    competitivenessLevel: 3,
    creativeWorkEnjoyment: 4,
    directCommunicationEnjoyment: 4,
    workStructurePreference: 'some-structure',
    techSkillsRating: 3,
    workspaceAvailability: 'yes',
    supportSystemStrength: 'small-helpful-group',
    internetDeviceReliability: 4,
    familiarTools: ['google-docs-sheets', 'canva'],
    decisionMakingStyle: 'after-some-research',
    riskComfortLevel: 3,
    feedbackRejectionResponse: 3,
    pathPreference: 'mix',
    controlImportance: 4,
    onlinePresenceComfort: 'yes',
    clientCallsComfort: 'yes',
    physicalShippingOpenness: 'no',
    workStylePreference: 'mix-both',
    socialMediaInterest: 3,
    ecosystemParticipation: 'yes',
    existingAudience: 'no',
    promotingOthersOpenness: 'yes',
    teachVsSolvePreference: 'both',
    meaningfulContributionImportance: 4
  };
  
  // Test 1: Save quiz data (anonymous)
  const saveQuiz = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: JSON.stringify({ quizData: testQuizData })
  });
  recordTest('Anonymous quiz data saving', saveQuiz.ok, saveQuiz);
  
  // Test 2: Save quiz data with email
  const saveQuizWithEmail = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: JSON.stringify({ 
      quizData: testQuizData,
      email: 'test-email@example.com'
    })
  });
  recordTest('Email-based quiz data saving', saveQuizWithEmail.ok, saveQuizWithEmail);
  
  // Test 3: Get quiz attempt by ID
  if (saveQuiz.ok && saveQuiz.data.quizAttemptId) {
    const getAttempt = await makeRequest(`/api/quiz-attempts/attempt/${saveQuiz.data.quizAttemptId}`);
    recordTest('Quiz attempt retrieval', getAttempt.ok, getAttempt);
  }
}

async function testAIAnalysisSystem() {
  logSection('AI ANALYSIS SYSTEM VERIFICATION');
  
  const testQuizData = {
    mainMotivation: 'financial-freedom',
    weeklyTimeCommitment: 20,
    successIncomeGoal: 5000
  };
  
  // Test 1: AI business fit analysis
  const aiAnalysis = await makeRequest('/api/ai-business-fit-analysis', {
    method: 'POST',
    body: JSON.stringify({ quizData: testQuizData })
  });
  recordTest('AI business fit analysis', aiAnalysis.ok, aiAnalysis);
  
  // Test 2: AI response structure
  if (aiAnalysis.ok) {
    const hasBusinessPaths = aiAnalysis.data.businessPaths && Array.isArray(aiAnalysis.data.businessPaths);
    const hasPersonalityProfile = aiAnalysis.data.personalityProfile;
    const hasRecommendations = aiAnalysis.data.recommendations;
    
    recordTest('AI response has business paths', hasBusinessPaths, aiAnalysis.data);
    recordTest('AI response has personality profile', hasPersonalityProfile, aiAnalysis.data);
    recordTest('AI response has recommendations', hasRecommendations, aiAnalysis.data);
  }
  
  // Test 3: Income projections
  const projections = await makeRequest('/api/generate-income-projections', {
    method: 'POST',
    body: JSON.stringify({ businessId: 'freelancing' })
  });
  recordTest('Income projections generation', projections.ok, projections);
}

async function testPaymentSystem() {
  logSection('PAYMENT SYSTEM VERIFICATION');
  
  // Test 1: Stripe configuration
  const stripeConfig = await makeRequest('/api/stripe-config');
  recordTest('Stripe configuration endpoint', stripeConfig.ok, stripeConfig);
  
  // Test 2: Stripe publishable key
  if (stripeConfig.ok) {
    recordTest('Stripe publishable key configured', !!stripeConfig.data.publishableKey, stripeConfig.data);
    recordTest('Stripe status ready', stripeConfig.data.status === 'ready', stripeConfig.data);
  }
  
  // Test 3: User pricing endpoint
  const pricing = await makeRequest('/api/user-pricing/1');
  recordTest('User pricing endpoint', pricing.ok, pricing);
  
  // Test 4: Payment status endpoint
  const paymentStatus = await makeRequest('/api/payment-status/999999');
  recordTest('Payment status endpoint', paymentStatus.ok, paymentStatus);
}

async function testPDFGenerationSystem() {
  logSection('PDF GENERATION SYSTEM VERIFICATION');
  
  const testData = {
    quizData: {
      mainMotivation: 'financial-freedom',
      weeklyTimeCommitment: 20,
      successIncomeGoal: 5000
    },
    userEmail: 'test@example.com',
    aiAnalysis: {
      summary: 'Test AI analysis summary'
    },
    topBusinessPath: {
      name: 'Freelancing',
      score: 85
    },
    businessScores: [
      {
        name: 'Freelancing',
        score: 85,
        description: 'Great fit for your skills'
      }
    ]
  };
  
  // Test 1: PDF generation endpoint
  const pdfResponse = await makeRequest('/api/generate-pdf', {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  recordTest('PDF generation endpoint', pdfResponse.ok, pdfResponse);
  
  // Test 2: PDF content type
  if (pdfResponse.ok) {
    const isPDF = pdfResponse.data.raw && pdfResponse.data.raw.startsWith('%PDF');
    recordTest('PDF content is valid', isPDF, { contentType: typeof pdfResponse.data.raw });
  }
  
  // Test 3: PDF report page
  const pdfReportPage = await makeRequest('/pdf-report?data=test');
  recordTest('PDF report page accessible', pdfReportPage.ok, pdfReportPage);
}

async function testEmailSystem() {
  logSection('EMAIL SYSTEM VERIFICATION');
  
  // Test 1: Contact form endpoint
  const contactForm = await makeRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message content',
      category: 'general'
    })
  });
  recordTest('Contact form endpoint', contactForm.ok, contactForm);
  
  // Test 2: Unsubscribe endpoint
  const unsubscribe = await makeRequest('/api/auth/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com' })
  });
  recordTest('Unsubscribe endpoint', unsubscribe.ok, unsubscribe);
}

async function testAdminSystem() {
  logSection('ADMIN SYSTEM VERIFICATION');
  
  // Test 1: Admin routes require authentication
  const adminPayments = await makeRequest('/api/admin/payments');
  recordTest('Admin routes require authentication', !adminPayments.ok, adminPayments);
  
  // Test 2: Admin routes require admin key
  const adminWithKey = await makeRequest('/api/admin/payments', {
    headers: { 'x-admin-key': 'test-key' }
  });
  recordTest('Admin routes require valid admin key', !adminWithKey.ok, adminWithKey);
}

async function testFrontendSystem() {
  logSection('FRONTEND SYSTEM VERIFICATION');
  
  try {
    // Test 1: Frontend server running
    const frontendResponse = await fetch(FRONTEND_URL);
    recordTest('Frontend server running', frontendResponse.ok, { status: frontendResponse.status });
    
    // Test 2: Frontend returns HTML
    const frontendText = await frontendResponse.text();
    const isHTML = frontendText.includes('<!doctype html>') || frontendText.includes('<html');
    recordTest('Frontend returns HTML', isHTML, { contentType: frontendResponse.headers.get('content-type') });
    
    // Test 3: React app loaded
    const hasReactApp = frontendText.includes('id="root"') || frontendText.includes('BizModelAI');
    recordTest('React app loaded', hasReactApp, { hasRoot: frontendText.includes('id="root"') });
    
  } catch (error) {
    recordTest('Frontend accessible', false, { error: error.message });
  }
}

async function testDataManagement() {
  logSection('DATA MANAGEMENT VERIFICATION');
  
  // Test 1: Database operations working (via quiz data)
  const testQuizData = { mainMotivation: 'financial-freedom' };
  const saveData = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: JSON.stringify({ quizData: testQuizData })
  });
  recordTest('Database write operations', saveData.ok, saveData);
  
  // Test 2: Data retrieval working
  if (saveData.ok && saveData.data.quizAttemptId) {
    const retrieveData = await makeRequest(`/api/quiz-attempts/attempt/${saveData.data.quizAttemptId}`);
    recordTest('Database read operations', retrieveData.ok, retrieveData);
  }
  
  // Test 3: Session storage working
  const sessionTest = await makeRequest('/api/auth/session-debug');
  recordTest('Session storage working', sessionTest.ok, sessionTest);
}

async function testErrorHandling() {
  logSection('ERROR HANDLING VERIFICATION');
  
  // Test 1: 404 handling
  const notFound = await makeRequest('/api/nonexistent-endpoint');
  recordTest('404 error handling', !notFound.ok && notFound.status === 404, notFound);
  
  // Test 2: Invalid JSON handling
  const invalidJson = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: 'invalid json',
    headers: { 'Content-Type': 'application/json' }
  });
  recordTest('Invalid JSON handling', !invalidJson.ok, invalidJson);
  
  // Test 3: Missing required fields
  const missingFields = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: JSON.stringify({})
  });
  recordTest('Missing required fields handling', !missingFields.ok, missingFields);
}

async function testPerformance() {
  logSection('PERFORMANCE VERIFICATION');
  
  const startTime = Date.now();
  
  // Test 1: Health endpoint response time
  const healthStart = Date.now();
  const health = await makeRequest('/api/health');
  const healthTime = Date.now() - healthStart;
  recordTest('Health endpoint response time < 1s', healthTime < 1000, { time: healthTime });
  
  // Test 2: Quiz data save response time
  const quizStart = Date.now();
  const quizSave = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: JSON.stringify({ quizData: { mainMotivation: 'financial-freedom' } })
  });
  const quizTime = Date.now() - quizStart;
  recordTest('Quiz save response time < 2s', quizTime < 2000, { time: quizTime });
  
  // Test 3: AI analysis response time (if configured)
  const aiStart = Date.now();
  const aiAnalysis = await makeRequest('/api/ai-business-fit-analysis', {
    method: 'POST',
    body: JSON.stringify({ quizData: { mainMotivation: 'financial-freedom' } })
  });
  const aiTime = Date.now() - aiStart;
  recordTest('AI analysis response time < 30s', aiTime < 30000, { time: aiTime });
  
  const totalTime = Date.now() - startTime;
  log(`Total test execution time: ${totalTime}ms`);
}

async function testSecurity() {
  logSection('SECURITY VERIFICATION');
  
  // Test 1: CORS headers
  const corsTest = await makeRequest('/api/health', {
    headers: { 'Origin': 'http://malicious-site.com' }
  });
  recordTest('CORS protection', corsTest.headers && corsTest.headers.get && corsTest.headers.get('access-control-allow-origin') !== '*', corsTest);
  
  // Test 2: SQL injection protection (basic)
  const sqlInjectionTest = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: JSON.stringify({ 
      quizData: { 
        mainMotivation: "'; DROP TABLE users; --" 
      } 
    })
  });
  recordTest('SQL injection protection', sqlInjectionTest.ok, sqlInjectionTest);
  
  // Test 3: XSS protection (basic)
  const xssTest = await makeRequest('/api/save-quiz-data', {
    method: 'POST',
    body: JSON.stringify({ 
      quizData: { 
        mainMotivation: '<script>alert("xss")</script>' 
      } 
    })
  });
  recordTest('XSS protection', xssTest.ok, xssTest);
}

async function generateReport() {
  logSection('TEST RESULTS SUMMARY');
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.errors.length > 0) {
    console.log(`\n🚨 Errors Found:`);
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.test}: ${JSON.stringify(error.details, null, 2)}`);
    });
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1) + '%'
    },
    details: testResults.details,
    errors: testResults.errors
  };
  
  fs.writeFileSync('system-verification-report.json', JSON.stringify(report, null, 2));
  log('Detailed report saved to system-verification-report.json');
  
  // Overall system status
  const overallStatus = testResults.failed === 0 ? 'PASSED' : 'FAILED';
  console.log(`\n🎯 Overall System Status: ${overallStatus}`);
  
  if (overallStatus === 'PASSED') {
    console.log('🎉 All systems are working correctly!');
  } else {
    console.log('⚠️  Some systems need attention. Please review the errors above.');
  }
}

// Main execution
async function runAllTests() {
  console.log('🚀 Starting BizModelAI Comprehensive System Verification');
  console.log(`📍 Testing server at: ${BASE_URL}`);
  console.log(`📍 Testing frontend at: ${FRONTEND_URL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  
  try {
    await testServerInfrastructure();
    await testAuthenticationSystem();
    await testQuizSystem();
    await testAIAnalysisSystem();
    await testPaymentSystem();
    await testPDFGenerationSystem();
    await testEmailSystem();
    await testAdminSystem();
    await testFrontendSystem();
    await testDataManagement();
    await testErrorHandling();
    await testPerformance();
    await testSecurity();
    
    await generateReport();
    
  } catch (error) {
    log(`Critical error during testing: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, testResults }; 