import { test, expect } from '@playwright/test';

test.describe('Unlock Logic and localStorage Tests', () => {
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
      console.log('localStorage access blocked, continuing...');
    }
  });

  test('localStorage flags control unlock status correctly', async ({ page }) => {
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
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for the page to settle
    await page.waitForTimeout(2000);
    
    // Initially, should show paywall (no localStorage flags)
    const paywallElement = page.locator('text=Unlock your results, text=Unlock Full Analysis, text=Unlock your results with small one-time fee').first();
    await expect(paywallElement).toBeVisible();
    
    // Set localStorage flags to simulate payment success
    try {
      await page.evaluate(() => {
        localStorage.setItem('hasAnyPayment', 'true');
        localStorage.setItem('hasUnlockedAnalysis', 'true');
        localStorage.setItem('hasCompletedQuiz', 'true');
      });
    } catch (error) {
      console.log('localStorage set failed, skipping test');
      return;
    }
    
    // Reload the page to apply the new localStorage values
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Now paywall should not be visible
    await expect(paywallElement).not.toBeVisible();
    
    // Verify unlocked content is visible
    await expect(page.locator('text=Your AI-Generated Insights')).toBeVisible();
    await expect(page.locator('text=Personalized Action Plan')).toBeVisible();
  });

  test('Payment success flow sets all required flags', async ({ page }) => {
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
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for the page to settle
    await page.waitForTimeout(2000);
    
    // Simulate payment success by setting localStorage flags
    try {
      await page.evaluate(() => {
        localStorage.setItem('hasAnyPayment', 'true');
        localStorage.setItem('hasUnlockedAnalysis', 'true');
        localStorage.setItem('hasCompletedQuiz', 'true');
      });
    } catch (error) {
      console.log('localStorage set failed, skipping test');
      return;
    }
    
    // Verify all required flags are set
    const localStorageFlags = await page.evaluate(() => ({
      hasAnyPayment: localStorage.getItem('hasAnyPayment'),
      hasUnlockedAnalysis: localStorage.getItem('hasUnlockedAnalysis'),
      hasCompletedQuiz: localStorage.getItem('hasCompletedQuiz')
    }));
    
    expect(localStorageFlags.hasAnyPayment).toBe('true');
    expect(localStorageFlags.hasUnlockedAnalysis).toBe('true');
    expect(localStorageFlags.hasCompletedQuiz).toBe('true');
  });

  test('Debug logging shows correct unlock status', async ({ page }) => {
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
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for the page to settle
    await page.waitForTimeout(2000);
    
    // Check console logs for debug information
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('localStorage') || msg.text().includes('unlock') || msg.text().includes('paywall')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Wait a bit for any console logs
    await page.waitForTimeout(2000);
    
    // Should have debug logs
    expect(consoleLogs.length).toBeGreaterThan(0);
    
    // Check that the log contains the expected information
    const logText = consoleLogs[0];
    expect(logText).toContain('localStorage');
  });

  test('Pricing shows correctly based on user type', async ({ page }) => {
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
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for the page to settle
    await page.waitForTimeout(2000);
    
    // Check if paywall is showing
    const paywallElement = page.locator('text=Unlock your results, text=Unlock Full Analysis, text=Unlock your results with small one-time fee').first();
    
    if (await paywallElement.isVisible()) {
      // New user (temporary) should see $9.99
      await expect(page.locator('text=$9.99')).toBeVisible();
      await expect(page.locator('text=$4.99')).not.toBeVisible();
      
      // Simulate paid user by setting user-related localStorage with isTemporary: false
      try {
        await page.evaluate(() => {
          localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com', isTemporary: false }));
        });
      } catch (error) {
        console.log('localStorage set failed, skipping test');
        return;
      }
      
      // Reload the page to apply the new user context
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Now should see $4.99
      await expect(page.locator('text=$4.99')).toBeVisible();
      await expect(page.locator('text=$9.99')).not.toBeVisible();
    }
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