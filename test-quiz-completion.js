#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testQuizCompletion() {
  try {
    console.log('🧪 Testing Quiz Completion Flow...');

    // Test 1: Create quiz attempt
    console.log('1. Creating quiz attempt...');
    const quizData = {
      mainMotivation: 'financial-freedom',
      successIncomeGoal: 5000,
      techSkillsRating: 3,
      riskComfortLevel: 3,
      directCommunicationEnjoyment: 4,
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
      monetizationModelPreference: 'direct-sales',
      customerInteractionComfort: 'somewhat-comfortable',
      contentCreationEnjoyment: 3,
      technicalComplexityPreference: 'moderate',
      scalabilityImportance: 4,
      locationIndependence: 3,
      startupCapital: 1000,
      timeToFirstIncome: '3-6-months',
      businessGrowthSize: 'full-time-income',
      passiveIncomeImportance: 3,
      brandFaceComfort: 3,
      competitivenessLevel: 3,
      workStructurePreference: 'some-structure',
      longTermConsistency: 4,
      trialErrorComfort: 3,
      learningPreference: 'hands-on',
      systemsRoutinesEnjoyment: 3,
      discouragementResilience: 4,
      toolLearningWillingness: 'yes',
      repetitiveTasksFeeling: 'tolerate',
      brandFaceComfort: 3,
      workspaceAvailability: 'yes',
      supportSystemStrength: 'small-helpful-group',
      internetDeviceReliability: 4,
      familiarTools: ['google-docs-sheets', 'canva'],
      feedbackRejectionResponse: 3
    };

    const createResponse = await fetch(`${BASE_URL}/api/quiz-attempts/record-guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizData: quizData,
        quizAttemptId: Date.now().toString()
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create quiz attempt: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    console.log('✅ Quiz attempt created:', createData.attemptId);

    // Test 2: Generate AI content via OpenAI API
    console.log('2. Generating AI content via OpenAI...');
    const aiResponse = await fetch(`${BASE_URL}/api/openai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a business consultant analyzing quiz responses to provide personalized business recommendations.'
          },
          {
            role: 'user',
            content: `Analyze this quiz data and provide a brief personalized business recommendation: ${JSON.stringify(quizData)}`
          }
        ],
        maxTokens: 200
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`Failed to generate AI content: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('✅ AI content generated successfully:', aiData.content ? 'Content received' : 'No content');

    // Test 3: Save AI content to database
    console.log('3. Saving AI content to database...');
    const saveResponse = await fetch(`${BASE_URL}/api/quiz-attempts/attempt/${createData.attemptId}/ai-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: 'results-preview',
        content: {
          previewInsights: aiData.content || 'Based on your quiz responses, you show strong potential for business success.',
          keyInsights: ['Focus on your top business model match', 'Start with small, manageable steps'],
          successPredictors: ['Consistent daily action', 'Regular progress tracking']
        }
      })
    });

    if (!saveResponse.ok) {
      throw new Error(`Failed to save AI content: ${saveResponse.status}`);
    }

    const saveData = await saveResponse.json();
    console.log('✅ AI content saved to database');

    // Test 4: Retrieve AI content from database
    console.log('4. Retrieving AI content from database...');
    const retrieveResponse = await fetch(`${BASE_URL}/api/quiz-attempts/attempt/${createData.attemptId}/ai-content?contentType=results-preview`);
    
    if (!retrieveResponse.ok) {
      throw new Error(`Failed to retrieve AI content: ${retrieveResponse.status}`);
    }

    const retrieveData = await retrieveResponse.json();
    console.log('✅ AI content retrieved successfully:', retrieveData.aiContent ? 'Content found' : 'No content');

    console.log('🎉 Quiz completion flow test PASSED!');
    return true;

  } catch (error) {
    console.log('❌ Quiz completion flow test FAILED:', error.message);
    return false;
  }
}

// Run the test
testQuizCompletion().then(success => {
  process.exit(success ? 0 : 1);
}); 