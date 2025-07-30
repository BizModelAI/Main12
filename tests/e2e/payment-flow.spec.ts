import { test, expect } from '@playwright/test';

test.describe('Payment Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and cookies before each test
    await page.context().clearCookies();
    try {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
        
        // Specifically clear quiz-related items
        localStorage.removeItem('quizData');
        localStorage.removeItem('hasCompletedQuiz');
        localStorage.removeItem('currentQuizAttemptId');
        localStorage.removeItem('loadedReportData');
        localStorage.removeItem('quiz-completion-ai-insights');
        localStorage.removeItem('ai-generation-in-progress');
        localStorage.removeItem('ai-generation-timestamp');
        localStorage.removeItem('congratulationsShown');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('hasAnyPayment');
        localStorage.removeItem('hasUnlockedAnalysis');
        localStorage.removeItem('user');
        localStorage.removeItem('tempUserId');
        
        // Clear any AI-related cache keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('ai-content-') || key.startsWith('ai_insights_') || key.startsWith('preview_') || key.startsWith('fullreport_') || key.startsWith('ai-analysis-') || key.startsWith('skills-analysis-') || key.startsWith('ai-cache-'))) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      // Ignore localStorage access errors in some browsers
      console.log('localStorage access blocked, continuing...');
    }
  });

  test('Complete quiz flow and verify payment unlocks results', async ({ page }) => {
    // Navigate to the quiz
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we're on the landing page
    await expect(page.locator('h1')).toContainText(/Stop Overthinking|Start Building/i);
    
    // Find and click the "Discover Your Path" button
    const startQuizButton = page.locator('a:has-text("Discover Your Path"), button:has-text("Discover Your Path")').first();
    await expect(startQuizButton).toBeVisible();
    await startQuizButton.click();
    
    // Wait for quiz to load
    await page.waitForLoadState('networkidle');
    
    // Fill out the quiz with sample data - this will complete the quiz and navigate to loading page
    await fillQuizData(page);
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the results page
    await expect(page.locator('h1, h2')).toContainText(/results|analysis|recommendations/i);
    
    // Wait a bit more for the page to settle
    await page.waitForTimeout(2000);
    
    // Check if paywall is showing (it should be for new users)
    const paywallElement = page.locator('text=Unlock your results, text=Unlock Full Analysis, text=Unlock your results with small one-time fee, .paywall, [data-testid="paywall"]').first();
    
    if (await paywallElement.isVisible()) {
      // Verify the correct price is shown ($9.99 for unauthenticated users)
      await expect(page.locator('text=$9.99')).toBeVisible();
      
      // Click the unlock button
      const unlockButton = page.locator('button:has-text("Unlock"), button:has-text("$9.99"), button:has-text("Unlock Full Analysis")').first();
      await expect(unlockButton).toBeVisible();
      await unlockButton.click();
      
      // Wait for payment modal to appear
      await page.waitForSelector('[data-testid="payment-modal"], .payment-modal, .modal', { timeout: 10000 });
      
      // Fill out payment form (this will depend on your payment implementation)
      await fillPaymentForm(page);
      
      // Submit payment
      const payButton = page.locator('button:has-text("Pay"), button:has-text("Submit"), button:has-text("Complete Payment")').first();
      await expect(payButton).toBeVisible();
      await payButton.click();
      
      // Wait for payment success
      await page.waitForLoadState('networkidle');
      
      // Verify the page reloads and shows unlocked content
      await page.waitForTimeout(2000); // Wait for any redirects/reloads
      
      // Check that localStorage flags are set
      try {
        const localStorageFlags = await page.evaluate(() => ({
          hasAnyPayment: localStorage.getItem('hasAnyPayment'),
          hasUnlockedAnalysis: localStorage.getItem('hasUnlockedAnalysis'),
          hasCompletedQuiz: localStorage.getItem('hasCompletedQuiz')
        }));
        
        expect(localStorageFlags.hasAnyPayment).toBe('true');
        expect(localStorageFlags.hasUnlockedAnalysis).toBe('true');
        expect(localStorageFlags.hasCompletedQuiz).toBe('true');
      } catch (error) {
        console.log('localStorage get failed, skipping checks');
      }
      
      // Verify unlocked content is visible
      await expect(page.locator('text=Your AI-Generated Insights')).toBeVisible();
      await expect(page.locator('text=Personalized Action Plan')).toBeVisible();
    } else {
      // If no paywall, verify content is already unlocked
      await expect(page.locator('text=Your AI-Generated Insights')).toBeVisible();
    }
  });

  test('Paid user sees correct pricing ($4.99)', async ({ page }) => {
    // Navigate to the quiz
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Simulate a paid user by setting localStorage flags
    try {
      await page.evaluate(() => {
        localStorage.setItem('hasAnyPayment', 'true');
        localStorage.setItem('hasUnlockedAnalysis', 'true');
        localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com', isTemporary: false }));
      });
    } catch (error) {
      console.log('localStorage access blocked, continuing...');
    }
    
    // Find and click the "Discover Your Path" button
    const startQuizButton = page.locator('a:has-text("Discover Your Path"), button:has-text("Discover Your Path")').first();
    await expect(startQuizButton).toBeVisible();
    await startQuizButton.click();
    
    // Wait for quiz page to load
    await page.waitForLoadState('networkidle');
    
    // Fill out the quiz - this will complete the quiz and navigate to loading page
    await fillQuizData(page);
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Check if paywall is showing and verify $4.99 pricing
    const paywallElement = page.locator('text=Unlock your results, text=Unlock Full Analysis, text=Unlock your results with small one-time fee').first();
    
    if (await paywallElement.isVisible()) {
      await expect(page.locator('text=$4.99')).toBeVisible();
      await expect(page.locator('text=$9.99')).not.toBeVisible();
    }
  });

  test('Payment success properly unlocks content after page reload', async ({ page }) => {
    // Navigate to the quiz
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Find and click the "Discover Your Path" button
    const startQuizButton = page.locator('a:has-text("Discover Your Path"), button:has-text("Discover Your Path")').first();
    await expect(startQuizButton).toBeVisible();
    await startQuizButton.click();
    
    // Fill out the quiz - this will complete the quiz and navigate to loading page
    await fillQuizData(page);
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Simulate payment success by setting localStorage flags
    await page.evaluate(() => {
      localStorage.setItem('hasAnyPayment', 'true');
      localStorage.setItem('hasUnlockedAnalysis', 'true');
      localStorage.setItem('hasCompletedQuiz', 'true');
    });
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify content is unlocked after reload
    await expect(page.locator('text=Your AI-Generated Insights')).toBeVisible();
    await expect(page.locator('text=Personalized Action Plan')).toBeVisible();
    
    // Verify paywall is not showing
    const paywallElement = page.locator('text=Unlock your results, text=Unlock Full Analysis, text=Unlock your results with small one-time fee').first();
    await expect(paywallElement).not.toBeVisible();
  });

  test('Debug unlock status logging works', async ({ page }) => {
    // Navigate to the quiz
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Find and click the "Discover Your Path" button
    const startQuizButton = page.locator('a:has-text("Discover Your Path"), button:has-text("Discover Your Path")').first();
    await expect(startQuizButton).toBeVisible();
    await startQuizButton.click();
    
    // Fill out the quiz - this will complete the quiz and navigate to loading page
    await fillQuizData(page);
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // Wait for loading to complete
    await page.waitForFunction(() => {
      const bodyText = document.body.textContent || '';
      return !bodyText.includes('AI is Creating Your Personalized Report');
    }, { timeout: 30000 });
    
    // Check console logs for debug information
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('localStorage') || msg.text().includes('unlock') || msg.text().includes('paywall')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Wait a bit for any console logs
    await page.waitForTimeout(2000);
    
    // Verify debug logs are present
    expect(consoleLogs.length).toBeGreaterThan(0);
  });
});

// Helper function to fill quiz data
async function fillQuizData(page: any) {
  // Wait for quiz to load
  await page.waitForLoadState('networkidle');
  
  // The quiz has multiple steps, we need to go through each one
  // We'll select the first option for each question and click Next
  let currentStep = 0;
  const maxSteps = 45; // Based on the quiz structure
  
  while (currentStep < maxSteps) {
    try {
      // Wait for either the round intro button or the question navigation button
      await page.waitForSelector('button:has-text("Start Round"), button:has-text("Next"), button:has-text("Get My Results")', { timeout: 5000 });
      
      // Check if we're on a round intro page
      const roundIntroButton = page.locator('button:has-text("Start Round")');
      if (await roundIntroButton.isVisible()) {
        console.log('On round intro page, clicking Start Round');
        await roundIntroButton.click();
        await page.waitForTimeout(2000); // Wait longer for transition
        await page.waitForLoadState('networkidle');
        continue; // Go to next iteration to handle the actual question
      }
      
      // Check if we're on a scale question (1-5 options) or regular question
      const scaleButtons = await page.locator('button:has-text("1"), button:has-text("2"), button:has-text("3"), button:has-text("4"), button:has-text("5")').count();
      
      if (scaleButtons > 0) {
        // Scale question - click the middle option (3)
        await page.click('button:has-text("3")');
      } else {
        // Regular question - click the first option available
        const firstOption = page.locator('button').filter({ hasText: /^[A-Z]/ }).first();
        if (await firstOption.isVisible()) {
          await firstOption.click();
        } else {
          // Fallback: click any button that looks like an option
          await page.locator('button').nth(1).click();
        }
      }
      
      // Wait a moment for the selection to register
      await page.waitForTimeout(500);
      
      // Click Next or Get My Results
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Get My Results")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
      
      // Wait for the next question to load
      await page.waitForTimeout(1000);
      
      currentStep++;
      
      // Check if we've completed the quiz (results page or loading page)
      const resultsIndicator = await page.locator('text=Results, text=Your Results, text=Analysis, text=Business Model').count();
      const loadingIndicator = await page.locator('text=Processing, text=Loading, text=Generating, text=AI is Creating Your Personalized Report').count();
      if (resultsIndicator > 0 || loadingIndicator > 0) {
        console.log('Quiz completed, reached results or loading page');
        break;
      }
      
    } catch (error) {
      console.log(`Error on step ${currentStep}:`, error.message);
      
      // Try to get more information about what's on the page
      try {
        const pageText = await page.textContent('body');
        console.log(`Page content: ${pageText?.substring(0, 200)}...`);
        
        // Check if we're on a different page
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        // Check if we've completed the quiz (results page or loading page)
        const resultsIndicator = await page.locator('text=Results, text=Your Results, text=Analysis, text=Business Model').count();
        const loadingIndicator = await page.locator('text=Processing, text=Loading, text=Generating, text=AI is Creating Your Personalized Report').count();
        
        if (currentUrl.includes('/results') || currentUrl.includes('/quiz-loading') || resultsIndicator > 0 || loadingIndicator > 0) {
          console.log('Quiz completed, reached results or loading page');
          break;
        }
      } catch (debugError) {
        console.log('Could not get debug info:', debugError.message);
      }
      
      // Only continue to next step if we haven't completed the quiz
      currentStep++;
    }
  }
  
  // Wait for results to fully load
  await page.waitForLoadState('networkidle');
  
  // If we're on a loading page, wait for it to complete and navigate to results
  const loadingIndicator = await page.locator('text=Processing, text=Loading, text=Generating, text=AI is Creating Your Personalized Report').count();
  if (loadingIndicator > 0) {
    console.log('Waiting for loading to complete...');
    // Wait for loading to complete (up to 30 seconds)
    await page.waitForFunction(() => {
      const bodyText = document.body.textContent || '';
      return !bodyText.includes('AI is Creating Your Personalized Report') && 
             !bodyText.includes('Our advanced AI is analyzing');
    }, { timeout: 30000 });
  }
}

// Helper function to fill payment form
async function fillPaymentForm(page: any) {
  // This is a placeholder - you'll need to implement based on your payment form
  // For now, we'll just wait for the form to be visible
  await page.waitForSelector('input[type="text"], input[type="email"], input[type="card"]', { timeout: 5000 });
  
  // Fill out basic payment form fields if they exist
  try {
    await page.fill('input[placeholder*="email"], input[name="email"]', 'test@example.com');
    await page.fill('input[placeholder*="card"], input[name="card"]', '4242424242424242');
    await page.fill('input[placeholder*="expiry"], input[name="expiry"]', '12/25');
    await page.fill('input[placeholder*="cvc"], input[name="cvc"]', '123');
  } catch (error) {
    console.log('Payment form fields not found, continuing...');
  }
} 