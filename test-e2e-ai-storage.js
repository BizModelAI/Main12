import fetch from 'node-fetch';

// Provide your test credentials here
const EMAIL = 'caseyedunham@gmail.com';
const PASSWORD = 'YOUR_PASSWORD_HERE'; // <-- Replace with your real password or a test account password

async function loginAndGetSessionCookie() {
  const res = await fetch('http://localhost:5073/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    redirect: 'manual',
  });
  if (!res.ok && res.status !== 302) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }
  // Get the set-cookie header
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) throw new Error('No set-cookie header received');
  // Extract sessionId cookie
  const match = setCookie.match(/sessionId=([^;]+);/);
  if (!match) throw new Error('No sessionId found in set-cookie');
  return `sessionId=${match[1]}`;
}

async function runE2EAIStorageTest() {
  console.log('🧪 Starting end-to-end AI storage test...');

  // 0. Login and get session cookie
  console.log('\n🔑 Step 0: Logging in to get session cookie...');
  let SESSION_COOKIE;
  try {
    SESSION_COOKIE = await loginAndGetSessionCookie();
    console.log('✅ Got session cookie:', SESSION_COOKIE);
  } catch (err) {
    console.error('❌ Login failed:', err);
    return;
  }

  // 1. Fetch latest quiz data
  console.log('\n📊 Step 1: Fetching latest quiz data...');
  const quizRes = await fetch('http://localhost:5073/api/auth/latest-quiz-data', {
    credentials: 'include',
    headers: { 'Cookie': SESSION_COOKIE },
  });
  if (!quizRes.ok) {
    console.error('❌ Failed to fetch latest quiz data:', quizRes.status, await quizRes.text());
    return;
  }
  const quizData = await quizRes.json();
  console.log('✅ Quiz data:', quizData);

  // 2. Get quizAttemptId
  const quizAttemptId = quizData?.quizData?.id || quizData?.id;
  if (!quizAttemptId) {
    console.error('❌ No quizAttemptId found in quiz data!');
    return;
  }
  console.log('✅ quizAttemptId:', quizAttemptId);

  // 3. Fetch AI content for this attempt (preview type)
  console.log('\n🤖 Step 2: Fetching AI content for quiz attempt...');
  const aiRes = await fetch(`http://localhost:5073/api/quiz-attempts/${quizAttemptId}/ai-content?type=preview`, {
    credentials: 'include',
    headers: { 'Cookie': SESSION_COOKIE },
  });
  if (!aiRes.ok) {
    console.error('❌ Failed to fetch AI content:', aiRes.status, await aiRes.text());
    return;
  }
  const aiContent = await aiRes.json();
  console.log('✅ AI content:', aiContent);

  // 4. Print summary
  console.log('\n🎉 End-to-end AI storage test PASSED!');
  console.log('Quiz data and AI content are both present and accessible.');
}

runE2EAIStorageTest(); 