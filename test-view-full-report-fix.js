import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

async function setupTestUserAndQuiz() {
  // Ensure the test user exists and is paid, and has a paid quiz attempt
  const email = 'caseyedunham@gmail.com';
  const password = 'testpassword123';
  // 1. Create or update the user
  await fetch('http://localhost:9000/api/test-setup-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, isPaid: true })
  });
  // 2. Create or update a paid quiz attempt for the user
  await fetch('http://localhost:9000/api/test-setup-quiz-attempt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, isPaid: true })
  });
}

async function testViewFullReportFix() {
  console.log('🧪 Testing View Full Report button fix...');

  // Setup test user and quiz attempt
  await setupTestUserAndQuiz();

  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log('Browser console:', msg.text());
    });
    
    // Navigate to the app
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:9000', { waitUntil: 'networkidle0' });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we need to login
    const loginButton = await page.$('a[href="/login"]');
    if (loginButton) {
      console.log('🔐 Logging in...');
      await loginButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Enable request interception to log login POST
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url().includes('/api/auth/login')) {
          console.log('➡️ Login request:', request.method(), request.url(), request.headers());
        }
        request.continue();
      });
      page.on('response', async response => {
        if (response.url().includes('/api/auth/login')) {
          const headers = response.headers();
          console.log('⬅️ Login response headers:', headers);
        }
      });

      // Use native form submit
      await page.evaluate(() => {
        document.querySelector('input[type="email"]').value = 'caseyedunham@gmail.com';
        document.querySelector('input[type="password"]').value = 'testpassword123';
        const form = document.querySelector('form');
        if (form) form.submit();
      });
      // Wait for dashboard element or fallback to timeout
      try {
        await page.waitForSelector('.dashboard, h1, h2', { timeout: 10000 });
      } catch (e) {
        console.log('⚠️ Dashboard element not found after login, continuing...');
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Log all cookies
      const cookies = await page.cookies();
      console.log('🍪 Cookies after login:', cookies);
      const hasSessionCookie = cookies.some(c => c.name.includes('sid'));
      if (!hasSessionCookie) {
        console.log('❌ No session cookie found after login, aborting test.');
        await browser.close();
        return;
      }
      // Check /api/auth/me
      const authMe = await page.evaluate(async () => {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        return { status: res.status, json: await res.json() };
      });
      console.log('🔎 /api/auth/me after login:', authMe);
      if (authMe.status !== 200) {
        console.log('❌ Authentication failed after login, aborting test.');
        await browser.close();
        return;
      }
    }
    
    // Navigate to dashboard
    console.log('🏠 Navigating to dashboard...');
    await page.goto('http://localhost:9000/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check localStorage before clicking
    const localStorageBefore = await page.evaluate(() => {
      return {
        quizData: localStorage.getItem('quizData'),
        keys: Object.keys(localStorage)
      };
    });
    console.log('📦 localStorage before:', localStorageBefore);
    
    // Find and click "View Full Report" button
    console.log('🔍 Looking for View Full Report button...');
    const viewFullReportButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => 
        button.textContent?.includes('View Full Report') ||
        button.textContent?.includes('Full Report')
      );
    });
    
    if (!viewFullReportButton) {
      console.log('❌ View Full Report button not found');
      console.log('🔍 Available buttons:', await page.evaluate(() => {
        return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
      }));
      return;
    }
    
    console.log('✅ Found View Full Report button, clicking...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(button => 
        button.textContent?.includes('View Full Report') ||
        button.textContent?.includes('Full Report')
      );
      if (button) button.click();
    });
    
    // Wait for navigation and API call
    console.log('⏳ Waiting for navigation and API call...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on the results page
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/results')) {
      console.log('✅ Successfully navigated to results page');
      
      // Wait for the page to load and check for quiz data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check localStorage after navigation
      const localStorageAfter = await page.evaluate(() => {
        return {
          quizData: localStorage.getItem('quizData'),
          keys: Object.keys(localStorage)
        };
      });
      console.log('📦 localStorage after:', localStorageAfter);
      
      // Check if the results page is showing content or loading
      const pageContent = await page.evaluate(() => {
        return {
          title: document.title,
          hasLoadingText: document.body.textContent?.includes('Loading Results'),
          hasFallbackText: document.body.textContent?.includes('No quiz data available'),
          hasResultsContent: document.body.textContent?.includes('Your Best Fit Business Model')
        };
      });
      
      console.log('📄 Page content check:', pageContent);
      
      if (pageContent.hasResultsContent) {
        console.log('✅ SUCCESS: Results page is showing content properly!');
      } else if (pageContent.hasLoadingText) {
        console.log('⏳ Results page is loading... waiting a bit more...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check again
        const finalContent = await page.evaluate(() => {
          return {
            hasResultsContent: document.body.textContent?.includes('Your Best Fit Business Model'),
            hasError: document.body.textContent?.includes('No quiz data available')
          };
        });
        
        if (finalContent.hasResultsContent) {
          console.log('✅ SUCCESS: Results page loaded after waiting!');
        } else if (finalContent.hasError) {
          console.log('❌ ERROR: Still showing fallback message');
        } else {
          console.log('⚠️ UNKNOWN: Page state unclear');
        }
      } else {
        console.log('❌ ERROR: Results page not showing expected content');
      }
      
    } else {
      console.log('❌ ERROR: Failed to navigate to results page');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('🏁 Test completed');
    await browser.close();
  }
}

testViewFullReportFix(); 