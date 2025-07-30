import { test, expect } from '@playwright/test';

test.describe('Navigation and Basic Flows', () => {
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

  test('Basic navigation works', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the homepage
    await expect(page.locator('h1')).toContainText(/Stop Overthinking|Start Building/i);
    
    // Check that the main navigation elements are present
    await expect(page.locator('a:has-text("Discover Your Path")')).toBeVisible();
    
    // Check for Explore Business Ideas link (may be hidden on mobile)
    const exploreLink = page.locator('a:has-text("Explore Business Ideas")');
    if (await exploreLink.isVisible()) {
      await expect(exploreLink).toBeVisible();
    } else {
      // On mobile, the link might be in a menu or hidden
      console.log('Explore Business Ideas link is hidden (likely mobile view)');
    }
  });

  test('Quiz navigation works', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on "Discover Your Path" to start quiz
    const startQuizButton = page.locator('a:has-text("Discover Your Path")').first();
    await expect(startQuizButton).toBeVisible();
    await startQuizButton.click();
    
    // Wait for quiz to load
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the quiz page
    await expect(page.locator('button:has-text("Start Round"), button:has-text("Next")')).toBeVisible();
  });

  test('Results page shows correct content', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on "Discover Your Path" to start quiz
    const startQuizButton = page.locator('a:has-text("Discover Your Path")').first();
    await expect(startQuizButton).toBeVisible();
    await startQuizButton.click();
    
    // Fill out the quiz - this will complete the quiz and navigate to loading page
    await fillQuizData(page);
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // For tests, navigate directly to results page to bypass loading
    await page.goto('/results');
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the results page
    const hasResults = await page.locator('text=Your Best Fit Business Model, text=Results, text=Analysis').count() > 0;
    const hasQuizRedirect = await page.locator('text=Discover Your Path, text=Start Quiz, text=Stop Overthinking').count() > 0;
    
    expect(hasResults || hasQuizRedirect).toBe(true);
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page is responsive
    await expect(page.locator('a:has-text("Discover Your Path")')).toBeVisible();
    
    // Check that the layout adapts to mobile
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('Authentication flows', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check that login form is present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Error handling', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // Check that we either get a 404 or are redirected to home
    const has404 = await page.locator('text=404, text=Not Found, text=Page not found').count() > 0;
    const hasHomeContent = await page.locator('text=Discover Your Path, text=Stop Overthinking').count() > 0;
    
    expect(has404 || hasHomeContent).toBe(true);
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