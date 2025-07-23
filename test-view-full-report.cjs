const puppeteer = require('puppeteer');

async function testViewFullReport() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('Testing View Full Report functionality...');
    
    // Navigate to the dashboard
    await page.goto('http://localhost:5073/dashboard');
    console.log('✓ Navigated to dashboard');
    
    // Wait for the page to load
    await page.waitForSelector('button', { timeout: 10000 });
    console.log('✓ Dashboard loaded');
    
    // Look for the "View Full Report" button
    const viewFullReportButton = await page.$('button:has-text("View Full Report")');
    if (!viewFullReportButton) {
      console.log('❌ View Full Report button not found');
      return;
    }
    
    console.log('✓ Found View Full Report button');
    
    // Click the View Full Report button
    await viewFullReportButton.click();
    console.log('✓ Clicked View Full Report button');
    
    // Wait for navigation to results page
    await page.waitForTimeout(2000);
    
    // Check if we're on the results page
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('/results')) {
      console.log('✓ Successfully navigated to results page');
      
      // Check if full report is being shown or paywall is displayed
      await page.waitForTimeout(3000);
      
      // Look for either the full report content or paywall modal
      const fullReportContent = await page.$('[data-testid="full-report"]');
      const paywallModal = await page.$('[data-testid="paywall-modal"]');
      
      if (fullReportContent) {
        console.log('✓ Full report is being displayed');
      } else if (paywallModal) {
        console.log('✓ Paywall modal is displayed (expected for unpaid users)');
      } else {
        console.log('⚠️ Neither full report nor paywall detected - checking page content');
        
        // Check for common elements
        const pageContent = await page.content();
        if (pageContent.includes('Full Report') || pageContent.includes('Executive Summary')) {
          console.log('✓ Full report content detected in page');
        } else if (pageContent.includes('Unlock') || pageContent.includes('Purchase')) {
          console.log('✓ Paywall content detected in page');
        } else {
          console.log('❌ Unexpected page content');
        }
      }
    } else {
      console.log('❌ Failed to navigate to results page');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testViewFullReport(); 