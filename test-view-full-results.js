import puppeteer from 'puppeteer';

async function testViewFullResults() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('🧪 Testing View Full Results functionality...');
    
    // Navigate to the dashboard
    await page.goto('http://localhost:5073/dashboard');
    console.log('✅ Navigated to dashboard');
    
    // Wait for the page to load
    await page.waitForSelector('button', { timeout: 10000 });
    console.log('✅ Dashboard loaded');
    
    // Look for the "View Full Results" button using evaluate
    const buttonFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(button => button.textContent.includes('View Full Results'));
      if (button) {
        button.click();
        return true;
      }
      return false;
    });
    
    if (!buttonFound) {
      console.log('❌ View Full Results button not found');
      return;
    }
    
    console.log('✅ Found and clicked View Full Results button');
    
    // Wait for navigation to results page
    await page.waitForTimeout(3000);
    
    // Check if we're on the results page
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/results')) {
      console.log('✅ Successfully navigated to results page');
      
      // Wait a bit more for the page to fully load
      await page.waitForTimeout(2000);
      
      // Check if full report is being shown or paywall is displayed
      const pageContent = await page.content();
      
      if (pageContent.includes('Full Report') || pageContent.includes('Executive Summary')) {
        console.log('✅ Full report content detected');
      } else if (pageContent.includes('Unlock') || pageContent.includes('Purchase') || pageContent.includes('Paywall')) {
        console.log('✅ Paywall content detected (expected for unpaid users)');
      } else if (pageContent.includes('Loading') || pageContent.includes('Generating')) {
        console.log('⏳ Loading state detected - waiting for content...');
        await page.waitForTimeout(3000);
        
        // Check again after waiting
        const updatedContent = await page.content();
        if (updatedContent.includes('Full Report') || updatedContent.includes('Executive Summary')) {
          console.log('✅ Full report content detected after loading');
        } else if (updatedContent.includes('Unlock') || updatedContent.includes('Purchase')) {
          console.log('✅ Paywall content detected after loading');
        } else {
          console.log('⚠️ Unexpected content after loading');
        }
      } else {
        console.log('⚠️ Unexpected page content - checking for common elements');
        
        // Check for any business model content
        if (pageContent.includes('Business Model') || pageContent.includes('Content Creation') || pageContent.includes('Freelancing')) {
          console.log('✅ Business model content detected');
        } else {
          console.log('❌ No recognizable content found');
        }
      }
      
      // Check browser console for any errors
      const logs = await page.evaluate(() => {
        return window.console.logs || [];
      });
      
      if (logs.length > 0) {
        console.log('📝 Console logs:', logs.slice(-5)); // Show last 5 logs
      }
      
    } else {
      console.log('❌ Failed to navigate to results page');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Also test the quick action "View Full Report" button
async function testQuickActionViewFullReport() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('\n🧪 Testing Quick Action "View Full Report" button...');
    
    // Navigate to the dashboard
    await page.goto('http://localhost:5073/dashboard');
    console.log('✅ Navigated to dashboard');
    
    // Wait for the page to load
    await page.waitForSelector('button', { timeout: 10000 });
    console.log('✅ Dashboard loaded');
    
    // Look for the "View Full Report" button in quick actions using evaluate
    const buttonFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(button => button.textContent.includes('View Full Report'));
      if (button) {
        button.click();
        return true;
      }
      return false;
    });
    
    if (!buttonFound) {
      console.log('❌ View Full Report button not found in quick actions');
      return;
    }
    
    console.log('✅ Found and clicked View Full Report button in quick actions');
    
    // Wait for navigation to results page
    await page.waitForTimeout(3000);
    
    // Check if we're on the results page
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/results')) {
      console.log('✅ Successfully navigated to results page from quick action');
      
      // Wait a bit more for the page to fully load
      await page.waitForTimeout(2000);
      
      // Check if full report is being shown or paywall is displayed
      const pageContent = await page.content();
      
      if (pageContent.includes('Full Report') || pageContent.includes('Executive Summary')) {
        console.log('✅ Full report content detected from quick action');
      } else if (pageContent.includes('Unlock') || pageContent.includes('Purchase')) {
        console.log('✅ Paywall content detected from quick action (expected for unpaid users)');
      } else {
        console.log('⚠️ Unexpected content from quick action');
      }
    } else {
      console.log('❌ Failed to navigate to results page from quick action');
    }
    
  } catch (error) {
    console.error('❌ Quick action test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run both tests
async function runAllTests() {
  console.log('🚀 Starting View Full Results functionality tests...\n');
  
  await testViewFullResults();
  await testQuickActionViewFullReport();
  
  console.log('\n🎉 All tests completed!');
}

runAllTests(); 