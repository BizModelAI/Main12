// Clear AI content cache to fix business model mismatch issue
// Run this in the browser console (F12 -> Console tab)

console.log('🧹 Clearing AI content cache...');

// Clear localStorage AI content
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

console.log(`✅ Cleared ${keysToRemove.length} AI content cache entries`);
console.log('🔄 Next time you view results, new AI content will be generated with the correct business model');

// Also clear any business model scores cache
const businessModelKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.includes('business_model_scores') || key.includes('quizData'))) {
    businessModelKeys.push(key);
  }
}

businessModelKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`🗑️ Removed business model cache: ${key}`);
});

console.log(`✅ Also cleared ${businessModelKeys.length} business model cache entries`);
console.log('🔄 Please refresh the page and retake the quiz to see the fix in action'); 