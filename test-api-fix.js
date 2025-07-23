import fetch from 'node-fetch';

async function testAPIFix() {
  console.log('🧪 Testing API fix for View Full Report...');
  
  try {
    // Test the latest quiz data endpoint
    console.log('📡 Testing /api/auth/latest-quiz-data endpoint...');
    const response = await fetch('http://localhost:9000/api/auth/latest-quiz-data', {
      credentials: 'include',
      headers: {
        'Cookie': 'sessionId=r9jr2EiBEneGuSCrjov7YxXc1VeLAkRM' // Use the session ID from the curl test
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
      
      if (data.quizData) {
        console.log('✅ SUCCESS: Quiz data found in API response');
        console.log('📊 Quiz data keys:', Object.keys(data.quizData));
        console.log('🆔 Quiz attempt ID:', data.quizData.id || 'Not found');
      } else {
        console.log('❌ ERROR: No quiz data in API response');
      }
    } else {
      console.log('❌ ERROR: API request failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  console.log('🏁 API test completed');
}

testAPIFix(); 