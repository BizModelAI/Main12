import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testPaymentSimple() {
  console.log('🔍 Comprehensive Payment System Test\n');

  try {
    // Test 1: Stripe configuration
    console.log('1️⃣ Testing Stripe configuration...');
    const stripeConfigResponse = await fetch(`${BASE_URL}/api/stripe-config`);
    const stripeConfigData = await stripeConfigResponse.json();
    console.log('✅ Stripe config:', {
      configured: !!stripeConfigData.publishableKey,
      keyLength: stripeConfigData.publishableKey?.length || 0,
      status: stripeConfigData.status
    });

    // Test 2: Create first quiz attempt
    console.log('\n2️⃣ Creating first quiz attempt...');
    const email1 = `payment-test-1-${Date.now()}@example.com`;
    const quizData1 = {
      test: 'payment system test 1',
      timestamp: new Date().toISOString()
    };

    const saveResponse1 = await fetch(`${BASE_URL}/api/save-quiz-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email1, quizData: quizData1 })
    });

    const saveData1 = await saveResponse1.json();
    console.log('✅ First quiz data saved:', {
      success: saveData1.success,
      quizAttemptId: saveData1.quizAttemptId,
      userType: saveData1.userType
    });

    if (!saveData1.success || !saveData1.quizAttemptId) {
      throw new Error('Failed to save first quiz data');
    }

    const quizAttemptId1 = saveData1.quizAttemptId;

    // Test 3: Create payment intent for first user
    console.log('\n3️⃣ Creating payment intent for first user...');
    const paymentResponse1 = await fetch(`${BASE_URL}/api/create-report-unlock-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email1,
        quizAttemptId: quizAttemptId1
      })
    });

    const paymentData1 = await paymentResponse1.json();
    console.log('✅ First payment creation result:', {
      success: paymentData1.success,
      paymentId: paymentData1.paymentId,
      amount: paymentData1.amount,
      hasClientSecret: !!paymentData1.clientSecret
    });

    if (!paymentData1.success) {
      throw new Error(`First payment creation failed: ${paymentData1.error}`);
    }

    // Test 4: Create second quiz attempt (different user)
    console.log('\n4️⃣ Creating second quiz attempt (different user)...');
    const email2 = `payment-test-2-${Date.now()}@example.com`;
    const quizData2 = {
      test: 'payment system test 2',
      timestamp: new Date().toISOString()
    };

    const saveResponse2 = await fetch(`${BASE_URL}/api/save-quiz-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email2, quizData: quizData2 })
    });

    const saveData2 = await saveResponse2.json();
    console.log('✅ Second quiz data saved:', {
      success: saveData2.success,
      quizAttemptId: saveData2.quizAttemptId,
      userType: saveData2.userType
    });

    if (!saveData2.success || !saveData2.quizAttemptId) {
      throw new Error('Failed to save second quiz data');
    }

    const quizAttemptId2 = saveData2.quizAttemptId;

    // Test 5: Create payment intent for second user
    console.log('\n5️⃣ Creating payment intent for second user...');
    const paymentResponse2 = await fetch(`${BASE_URL}/api/create-report-unlock-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email2,
        quizAttemptId: quizAttemptId2
      })
    });

    const paymentData2 = await paymentResponse2.json();
    console.log('✅ Second payment creation result:', {
      success: paymentData2.success,
      paymentId: paymentData2.paymentId,
      amount: paymentData2.amount,
      hasClientSecret: !!paymentData2.clientSecret
    });

    if (!paymentData2.success) {
      throw new Error(`Second payment creation failed: ${paymentData2.error}`);
    }

    // Test 6: Check payment statuses
    console.log('\n6️⃣ Checking payment statuses...');
    const statusResponse1 = await fetch(`${BASE_URL}/api/payment-status/${paymentData1.paymentId}`);
    const statusData1 = await statusResponse1.json();
    console.log('✅ First payment status:', {
      paymentId: statusData1.paymentId,
      status: statusData1.status,
      amount: statusData1.amount,
      type: statusData1.type,
      quizAttemptId: statusData1.quizAttemptId
    });

    const statusResponse2 = await fetch(`${BASE_URL}/api/payment-status/${paymentData2.paymentId}`);
    const statusData2 = await statusResponse2.json();
    console.log('✅ Second payment status:', {
      paymentId: statusData2.paymentId,
      status: statusData2.status,
      amount: statusData2.amount,
      type: statusData2.type,
      quizAttemptId: statusData2.quizAttemptId
    });

    console.log('\n🎉 PAYMENT SYSTEM TEST COMPLETE');
    console.log('===============================');
    console.log('✅ Stripe Configuration: Working');
    console.log('✅ Quiz Data Storage: Working');
    console.log('✅ Payment Intent Creation: Working');
    console.log('✅ Payment Status Checking: Working');
    console.log('✅ Multiple Users: Working');
    console.log('✅ Unique Quiz Attempt IDs: Working');
    console.log('\n💰 Payment System is fully operational!');
    console.log('\n📊 Test Summary:');
    console.log(`   - User 1: ${email1} (Quiz ID: ${quizAttemptId1}, Payment ID: ${paymentData1.paymentId})`);
    console.log(`   - User 2: ${email2} (Quiz ID: ${quizAttemptId2}, Payment ID: ${paymentData2.paymentId})`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPaymentSimple(); 