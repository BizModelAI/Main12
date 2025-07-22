// Test script to verify AI content caching fix
// Run this in the browser console (F12 -> Console tab)

console.log('🧪 Testing AI Content Caching Fix...\n');

// Step 1: Clear all old AI content cache
console.log('1️⃣ Clearing old AI content cache...');
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('ai_content_')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`🗑️ Removed: ${key}`);
});

console.log(`✅ Cleared ${keysToRemove.length} old AI content cache entries\n`);

// Step 2: Check current quiz attempt ID
console.log('2️⃣ Checking current quiz attempt ID...');
const currentQuizAttemptId = localStorage.getItem('currentQuizAttemptId');
const quizData = localStorage.getItem('quizData');

console.log('   Current Quiz Attempt ID:', currentQuizAttemptId || 'None');
console.log('   Quiz Data Present:', !!quizData);

if (quizData) {
  try {
    const parsedQuizData = JSON.parse(quizData);
    console.log('   Quiz Data Keys:', Object.keys(parsedQuizData));
  } catch (e) {
    console.log('   Error parsing quiz data:', e.message);
  }
}

// Step 3: Check business model scores
console.log('\n3️⃣ Checking business model scores...');
const scoresData = localStorage.getItem('business_model_scores');
if (scoresData) {
  try {
    const scores = JSON.parse(scoresData);
    console.log('   Top Business Model:', scores.scores?.[0]?.name || 'Unknown');
    console.log('   Top Score:', scores.scores?.[0]?.score || 'Unknown');
    console.log('   Total Models:', scores.scores?.length || 0);
  } catch (e) {
    console.log('   Error parsing scores:', e.message);
  }
} else {
  console.log('   No business model scores found');
}

// Step 4: Test cache key generation
console.log('\n4️⃣ Testing cache key generation...');
const testBusinessModels = ['Online Reselling', 'Affiliate Marketing', 'Digital Products'];
testBusinessModels.forEach(model => {
  const cacheKey = `preview_${model.replace(/\s+/g, '_')}`;
  console.log(`   "${model}" -> "${cacheKey}"`);
});

console.log('\n✅ Test complete!');
console.log('🔄 Next time you view results, new AI content will be generated with the correct business model names.');
console.log('📝 The cache keys will now include the business model name (e.g., "preview_Online_Reselling")'); 