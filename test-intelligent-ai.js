import fetch from 'node-fetch';

async function testIntelligentAI() {
  console.log('🧪 Testing Intelligent AI Content Generation System...');
  
  try {
    // Test 1: Check if we can get quiz data (prerequisite for AI generation)
    console.log('\n📊 Test 1: Checking quiz data availability...');
    const quizResponse = await fetch('http://localhost:9000/api/auth/latest-quiz-data', {
      credentials: 'include',
      headers: {
        'Cookie': 'sessionId=r9jr2EiBEneGuSCrjov7YxXc1VeLAkRM'
      }
    });
    
    if (quizResponse.ok) {
      const quizData = await quizResponse.json();
      console.log('✅ Quiz data available:', !!quizData);
      console.log('📋 Quiz data keys:', Object.keys(quizData || {}));
    } else {
      console.log('❌ No quiz data available - AI generation should use fallback');
    }
    
    // Test 2: Check if AI content exists for a specific quiz attempt
    console.log('\n🔍 Test 2: Checking existing AI content...');
    const attemptId = 200; // Use the attempt ID from the logs
    const aiContentResponse = await fetch(`http://localhost:9000/api/quiz-attempts/${attemptId}/ai-content?type=preview`, {
      credentials: 'include',
      headers: {
        'Cookie': 'sessionId=r9jr2EiBEneGuSCrjov7YxXc1VeLAkRM'
      }
    });
    
    if (aiContentResponse.ok) {
      const aiContent = await aiContentResponse.json();
      console.log('✅ Existing AI content found:', !!aiContent.content);
      console.log('📄 Content type: preview');
    } else if (aiContentResponse.status === 404) {
      console.log('❌ No existing AI content found - should generate new content');
    } else {
      console.log('⚠️ Error checking AI content:', aiContentResponse.status);
    }
    
    // Test 3: Check all AI content for the quiz attempt
    console.log('\n📚 Test 3: Checking all AI content types...');
    const allContentResponse = await fetch(`http://localhost:9000/api/quiz-attempts/${attemptId}/ai-content`, {
      credentials: 'include',
      headers: {
        'Cookie': 'sessionId=r9jr2EiBEneGuSCrjov7YxXc1VeLAkRM'
      }
    });
    
    if (allContentResponse.ok) {
      const allContent = await allContentResponse.json();
      console.log('✅ All AI content retrieved');
      console.log('📋 Content types available:', Object.keys(allContent.aiContent || {}));
    } else {
      console.log('❌ Error retrieving all AI content:', allContentResponse.status);
    }
    
    // Test 4: Test the intelligent generation logic (simulate what the frontend does)
    console.log('\n🤖 Test 4: Simulating intelligent AI generation logic...');
    
    // Simulate the shouldGenerateAIContent logic
    const quizAttemptId = '200';
    const contentType = 'preview';
    
    console.log(`🔍 Checking if should generate ${contentType} AI content...`);
    console.log(`📝 Quiz attempt ID: ${quizAttemptId}`);
    
    // Check if content exists in database
    const existingContentResponse = await fetch(`http://localhost:9000/api/quiz-attempts/${attemptId}/ai-content?type=${contentType}`, {
      credentials: 'include',
      headers: {
        'Cookie': 'sessionId=r9jr2EiBEneGuSCrjov7YxXc1VeLAkRM'
      }
    });
    
    if (existingContentResponse.ok) {
      console.log('✅ Content exists in database - should NOT generate new content');
      console.log('💡 Expected behavior: Use existing content, no API call');
    } else if (existingContentResponse.status === 404) {
      console.log('❌ No content in database - should generate new content');
      console.log('💡 Expected behavior: Make OpenAI API call, save to database');
    } else {
      console.log('⚠️ Error checking database content:', existingContentResponse.status);
    }
    
    console.log('\n✅ Intelligent AI Content Generation Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- The system should only generate AI content when:');
    console.log('  1. Quiz data is available in database');
    console.log('  2. Content hasn\'t been generated yet for that type');
    console.log('  3. User is authenticated (for database storage)');
    console.log('- Otherwise, it should use fallback content or existing cached content');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testIntelligentAI(); 